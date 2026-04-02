import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const MAX_LOGO_SIZE_BYTES = 3 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const companyId = String(formData.get("companyId") || "").trim();
    const logoFile = formData.get("logo") as File | null;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    if (!logoFile || logoFile.size === 0) {
      return NextResponse.json({ error: "Logo image is required" }, { status: 400 });
    }

    if (!logoFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (logoFile.size > MAX_LOGO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Logo size must be 3MB or less" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = logoFile.name.includes(".")
      ? logoFile.name.slice(logoFile.name.lastIndexOf(".")).toLowerCase()
      : ".png";
    const safeExtension = /^\.[a-z0-9]+$/.test(extension) ? extension : ".png";
    const fileName = `${companyId}_${Date.now()}${safeExtension}`;

    const { mkdir, writeFile } = await import("fs/promises");
    const { join } = await import("path");

    const uploadDir = join(process.cwd(), "public", "company-logos");
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const logoUrl = `/company-logos/${fileName}`;

    await prisma.companyProfile.upsert({
      where: { companyId },
      update: { logoUrl },
      create: { companyId, logoUrl },
    });

    return NextResponse.json(
      { message: "Logo uploaded successfully", logoUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Company logo upload error:", error);
    return NextResponse.json(
      { error: "Server error while uploading logo" },
      { status: 500 }
    );
  }
}