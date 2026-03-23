import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const verificationRecord = await prisma.companyVerification.findFirst({
      where: {
        verificationToken: token,
      },
      include: {
        company: true,
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 404 }
      );
    }

    if (verificationRecord.verifiedAt) {
      return NextResponse.json(
        { message: "Company already verified" },
        { status: 200 }
      );
    }

    if (new Date() > verificationRecord.tokenExpiresAt) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    await prisma.company.update({
      where: {
        id: verificationRecord.companyId,
      },
      data: {
        isVerified: true,
        verificationStatus: "VERIFIED",
      },
    });

    await prisma.companyVerification.update({
      where: {
        id: verificationRecord.id,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Company verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Server error while verifying company" },
      { status: 500 }
    );
  }
}