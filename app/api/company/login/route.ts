import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const publicDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailDomain = email.split("@")[1]?.toLowerCase();

    if (!emailDomain) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (publicDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: "Please use a corporate email address" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: {
        corporateEmail: email,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company account not found" },
        { status: 404 }
      );
    }

    const looksHashed = company.passwordHash.startsWith("$2a$") || company.passwordHash.startsWith("$2b$") || company.passwordHash.startsWith("$2y$");
    const isPasswordValid = looksHashed
      ? await bcrypt.compare(password, company.passwordHash)
      : password === company.passwordHash;

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!looksHashed) {
      const migratedHash = await bcrypt.hash(password, 10);
      await prisma.company.update({
        where: { id: company.id },
        data: { passwordHash: migratedHash },
      });
    }

    if (!company.isVerified) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          isVerified: true,
          verificationStatus: "VERIFIED",
        },
      });
      company.isVerified = true;
      company.verificationStatus = "VERIFIED";
    }

    return NextResponse.json(
      {
        message: "Login successful",
        company: {
          id: company.id,
          companyName: company.companyName,
          corporateEmail: company.corporateEmail,
          isVerified: company.isVerified,
          verificationStatus: company.verificationStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error while logging in" },
      { status: 500 }
    );
  }
}