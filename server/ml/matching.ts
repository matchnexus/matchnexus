import {
  InternshipCategory,
  Prisma,
  ProficiencyLevel,
  RecommendationContext,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const LEVEL_RANK: Record<ProficiencyLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

const SKILL_ALIASES: Record<string, string> = {
  reactjs: "react",
  "react.js": "react",
  "full stack": "fullstack",
  "full-stack": "fullstack",
  fullstackdeveloper: "fullstack",
  "front end": "frontend",
  "front-end": "frontend",
  frontenddeveloper: "frontend",
  "back end": "backend",
  "back-end": "backend",
  backenddeveloper: "backend",
  js: "javascript",
  ts: "typescript",
  nodejs: "node",
  "node.js": "node",
  qa: "quality assurance",
  "quality-assurance": "quality assurance",
  "quality assurance engineer": "quality assurance",
  "software qa": "quality assurance",
  "manual testing": "testing",
  "software testing": "testing",
};

const DECIMAL_TWO_DP = 100;

const SCORE_WEIGHTS = {
  required: 0.42,
  optional: 0.1,
  education: 0.14,
  experience: 0.08,
  category: 0.1,
  textSkill: 0.16,
} as const;

const REQUIRED_EMPTY_BASELINE = 55;
const OPTIONAL_EMPTY_BASELINE = 70;
const MAX_REQUIRED_MISSING_PENALTY = 24;
const REQUIRED_MISSING_PENALTY_PER_SKILL = 6;

type ScoreBreakdown = {
  overallScore: number;
  requiredSkillsScore: number;
  optionalSkillsScore: number;
  educationScore: number;
  experienceScore: number;
  categoryAlignmentScore: number;
  textSkillAlignmentScore: number;
  missingRequiredPenalty: number;
  matchedRequiredSkills: string[];
  matchedOptionalSkills: string[];
  missingRequiredSkills: string[];
  missingOptionalSkills: string[];
  matchReasonSummary: string;
  isRecommended: boolean;
};

type StudentWithSignals = Prisma.StudentGetPayload<{
  include: {
    skills: {
      include: {
        skill: true;
      };
    };
    resumes: true;
    applications: {
      select: {
        id: true;
      };
    };
  };
}>;

type PostWithSkills = Prisma.InternshipPostGetPayload<{
  include: {
    requiredSkills: true;
    optionalSkills: true;
    postSkills: {
      include: {
        skill: true;
      };
    };
  };
}>;

function normalizeSkillName(input: string): string {
  const cleaned = input.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] ?? cleaned;
}

function toTwoDecimals(value: number): number {
  return Math.round(value * DECIMAL_TWO_DP) / DECIMAL_TWO_DP;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function stringifySkill(name: string, level?: ProficiencyLevel | null): string {
  return level ? `${name} (${level})` : name;
}

function getPostSkillSets(post: PostWithSkills): {
  required: Array<{ name: string; level: ProficiencyLevel | null }>;
  optional: Array<{ name: string; level: ProficiencyLevel | null }>;
} {
  const requiredSkills = Array.isArray(post.requiredSkills) ? post.requiredSkills : [];
  const optionalSkills = Array.isArray(post.optionalSkills) ? post.optionalSkills : [];
  const postSkills = Array.isArray(post.postSkills) ? post.postSkills : [];

  const required: Array<{ name: string; level: ProficiencyLevel | null }> = requiredSkills.map((item) => ({
    name: normalizeSkillName(item.skillName),
    level: item.proficiencyLevel,
  }));

  const optional: Array<{ name: string; level: ProficiencyLevel | null }> = optionalSkills.map((item) => ({
    name: normalizeSkillName(item.skillName),
    level: item.proficiencyLevel,
  }));

  for (const item of postSkills) {
    const normalized = normalizeSkillName(item.skill.name);
    if (item.required) {
      if (!required.some((skill) => skill.name === normalized)) {
        required.push({ name: normalized, level: item.level ?? null });
      }
    } else if (!optional.some((skill) => skill.name === normalized)) {
      optional.push({ name: normalized, level: item.level ?? null });
    }
  }

  return { required, optional };
}

function getStudentSkillMap(student: StudentWithSignals): Map<string, ProficiencyLevel | null> {
  const skillMap = new Map<string, ProficiencyLevel | null>();
  for (const row of student.skills) {
    skillMap.set(normalizeSkillName(row.skill.name), row.level ?? null);
  }
  return skillMap;
}

function levelMatchFactor(
  studentLevel: ProficiencyLevel | null,
  requiredLevel: ProficiencyLevel | null
): number {
  if (!requiredLevel) {
    return studentLevel ? 1 : 0.85;
  }

  if (!studentLevel) {
    return 0.65;
  }

  const studentRank = LEVEL_RANK[studentLevel];
  const requiredRank = LEVEL_RANK[requiredLevel];

  if (studentRank >= requiredRank) {
    return 1;
  }

  return clamp(studentRank / requiredRank, 0.5, 1);
}

function computeSkillScore(
  requestedSkills: Array<{ name: string; level: ProficiencyLevel | null }>,
  studentSkillMap: Map<string, ProficiencyLevel | null>,
  emptyScore = 100
): {
  score: number;
  matched: string[];
  missing: string[];
} {
  if (!requestedSkills.length) {
    return { score: emptyScore, matched: [], missing: [] };
  }

  let total = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requestedSkills) {
    const studentLevel = studentSkillMap.get(skill.name);
    if (studentLevel !== undefined) {
      total += levelMatchFactor(studentLevel, skill.level);
      matched.push(stringifySkill(skill.name, studentLevel));
    } else {
      missing.push(stringifySkill(skill.name, skill.level));
    }
  }

  return {
    score: toTwoDecimals((total / requestedSkills.length) * 100),
    matched,
    missing,
  };
}

