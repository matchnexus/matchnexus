import { NextResponse } from "next/server";
import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const toNullableString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const normalizeCategory = (value: unknown): "COMPUTING" | "BUSINESS" | "ENGINEERING" | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  if (normalized === "IT" || normalized === "COMPUTING") {
    return "COMPUTING";
  }
  if (normalized === "BUSINESS") {
    return "BUSINESS";
  }
  if (normalized === "ENGINEERING") {
    return "ENGINEERING";
  }

  return null;
};

const appendMetadataToDescription = (
  baseDescription: string,
  category: string | null,
  keyRequirements: string | null,
  techStack: string | null
) => {
  const sections = [baseDescription];

  if (category) {
    sections.push(`Category:\n${category}`);
  }
  if (keyRequirements) {
    sections.push(`Key Requirements:\n${keyRequirements}`);
  }
  if (techStack) {
    sections.push(`Tech Stack:\n${techStack}`);
  }

  return sections.filter(Boolean).join("\n\n");
};

const hasPostMetadataSchemaMismatch = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const prismaError = error as { code?: string; message?: string };
  if (prismaError.code === "P2022") {
    return true;
  }

  const message = prismaError.message || "";
  return (
    message.includes("Unknown arg `category`") ||
    message.includes("Unknown arg `keyRequirements`") ||
    message.includes("Unknown arg `techStack`")
  );
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      companyId,
      title,
      category,
      description,
      keyRequirements,
      techStack,
      responsibilities,
      location,
      workType,
      durationMonths,
      applicationDeadline,
    } = body;

    if (!companyId || !title || !description || !applicationDeadline) {
      return NextResponse.json(
        { error: "Company ID, title, description, and application deadline are required" },
        { status: 400 }
      );
    }

    const parsedApplicationDeadline = new Date(applicationDeadline);
    if (Number.isNaN(parsedApplicationDeadline.getTime())) {
      return NextResponse.json(
        { error: "Application deadline is invalid" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedDeadline = new Date(parsedApplicationDeadline);
    normalizedDeadline.setHours(0, 0, 0, 0);

    if (normalizedDeadline < today) {
      return NextResponse.json(
        { error: "Application deadline cannot be in the past" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const normalizedDescription = description?.trim() || "";
    const normalizedCategory = normalizeCategory(category);
    const normalizedKeyRequirements = toNullableString(keyRequirements);
    const normalizedTechStack = toNullableString(techStack);

    const commonData = {
      companyId,
      title,
      responsibilities,
      location,
      workType,
      durationMonths,
      applicationDeadline: parsedApplicationDeadline,
      status: "DRAFT" as const,
    };

    try {
      await prisma.internshipPost.create({
        data: {
          ...commonData,
          category: normalizedCategory,
          description: normalizedDescription,
          keyRequirements: normalizedKeyRequirements,
          techStack: normalizedTechStack,
        },
      });
    } catch (createError) {
      if (!hasPostMetadataSchemaMismatch(createError)) {
        throw createError;
      }

      await prisma.internshipPost.create({
        data: {
          ...commonData,
          description: appendMetadataToDescription(
            normalizedDescription,
            normalizedCategory,
            normalizedKeyRequirements,
            normalizedTechStack
          ),
        },
      });
    }

    return NextResponse.json(
      { message: "Internship post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Server error while creating internship post" },
      { status: 500 }
    );
  }
}

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
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const posts = await prisma.internshipPost.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: {
        requiredSkills: true,
        optionalSkills: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    const postsWithApplicationCounts = posts.map(({ _count, ...post }) => ({
      ...post,
      applicationsCount: _count.applications,
    }));

    return NextResponse.json({ posts: postsWithApplicationCounts }, { status: 200 });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json(
      { error: "Server error while fetching posts" },
      { status: 500 }
    );
  }
}