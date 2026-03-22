import { prisma } from "@/lib/prisma";

export async function getAdminPayments() {
  return prisma.payment.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
      product: true,
      events: true,
    },
  });
}

export async function getAdminBoostedPosts() {
  return prisma.boostedPost.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          company: true,
        },
      },
      package: true,
    },
  });
}