function computeEducationScore(student: StudentWithSignals, post: PostWithSkills): number {
  const degreeBase = student.degreeType === "GRADUATE" ? 80 : 70;
  const zScorePart = student.zScore ? clamp(Number(student.zScore) * 5, 0, 20) : 0;

  const textBlob = `${post.title} ${post.description} ${post.techStack ?? ""} ${
    post.keyRequirements ?? ""
  }`
    .toLowerCase()
    .trim();
  const departmentPart = textBlob.includes(student.department.toLowerCase()) ? 10 : 0;

  return toTwoDecimals(clamp(degreeBase + zScorePart + departmentPart, 0, 100));
}

function computeExperienceScore(student: StudentWithSignals): number {
  let score = 0;

  if (student.resumes.length > 0) score += 25;
  if (student.githubLink) score += 20;
  if (student.linkedinLink) score += 15;
  if (student.personalPortfolio) score += 15;

  const priorApplications = clamp(student.applications.length * 3, 0, 25);
  score += priorApplications;

  return toTwoDecimals(clamp(score, 0, 100));
}

function inferStudentCategoryTrack(
  student: StudentWithSignals
): InternshipCategory | null {
  const externalHint = (student as any).aiTrackHint as InternshipCategory | null | undefined;
  if (externalHint === "COMPUTING" || externalHint === "BUSINESS" || externalHint === "ENGINEERING") {
    return externalHint;
  }

  const text = `${student.department} ${student.degreeType}`.toLowerCase();

  if (
    text.includes("comput") ||
    text.includes("software") ||
    text.includes("it") ||
    text.includes("data") ||
    text.includes("ai")
  ) {
    return "COMPUTING";
  }

  if (
    text.includes("business") ||
    text.includes("finance") ||
    text.includes("account") ||
    text.includes("market") ||
    text.includes("manage")
  ) {
    return "BUSINESS";
  }

  if (
    text.includes("engineer") ||
    text.includes("mechanical") ||
    text.includes("electrical") ||
    text.includes("civil") ||
    text.includes("electronic")
  ) {
    return "ENGINEERING";
  }

  return null;
}

function computeCategoryAlignmentScore(
  student: StudentWithSignals,
  post: PostWithSkills
): number {
  const studentTrack = inferStudentCategoryTrack(student);

  if (!post.category && !studentTrack) return 70;
  if (!post.category || !studentTrack) return 65;
  if (post.category === studentTrack) return 100;

  return 40;
}

function getPostTextBlob(post: PostWithSkills): string {
  return `${post.title} ${post.description} ${post.responsibilities ?? ""} ${
    post.keyRequirements ?? ""
  } ${post.techStack ?? ""}`
    .toLowerCase()
    .trim();
}

