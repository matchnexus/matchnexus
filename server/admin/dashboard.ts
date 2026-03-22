import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
  const [
    studentsCount,
    companiesCount,
    pendingVerificationsCount,
    activePostsCount,
    applicationsCount,
    coursesCount,
    successfulPaymentsCount,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.company.count(),
    prisma.company.count({
      where: { verificationStatus: "PENDING" },
    }),
    prisma.internshipPost.count({
      where: { status: "ACTIVE" },
    }),
    prisma.application.count(),
    prisma.course.count(),
    prisma.payment.count({
      where: { status: "SUCCEEDED" },
    }),
  ]);

  const recentCompanies = await prisma.company.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      corporateEmail: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  const recentPosts = await prisma.internshipPost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      company: {
        select: {
          companyName: true,
        },
      },
    },
  });

  return {
    studentsCount,
    companiesCount,
    pendingVerificationsCount,
    activePostsCount,
    applicationsCount,
    coursesCount,
    successfulPaymentsCount,
    recentCompanies,
    recentPosts,
  };
}