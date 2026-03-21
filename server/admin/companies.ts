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