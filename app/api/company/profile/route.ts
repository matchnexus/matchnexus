import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publicDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
const companySizePattern = /^\d+\s*-\s*\d+$|^\d+\+$/;
const COMPANY_SIZE_MAX_LENGTH = 12;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const corporateEmail = searchParams.get("corporateEmail")?.toLowerCase();

    if (!companyId && !corporateEmail) {
      return NextResponse.json(
        { error: "Company ID or corporate email is required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findFirst({
      where: companyId
        ? { id: companyId }
        : { corporateEmail },
      select: {
        id: true,
        companyName: true,
        corporateEmail: true,
        verificationStatus: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const profile = await prisma.companyProfile.findUnique({
      where: { companyId: company.id },
    });

    return NextResponse.json(
      {
        company,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Server error while fetching profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      companyId,
      corporateEmail,
      websiteUrl,
      industry,
      companySize,
      foundedYear,
      headquartersLocation,
      description,
      missionStatement,
      workCulture,
      benefits,
      linkedinUrl,
    } = body;

    const normalizedCompanySize = typeof companySize === "string" ? companySize.trim() : "";
    const currentYear = new Date().getFullYear();

    if (normalizedCompanySize) {
      if (normalizedCompanySize.length > COMPANY_SIZE_MAX_LENGTH) {
        return NextResponse.json(
          { error: `Company Size must be ${COMPANY_SIZE_MAX_LENGTH} characters or fewer` },
          { status: 400 }
        );
      }

      if (!companySizePattern.test(normalizedCompanySize)) {
        return NextResponse.json(
          { error: "Company Size must be in format 11-50 or 200+" },
          { status: 400 }
        );
      }

      if (normalizedCompanySize.includes("-")) {
        const [minRaw, maxRaw] = normalizedCompanySize.split("-").map((part) => part.trim());
        const min = Number(minRaw);
        const max = Number(maxRaw);

        if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
          return NextResponse.json(
            { error: "Company Size range is invalid. Example: 11-50" },
            { status: 400 }
          );
        }
      }
    }

    if (foundedYear !== null && foundedYear !== undefined) {
      if (
        typeof foundedYear !== "number" ||
        !Number.isInteger(foundedYear) ||
        foundedYear > currentYear
      ) {
        return NextResponse.json(
          { error: `Founded Year cannot be greater than ${currentYear}` },
          { status: 400 }
        );
      }
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const normalizedEmail = corporateEmail?.trim().toLowerCase();
    if (normalizedEmail && normalizedEmail !== existingCompany.corporateEmail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedEmail)) {
        return NextResponse.json(
          { error: "Invalid corporate email format" },
          { status: 400 }
        );
      }

      const emailDomain = normalizedEmail.split("@")[1];
      if (!emailDomain || publicDomains.includes(emailDomain)) {
        return NextResponse.json(
          { error: "Please use a valid corporate email address" },
          { status: 400 }
        );
      }

      const existingByEmail = await prisma.company.findUnique({
        where: { corporateEmail: normalizedEmail },
      });

      if (existingByEmail && existingByEmail.id !== companyId) {
        return NextResponse.json(
          { error: "Corporate email already used by another company" },
          { status: 400 }
        );
      }

      await prisma.company.update({
        where: { id: companyId },
        data: {
          corporateEmail: normalizedEmail,
          emailDomain,
        },
      });
    }

    const existingProfile = await prisma.companyProfile.findUnique({
      where: { companyId },
    });

    if (existingProfile) {
      await prisma.companyProfile.update({
        where: { companyId },
        data: {
          websiteUrl,
          industry,
          companySize: normalizedCompanySize,
          foundedYear,
          headquartersLocation,
          description,
          missionStatement,
          workCulture,
          benefits,
          linkedinUrl,
        },
      });

      return NextResponse.json(
        { message: "Profile updated successfully" },
        { status: 200 }
      );
    }

    await prisma.companyProfile.create({
      data: {
        companyId,
        websiteUrl,
        industry,
        companySize: normalizedCompanySize,
        foundedYear,
        headquartersLocation,
        description,
        missionStatement,
        workCulture,
        benefits,
        linkedinUrl,
      },
    });

    return NextResponse.json(
      { message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Server error while saving profile" },
      { status: 500 }
    );
  }
}