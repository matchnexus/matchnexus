import { Prisma, RecommendationContext } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/server/ml/matching";
import { analyzeResumeWithExternalApi } from "@/server/ml/ai";
import { runPythonCvJobRanker } from "@/server/ml/python-recommender";
import {
  extractResumeTextFromPath,
  extractSkillsFromResumeText,
} from "@/server/ml/resume";

const recommendationInclude = {
  company: true,
  requiredSkills: true,
  optionalSkills: true,
  postSkills: {
    include: {
      skill: true,
    },
  },
} satisfies Prisma.InternshipPostInclude;

const studentInclude = {
  skills: {
    include: {
      skill: true,
    },
  },
  resumes: {
    orderBy: { uploadedAt: "desc" as const },
    take: 1,
  },
  applications: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.StudentInclude;

export type StudentRecommendationRow = {
  id: string;
  title: string;
  companyName: string;
  location: string | null;
  workType: string | null;
  applicationDeadline: Date;
  score: number;
  qualified: boolean;
  rank: number;
  matchedRequiredSkills: string[];
  matchedOptionalSkills: string[];
  missingRequiredSkills: string[];
  missingOptionalSkills: string[];
  reason: string;
  resumeSkills: string[];
  pythonScore?: number;
  pythonConfidence?: number;
};

export type CompanyApplicantRankRow = {
  id: string;
  postId: string;
  postTitle: string;
  companyName: string;
  applicants: Array<{
    applicationId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    overallScore: number;
    requiredSkillsScore: number;
    optionalSkillsScore: number;
    educationScore: number;
    experienceScore: number;
    rankPosition: number;
    isRecommended: boolean;
    matchedRequiredSkills: string[];
    missingRequiredSkills: string[];
    reason: string;
    cvSkills: string[];
  }>;
};

type RoleFamily = "qa" | "data" | "fullstack" | "frontend" | "backend" | "software";

const ROLE_FAMILY_KEYWORDS: Record<RoleFamily, string[]> = {
  qa: ["qa", "quality assurance", "test", "testing", "automation", "selenium", "cypress"],
  data: ["data", "analyst", "analytics", "sql", "power bi", "tableau", "statistics"],
  fullstack: ["full stack", "fullstack"],
  frontend: ["front end", "frontend", "react", "next.js", "nextjs", "ui", "ux"],
  backend: ["back end", "backend", "api", "node", "spring", "django", "database"],
  software: ["software engineer", "software", "developer", "programming", "oop"],
};

const ROLE_COMPATIBILITY: Record<RoleFamily, Partial<Record<RoleFamily, number>>> = {
  qa: {
    qa: 1,
    software: 0.65,
    backend: 0.35,
    frontend: 0.3,
    data: 0.25,
    fullstack: 0.2,
  },
  data: {
    data: 1,
    software: 0.55,
    backend: 0.4,
    frontend: 0.25,
    fullstack: 0.3,
    qa: 0.2,
  },
  fullstack: {
    fullstack: 1,
    frontend: 0.8,
    backend: 0.8,
    software: 0.7,
    data: 0.25,
    qa: 0.2,
  },
  frontend: {
    frontend: 1,
    fullstack: 0.85,
    software: 0.6,
    backend: 0.4,
    data: 0.2,
    qa: 0.2,
  },
  backend: {
    backend: 1,
    fullstack: 0.85,
    software: 0.7,
    frontend: 0.4,
    data: 0.35,
    qa: 0.3,
  },
  software: {
    software: 1,
    backend: 0.75,
    frontend: 0.6,
    fullstack: 0.7,
    data: 0.45,
    qa: 0.55,
  },
};

function inferRoleFamily(text: string): RoleFamily | null {
  const normalized = text.toLowerCase();
  let best: RoleFamily | null = null;
  let bestHits = 0;

  (Object.keys(ROLE_FAMILY_KEYWORDS) as RoleFamily[]).forEach((family) => {
    const hits = ROLE_FAMILY_KEYWORDS[family].reduce(
      (count, keyword) => count + (normalized.includes(keyword) ? 1 : 0),
      0
    );
    if (hits > bestHits) {
      bestHits = hits;
      best = family;
    }
  });

  return bestHits > 0 ? best : null;
}

function inferRoleFamilyFromResumeIntent(resumeText: string): RoleFamily | null {
  const normalized = resumeText.toLowerCase();

  const qaIntentPatterns = [
    /seeking[^.\n]{0,80}(quality assurance|qa|software testing)/,
    /(quality assurance|qa)[^.\n]{0,60}(intern|internship|engineer|role)/,
  ];
  if (qaIntentPatterns.some((pattern) => pattern.test(normalized))) {
    return "qa";
  }

  const dataIntentPatterns = [
    /seeking[^.\n]{0,80}(data analyst|data analysis|analytics)/,
    /(data analyst|analytics)[^.\n]{0,60}(intern|internship|role)/,
  ];
  if (dataIntentPatterns.some((pattern) => pattern.test(normalized))) {
    return "data";
  }

  return null;
}

function inferStudentRoleFamily(
  aiRole: string | null | undefined,
  resumeSkills: string[],
  resumeText: string
): RoleFamily | null {
  const explicitIntent = inferRoleFamilyFromResumeIntent(resumeText);
  if (explicitIntent) {
    return explicitIntent;
  }

  const source = `${aiRole ?? ""} ${resumeSkills.join(" ")} ${resumeText}`.trim();
  if (!source) return null;
  return inferRoleFamily(source);
}

function computeRoleFitAdjustment(
  studentFamily: RoleFamily | null,
  postTitle: string,
  postDescription: string
): { adjustment: number; postFamily: RoleFamily | null } {
  if (!studentFamily) {
    return { adjustment: 0, postFamily: null };
  }

  const postFamily = inferRoleFamily(`${postTitle} ${postDescription}`);
  if (!postFamily) {
    return { adjustment: 0, postFamily: null };
  }

  const compatibility = ROLE_COMPATIBILITY[studentFamily][postFamily] ?? 0.5;
  const adjustment = Number(((compatibility - 0.5) * 24).toFixed(2));
  return { adjustment, postFamily };
}

function buildMergedStudent(
  student: Prisma.StudentGetPayload<{ include: typeof studentInclude }>,
  resumeSkills: string[],
  aiTrackHint: "COMPUTING" | "BUSINESS" | "ENGINEERING" | null = null
) {
  const existingSkills = student.skills.map((entry) => ({
    skill: entry.skill,
    level: entry.level,
  }));

  const mergedSkills = [...existingSkills];
  for (const skillName of resumeSkills) {
    const alreadyPresent = mergedSkills.some(
      (entry) => entry.skill.name.toLowerCase() === skillName.toLowerCase()
    );
    if (!alreadyPresent) {
      mergedSkills.push({
        skill: { name: skillName } as Prisma.SkillGetPayload<{}>,
        level: null,
      });
    }
  }

  return {
    ...student,
    skills: mergedSkills,
    aiTrackHint,
  };
}

export async function getStudentJobRecommendations(studentUserId: string) {
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId },
    include: studentInclude,
  });

  if (!student) {
    return {
      resumeText: "",
      resumeSkills: [] as string[],
      exactMatches: [] as StudentRecommendationRow[],
      nearMatches: [] as StudentRecommendationRow[],
    };
  }

  const resumePath = student.resumes[0]?.filePath ?? null;
  const resumeText = resumePath ? await extractResumeTextFromPath(resumePath) : "";
  const catalogSkills = await prisma.skill.findMany({ select: { name: true } });
  const localResumeSkills = resumeText
    ? extractSkillsFromResumeText(
        resumeText,
        catalogSkills.map((skill) => skill.name)
      )
    : [];
  const aiAnalysis = resumeText
    ? await analyzeResumeWithExternalApi(
        resumeText,
        catalogSkills.map((skill) => skill.name)
      )
    : null;
  const resumeSkills = Array.from(
    new Set([...(aiAnalysis?.skills ?? []), ...localResumeSkills])
  );

  const mergedStudent = buildMergedStudent(
    student,
    resumeSkills,
    aiAnalysis?.targetTrack ?? null
  );
  const studentRoleFamily = inferStudentRoleFamily(
    aiAnalysis?.targetRole,
    resumeSkills,
    resumeText
  );
  const posts = await prisma.internshipPost.findMany({
    where: { status: "ACTIVE" },
    include: recommendationInclude,
    orderBy: { createdAt: "desc" },
  });

  const pythonRanking = resumeText.trim()
    ? await runPythonCvJobRanker({
        resume_text: resumeText,
        resume_skills: resumeSkills,
        jobs: posts.map((post) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          responsibilities: post.responsibilities,
          keyRequirements: post.keyRequirements,
          techStack: post.techStack,
          requiredSkills: (post.requiredSkills ?? []).map((item) => item.skillName),
          optionalSkills: (post.optionalSkills ?? []).map((item) => item.skillName),
        })),
      })
    : null;

  const pythonScoreMap = new Map(
    (pythonRanking?.scores ?? []).map((row) => [
      row.id,
      {
        pythonScore: Number(row.pythonScore),
        confidence: Number(row.confidence),
        reason: row.reason,
      },
    ])
  );

  const scored = posts
    .map((post) => {
      const score = calculateMatchScore(mergedStudent as any, post as any);
      const python = pythonScoreMap.get(post.id);
      const hybridBaseScore = python
        ? Number((score.overallScore * 0.65 + python.pythonScore * 0.35).toFixed(2))
        : score.overallScore;
      const roleFit = computeRoleFitAdjustment(
        studentRoleFamily,
        post.title,
        post.description
      );
      const hybridScore = Math.max(
        0,
        Math.min(100, Number((hybridBaseScore + roleFit.adjustment).toFixed(2)))
      );
      return {
        id: post.id,
        title: post.title,
        companyName: post.company.companyName,
        location: post.location,
        workType: post.workType,
        applicationDeadline: post.applicationDeadline,
        score: hybridScore,
        qualified: score.isRecommended,
        rank: 0,
        matchedRequiredSkills: score.matchedRequiredSkills,
        matchedOptionalSkills: score.matchedOptionalSkills,
        missingRequiredSkills: score.missingRequiredSkills,
        missingOptionalSkills: score.missingOptionalSkills,
        reason: python
          ? `${score.matchReasonSummary}. Python model: ${python.reason}. Role-fit adjustment: ${roleFit.adjustment >= 0 ? "+" : ""}${roleFit.adjustment.toFixed(1)} (${studentRoleFamily ?? "unknown"} -> ${roleFit.postFamily ?? "unknown"}).`
          : `${score.matchReasonSummary}. Role-fit adjustment: ${roleFit.adjustment >= 0 ? "+" : ""}${roleFit.adjustment.toFixed(1)} (${studentRoleFamily ?? "unknown"} -> ${roleFit.postFamily ?? "unknown"}).`,
        resumeSkills,
        pythonScore: python?.pythonScore,
        pythonConfidence: python?.confidence,
      } satisfies StudentRecommendationRow;
    })
    .sort((a, b) => b.score - a.score)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const exactMatches = scored.filter((row) => row.qualified);
  const nearMatches = scored.filter((row) => !row.qualified && row.score >= 50);

  return {
    resumeText,
    resumeSkills,
    exactMatches,
    nearMatches,
  };
}

