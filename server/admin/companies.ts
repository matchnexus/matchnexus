import { prisma } from "@/lib/prisma";

export async function getAdminCompanies() {
  return prisma.company.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      verification: true,
      posts: true,
      payments: true,
    },
  });
}

export async function deleteAdminCompany(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, userId: true },
  });

  if (!company) {
    return { deleted: false as const, reason: "NOT_FOUND" as const };
  }

  await prisma.$transaction(async (tx) => {
    await tx.company.delete({
      where: { id: companyId },
    });

    if (company.userId) {
      await tx.user.delete({
        where: { id: company.userId },
      });
    }
  });

  return { deleted: true as const };
}