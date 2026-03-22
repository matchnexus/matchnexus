import type { PostStatus, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats(): Promise<{
  studentsCount: number;
  companiesCount: number;
  pendingVerificationsCount: number;
  activePostsCount: number;
  applicationsCount: number;
  coursesCount: number;
  successfulPaymentsCount: number;
  recentCompanies: {
    id: string;
    companyName: string;
    corporateEmail: string;
    verificationStatus: VerificationStatus;
    createdAt: Date;
  }[];
  recentPosts: {
    id: string;
    title: string;
    status: PostStatus;
    createdAt: Date;
    company: { companyName: string };
  }[];
}> {
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