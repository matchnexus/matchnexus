import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        profile: true,
        posts: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        company: {
          id: company.id,
          companyName: company.companyName,
          corporateEmail: company.corporateEmail,
          isVerified: company.isVerified,
          verificationStatus: company.verificationStatus,
          totalPosts: company.posts.length,
          industry: company.profile?.industry || null,
          websiteUrl: company.profile?.websiteUrl || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Server error while loading dashboard" },
      { status: 500 }
    );
  }
}