function computeTextSkillAlignmentScore(
  studentSkillMap: Map<string, ProficiencyLevel | null>,
  post: PostWithSkills,
  requestedSkills: Array<{ name: string; level: ProficiencyLevel | null }>
): number {
  const studentSkills = Array.from(studentSkillMap.keys());
  if (!studentSkills.length) return 50;

  const textBlob = getPostTextBlob(post);
  if (!textBlob) return 35;

  const requestedSet = new Set(requestedSkills.map((skill) => skill.name));
  if (requestedSet.size > 0) {
    let matchedRequested = 0;
    for (const requestedSkill of requestedSet) {
      if (studentSkillMap.has(requestedSkill)) {
        matchedRequested += 1;
      }
    }

    const requestedCoverage = matchedRequested / requestedSet.size;
    return toTwoDecimals(clamp(30 + requestedCoverage * 70, 0, 100));
  }

  let matched = 0;
  for (const skill of studentSkills) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^a-z0-9+.#-])${escaped}([^a-z0-9+.#-]|$)`);
    if (pattern.test(textBlob)) {
      matched += 1;
    }
  }

  if (matched === 0) return 20;

  const ratio = matched / Math.max(Math.min(studentSkills.length, 12), 1);
  return toTwoDecimals(clamp(35 + ratio * 65, 0, 100));
}

function computeRequiredMissingPenalty(missingCount: number): number {
  return clamp(
    missingCount * REQUIRED_MISSING_PENALTY_PER_SKILL,
    0,
    MAX_REQUIRED_MISSING_PENALTY
  );
}

function computeReasonText(
  requiredScore: number,
  optionalScore: number,
  educationScore: number,
  experienceScore: number,
  categoryAlignmentScore: number,
  textSkillAlignmentScore: number,
  missingRequiredPenalty: number,
  matchedRequired: string[],
  missingRequired: string[]
): string {
  const highlights: string[] = [];

  highlights.push(
    `Required skills: ${requiredScore.toFixed(1)}%, Optional skills: ${optionalScore.toFixed(1)}%`
  );
  highlights.push(
    `Education: ${educationScore.toFixed(1)}%, Experience signal: ${experienceScore.toFixed(1)}%, Category alignment: ${categoryAlignmentScore.toFixed(1)}%, Text/skill alignment: ${textSkillAlignmentScore.toFixed(1)}%`
  );

  if (missingRequiredPenalty > 0) {
    highlights.push(`Penalty for missing required skills: -${missingRequiredPenalty.toFixed(1)} points`);
  }

  if (matchedRequired.length) {
    highlights.push(`Strong matches: ${matchedRequired.slice(0, 5).join(", ")}`);
  }

  if (missingRequired.length) {
    highlights.push(`Missing required: ${missingRequired.slice(0, 4).join(", ")}`);
  }

  return highlights.join(". ");
}

export function calculateMatchScore(
  student: StudentWithSignals,
  post: PostWithSkills
): ScoreBreakdown {
  const { required, optional } = getPostSkillSets(post);
  const studentSkillMap = getStudentSkillMap(student);

  const requiredResult = computeSkillScore(
    required,
    studentSkillMap,
    REQUIRED_EMPTY_BASELINE
  );
  const optionalResult = computeSkillScore(
    optional,
    studentSkillMap,
    OPTIONAL_EMPTY_BASELINE
  );
  const educationScore = computeEducationScore(student, post);
  const experienceScore = computeExperienceScore(student);
  const categoryAlignmentScore = computeCategoryAlignmentScore(student, post);
  const textSkillAlignmentScore = computeTextSkillAlignmentScore(
    studentSkillMap,
    post,
    [...required, ...optional]
  );
  const missingRequiredPenalty = computeRequiredMissingPenalty(
    requiredResult.missing.length
  );

  const overall =
    requiredResult.score * SCORE_WEIGHTS.required +
    optionalResult.score * SCORE_WEIGHTS.optional +
    educationScore * SCORE_WEIGHTS.education +
    experienceScore * SCORE_WEIGHTS.experience +
    categoryAlignmentScore * SCORE_WEIGHTS.category +
    textSkillAlignmentScore * SCORE_WEIGHTS.textSkill -
    missingRequiredPenalty;

  const overallScore = toTwoDecimals(clamp(overall, 0, 100));
  const isRecommended =
    overallScore >= 70 &&
    categoryAlignmentScore >= 55 &&
    (required.length === 0
      ? textSkillAlignmentScore >= 45
      : requiredResult.score >= 60) &&
    requiredResult.missing.length <= 2;

  return {
    overallScore,
    requiredSkillsScore: requiredResult.score,
    optionalSkillsScore: optionalResult.score,
    educationScore,
    experienceScore,
    categoryAlignmentScore,
    textSkillAlignmentScore,
    missingRequiredPenalty,
    matchedRequiredSkills: requiredResult.matched,
    matchedOptionalSkills: optionalResult.matched,
    missingRequiredSkills: requiredResult.missing,
    missingOptionalSkills: optionalResult.missing,
    matchReasonSummary: computeReasonText(
      requiredResult.score,
      optionalResult.score,
      educationScore,
      experienceScore,
      categoryAlignmentScore,
      textSkillAlignmentScore,
      missingRequiredPenalty,
      requiredResult.matched,
      requiredResult.missing
    ),
    isRecommended,
  };
}

