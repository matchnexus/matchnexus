import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const publicDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, email, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (String(password).length !== 8) {
      return NextResponse.json(
        { error: "Password must be exactly 8 characters" },
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

    const existingCompany = await prisma.company.findUnique({
      where: {
        corporateEmail: email,
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already registered with this email" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        companyName,
        corporateEmail: email,
        emailDomain,
        passwordHash,
        isVerified: true,
        verificationStatus: "VERIFIED",
      },
    });

    return NextResponse.json(
      {
        message: "Company registered successfully",
        company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Server error while registering company" },
      { status: 500 }
    );
  }
}