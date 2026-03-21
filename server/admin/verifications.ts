import { prisma } from "@/lib/prisma";

export async function getAdminVerifications() {
  return prisma.company.findMany({
    where: {
      verificationStatus: "PENDING",
    },
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      verification: true,
      profile: true,
    },
  });
}