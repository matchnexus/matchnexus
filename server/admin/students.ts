import { prisma } from "@/lib/prisma";

export async function getAdminStudents() {
  return prisma.student.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      resumes: true,
      skills: {
        include: {
          skill: true,
        },
      },
      applications: true,
    },
  });
}