async function upsertPostAnalytics(postId: string): Promise<void> {
  const [
    totalApplicants,
    totalViewed,
    totalShortlisted,
    totalInterview,
    totalAccepted,
    totalRejected,
    scoreAggregate,
    lastApplication,
  ] = await Promise.all([
    prisma.application.count({ where: { postId } }),
    prisma.application.count({ where: { postId, isViewedByCompany: true } }),
    prisma.application.count({ where: { postId, status: "SHORTLISTED" } }),
    prisma.application.count({ where: { postId, status: "INTERVIEW" } }),
    prisma.application.count({ where: { postId, status: "ACCEPTED" } }),
    prisma.application.count({ where: { postId, status: "REJECTED" } }),
    prisma.applicationMlScore.aggregate({
      where: { postId },
      _avg: { overallScore: true },
      _max: { overallScore: true },
    }),
    prisma.application.findFirst({
      where: { postId },
      orderBy: { appliedAt: "desc" },
      select: { appliedAt: true },
    }),
  ]);

  await prisma.postApplicantAnalytics.upsert({
    where: { postId },
    create: {
      postId,
      totalApplicants,
      totalViewed,
      totalShortlisted,
      totalInterview,
      totalAccepted,
      totalRejected,
      avgMatchScore: scoreAggregate._avg.overallScore ?? null,
      topApplicantScore: scoreAggregate._max.overallScore ?? null,
      lastApplicationAt: lastApplication?.appliedAt ?? null,
    },
    update: {
      totalApplicants,
      totalViewed,
      totalShortlisted,
      totalInterview,
      totalAccepted,
      totalRejected,
      avgMatchScore: scoreAggregate._avg.overallScore ?? null,
      topApplicantScore: scoreAggregate._max.overallScore ?? null,
      lastApplicationAt: lastApplication?.appliedAt ?? null,
    },
  });
}

