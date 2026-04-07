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

type VerificationDecisionAction = "APPROVE" | "REJECT";

export async function decideAdminCompanyVerification(
  companyId: string,
  action: VerificationDecisionAction,
  reason?: string
) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      verificationStatus: true,
      verification: {
        select: {
          id: true,
        },
      },
      verificationDocuments: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!company) {
    return { ok: false as const, status: 404, message: "Company not found" };
  }

  if (company.verificationStatus !== "PENDING") {
    return {
      ok: false as const,
      status: 409,
      message: "Only pending companies can be reviewed",
    };
  }

  if (action === "APPROVE" && company.verificationDocuments.length === 0) {
    return {
      ok: false as const,
      status: 400,
      message: "At least one verification document is required before approval",
    };
  }

  const nextStatus = action === "APPROVE" ? "VERIFIED" : "REJECTED";

  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id: company.id },
      data: {
        verificationStatus: nextStatus,
        isVerified: action === "APPROVE",
      },
    });

    if (company.verification?.id && action === "APPROVE") {
      await tx.companyVerification.update({
        where: { companyId: company.id },
        data: {
          verifiedAt: new Date(),
        },
      });
    }

    if (reason && action === "REJECT") {
      await tx.verificationDocument.updateMany({
        where: {
          companyId: company.id,
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
          reviewNote: reason,
        },
      });
    }
  });

  return {
    ok: true as const,
    status: 200,
    message: action === "APPROVE" ? "Company approved" : "Company rejected",
    nextStatus,
  };
}