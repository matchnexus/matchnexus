import { prisma } from "@/lib/prisma";

export async function getAdminInternships() {
  return prisma.internshipPost.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: {
          companyName: true,
          corporateEmail: true,
        },
      },
      requiredSkills: true,
      optionalSkills: true,
      applications: true,
      analytics: true,
    },
  });
}