export async function recomputeApplicationScoresForPost(postId: string): Promise<{
  applicationsScored: number;
}> {
  const applications = await prisma.application.findMany({
    where: { postId },
    include: {
      student: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          resumes: true,
          applications: {
            select: {
              id: true,
            },
          },
        },
      },
      post: {
        include: {
          requiredSkills: true,
          optionalSkills: true,
          postSkills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
  });

  if (!applications.length) {
    await prisma.applicationMlScore.deleteMany({ where: { postId } });
    await prisma.recommendationScore.deleteMany({
      where: { postId, context: RecommendationContext.COMPANY_RANKING },
    });
    await upsertPostAnalytics(postId);
    return { applicationsScored: 0 };
  }

  const scored = applications
    .map((application) => {
      const result = calculateMatchScore(application.student, application.post);
      return {
        application,
        result,
      };
    })
    .sort((a, b) => b.result.overallScore - a.result.overallScore);

  await prisma.$transaction(
    scored.flatMap((entry, index) => {
      const rank = index + 1;
      const result = entry.result;
      const matchedRequired = result.matchedRequiredSkills.join(", ");
      const matchedOptional = result.matchedOptionalSkills.join(", ");
      const missingRequired = result.missingRequiredSkills.join(", ");

      return [
        prisma.applicationMlScore.upsert({
          where: { applicationId: entry.application.id },
          create: {
            applicationId: entry.application.id,
            postId: entry.application.postId,
            studentId: entry.application.studentId,
            overallScore: result.overallScore,
            requiredSkillsScore: result.requiredSkillsScore,
            optionalSkillsScore: result.optionalSkillsScore,
            experienceScore: result.experienceScore,
            educationScore: result.educationScore,
            rankPosition: rank,
            matchedRequiredSkills: matchedRequired,
            matchedOptionalSkills: matchedOptional,
            missingRequiredSkills: missingRequired,
            matchReasonSummary: result.matchReasonSummary,
            isRecommended: result.isRecommended,
          },
          update: {
            overallScore: result.overallScore,
            requiredSkillsScore: result.requiredSkillsScore,
            optionalSkillsScore: result.optionalSkillsScore,
            experienceScore: result.experienceScore,
            educationScore: result.educationScore,
            rankPosition: rank,
            matchedRequiredSkills: matchedRequired,
            matchedOptionalSkills: matchedOptional,
            missingRequiredSkills: missingRequired,
            matchReasonSummary: result.matchReasonSummary,
            isRecommended: result.isRecommended,
            calculatedAt: new Date(),
          },
        }),
        prisma.recommendationScore.upsert({
          where: {
            studentId_postId_context: {
              studentId: entry.application.studentId,
              postId: entry.application.postId,
              context: RecommendationContext.COMPANY_RANKING,
            },
          },
          create: {
            studentId: entry.application.studentId,
            postId: entry.application.postId,
            context: RecommendationContext.COMPANY_RANKING,
            score: result.overallScore,
            rank,
            matchedSkills: result.matchedRequiredSkills,
            missingSkills: result.missingRequiredSkills,
            reason: result.matchReasonSummary,
            modelVersion: "v1.0.0-rule-based",
          },
          update: {
            score: result.overallScore,
            rank,
            matchedSkills: result.matchedRequiredSkills,
            missingSkills: result.missingRequiredSkills,
            reason: result.matchReasonSummary,
            modelVersion: "v1.0.0-rule-based",
          },
        }),
      ];
    })
  );

  await upsertPostAnalytics(postId);

  return { applicationsScored: scored.length };
}

export async function recomputeStudentFeedRecommendations(
  studentId: string
): Promise<{ postsScored: number }> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      resumes: true,
      applications: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!student) {
    return { postsScored: 0 };
  }

  const posts = await prisma.internshipPost.findMany({
    where: { status: "ACTIVE" },
    include: {
      requiredSkills: true,
      optionalSkills: true,
      postSkills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!posts.length) {
    await prisma.recommendationScore.deleteMany({
      where: {
        studentId,
        context: RecommendationContext.STUDENT_FEED,
      },
    });
    return { postsScored: 0 };
  }

  const scored = posts
    .map((post) => {
      const result = calculateMatchScore(student, post);
      return { postId: post.id, result };
    })
    .sort((a, b) => b.result.overallScore - a.result.overallScore);

  await prisma.$transaction(
    scored.map((entry, index) => {
      const rank = index + 1;
      return prisma.recommendationScore.upsert({
        where: {
          studentId_postId_context: {
            studentId,
            postId: entry.postId,
            context: RecommendationContext.STUDENT_FEED,
          },
        },
        create: {
          studentId,
          postId: entry.postId,
          context: RecommendationContext.STUDENT_FEED,
          score: entry.result.overallScore,
          rank,
          matchedSkills: [
            ...entry.result.matchedRequiredSkills,
            ...entry.result.matchedOptionalSkills,
          ],
          missingSkills: entry.result.missingRequiredSkills,
          reason: entry.result.matchReasonSummary,
          modelVersion: "v1.0.0-rule-based",
        },
        update: {
          score: entry.result.overallScore,
          rank,
          matchedSkills: [
            ...entry.result.matchedRequiredSkills,
            ...entry.result.matchedOptionalSkills,
          ],
          missingSkills: entry.result.missingRequiredSkills,
          reason: entry.result.matchReasonSummary,
          modelVersion: "v1.0.0-rule-based",
        },
      });
    })
  );

  return { postsScored: scored.length };
}

export async function recomputeAllMatchingData(): Promise<{
  postsProcessed: number;
  studentsProcessed: number;
  applicationScoresComputed: number;
  recommendationScoresComputed: number;
}> {
  const [posts, students] = await Promise.all([
    prisma.internshipPost.findMany({
      select: { id: true },
    }),
    prisma.student.findMany({
      select: { id: true },
    }),
  ]);

  let applicationsComputed = 0;
  let recommendationsComputed = 0;

  for (const post of posts) {
    const result = await recomputeApplicationScoresForPost(post.id);
    applicationsComputed += result.applicationsScored;
  }

  for (const student of students) {
    const result = await recomputeStudentFeedRecommendations(student.id);
    recommendationsComputed += result.postsScored;
  }

  return {
    postsProcessed: posts.length,
    studentsProcessed: students.length,
    applicationScoresComputed: applicationsComputed,
    recommendationScoresComputed: recommendationsComputed,
  };
}
