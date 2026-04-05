import { Prisma, RecommendationContext } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/server/ml/matching";
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

function buildMergedStudent(
  student: Prisma.StudentGetPayload<{ include: typeof studentInclude }>,
  resumeSkills: string[]
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
  const resumeSkills = resumeText
    ? extractSkillsFromResumeText(
        resumeText,
        catalogSkills.map((skill) => skill.name)
      )
    : [];

  const mergedStudent = buildMergedStudent(student, resumeSkills);
  const posts = await prisma.internshipPost.findMany({
    where: { status: "ACTIVE" },
    include: recommendationInclude,
    orderBy: { createdAt: "desc" },
  });

  const scored = posts
    .map((post) => {
      const score = calculateMatchScore(mergedStudent as any, post as any);
      return {
        id: post.id,
        title: post.title,
        companyName: post.company.companyName,
        location: post.location,
        workType: post.workType,
        applicationDeadline: post.applicationDeadline,
        score: score.overallScore,
        qualified: score.missingRequiredSkills.length === 0 && score.overallScore >= 70,
        rank: 0,
        matchedRequiredSkills: score.matchedRequiredSkills,
        matchedOptionalSkills: score.matchedOptionalSkills,
        missingRequiredSkills: score.missingRequiredSkills,
        missingOptionalSkills: score.missingOptionalSkills,
        reason: score.matchReasonSummary,
        resumeSkills,
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
          const resumeSkills = resumeText
            ? extractSkillsFromResumeText(
                resumeText,
                catalogSkills.map((skill) => skill.name)
              )
            : [];

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
