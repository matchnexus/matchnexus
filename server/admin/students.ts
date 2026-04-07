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

export async function deleteAdminStudent(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, userId: true },
  });

  if (!student) {
    return { deleted: false as const, reason: "NOT_FOUND" as const };
  }

  // Deleting the linked user cascades to student and related student-owned records.
  await prisma.user.delete({
    where: { id: student.userId },
  });

  return { deleted: true as const };
}