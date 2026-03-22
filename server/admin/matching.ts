import { prisma } from "@/lib/prisma";

export async function getAdminRecommendationScores() {
  return prisma.recommendationScore.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      post: {
        include: {
          company: true,
        },
      },
    },
  });
}

export async function getAdminApplicationScores() {
  return prisma.applicationMlScore.findMany({
    take: 50,
    orderBy: { calculatedAt: "desc" },
    include: {
      application: {
        include: {
          student: {
            include: {
              user: true,
            },
          },
          post: {
            include: {
              company: true,
            },
          },
        },
      },
    },
  });
}