export async function getCompanyApplicantRankings(companyId: string) {
  const posts = await prisma.internshipPost.findMany({
    where: {
      companyId,
      status: { in: ["ACTIVE", "CLOSED"] },
    },
    include: {
      company: true,
      requiredSkills: true,
      optionalSkills: true,
      postSkills: {
        include: { skill: true },
      },
      applications: {
        include: {
          student: {
            include: {
              skills: {
                include: { skill: true },
              },
              resumes: {
                orderBy: { uploadedAt: "desc" },
                take: 1,
              },
              user: true,
              applications: {
                select: { id: true },
              },
            },
          },
          mlScore: true,
        },
        orderBy: {
          appliedAt: "asc",
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const catalogSkills = await prisma.skill.findMany({ select: { name: true } });

  return Promise.all(
    posts.map(async (post) => {
      const rankedApplicants = await Promise.all(
        post.applications.map(async (application) => {
          const resumePath = application.student.resumes[0]?.filePath ?? null;
          const resumeText = resumePath ? await extractResumeTextFromPath(resumePath) : "";
          const localResumeSkills = resumeText
            ? extractSkillsFromResumeText(
                resumeText,
                catalogSkills.map((skill) => skill.name)
              )
            : [];
          const aiAnalysis = resumeText
            ? await analyzeResumeWithExternalApi(
                resumeText,
                catalogSkills.map((skill) => skill.name)
              )
            : null;
          const resumeSkills = Array.from(
            new Set([...(aiAnalysis?.skills ?? []), ...localResumeSkills])
          );

          const mergedStudent = {
            ...application.student,
            skills: [
              ...application.student.skills,
              ...resumeSkills
                .filter(
                  (skillName) =>
                    !application.student.skills.some(
                      (entry) => entry.skill.name.toLowerCase() === skillName.toLowerCase()
                    )
                )
                .map((skillName) => ({
                  skill: { name: skillName },
                  level: null,
                })),
            ],
              aiTrackHint: aiAnalysis?.targetTrack ?? null,
          };

          const score = application.mlScore
            ? {
                overallScore: Number(application.mlScore.overallScore),
                requiredSkillsScore: Number(application.mlScore.requiredSkillsScore),
                optionalSkillsScore: Number(application.mlScore.optionalSkillsScore),
                educationScore: Number(application.mlScore.educationScore),
                experienceScore: Number(application.mlScore.experienceScore),
                rankPosition: application.mlScore.rankPosition,
                isRecommended: application.mlScore.isRecommended,
                matchedRequiredSkills: application.mlScore.matchedRequiredSkills
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
                missingRequiredSkills: application.mlScore.missingRequiredSkills
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
                matchReasonSummary: application.mlScore.matchReasonSummary,
              }
            : calculateMatchScore(mergedStudent as any, post as any);

          return {
            applicationId: application.id,
            studentId: application.student.id,
            firstName: application.student.firstName,
            lastName: application.student.lastName,
            email: application.student.user.email,
            overallScore: Number(score.overallScore),
            requiredSkillsScore: Number(score.requiredSkillsScore),
            optionalSkillsScore: Number(score.optionalSkillsScore),
            educationScore: Number(score.educationScore),
            experienceScore: Number(score.experienceScore),
            rankPosition:
              application.mlScore?.rankPosition ?? (score as any).rankPosition ?? 0,
            isRecommended:
              application.mlScore?.isRecommended ?? (score as any).isRecommended ?? false,
            matchedRequiredSkills:
              (score as any).matchedRequiredSkills ?? [],
            missingRequiredSkills:
              (score as any).missingRequiredSkills ?? [],
            reason:
              (score as any).matchReasonSummary ?? "",
            cvSkills: resumeSkills,
          };
        })
      );

      rankedApplicants.sort((a, b) => b.overallScore - a.overallScore);

      return {
        id: post.id,
        postId: post.id,
        postTitle: post.title,
        companyName: post.company.companyName,
        applicants: rankedApplicants.map((applicant, index) => ({
          ...applicant,
          rankPosition: applicant.rankPosition || index + 1,
        })),
      } satisfies CompanyApplicantRankRow;
    })
  );
}
