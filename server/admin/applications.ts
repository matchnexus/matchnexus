import { prisma } from "@/lib/prisma";

export async function getAdminApplications() {
  return prisma.application.findMany({
    take: 50,
    orderBy: { appliedAt: "desc" },
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
      mlScore: true,
    },
  });
}