import { NextResponse } from "next/server";
import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      companyId,
      title,
      description,
      qualifications,
      experience,
      responsibilities,
      location,
      workType,
      durationMonths,
      stipendAmount,
      applicationDeadline,
      requiredSkills,
      optionalSkills,
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

    const descriptionSections = [description?.trim() || ""];
    if (typeof qualifications === "string" && qualifications.trim()) {
      descriptionSections.push(`Qualifications:\n${qualifications.trim()}`);
    }
    if (typeof experience === "string" && experience.trim()) {
      descriptionSections.push(`Experience:\n${experience.trim()}`);
    }

    const post = await prisma.internshipPost.create({
      data: {
        companyId,
        title,
        description: descriptionSections.filter(Boolean).join("\n\n"),
        responsibilities,
        location,
        workType,
        durationMonths,
        stipendAmount,
        applicationDeadline: parsedApplicationDeadline,
        status: "DRAFT",
      },
    });

    const requiredSkillsArray = requiredSkills
      ? requiredSkills
          .split(",")
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0)
      : [];

    const optionalSkillsArray = optionalSkills
      ? optionalSkills
          .split(",")
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0)
      : [];

    if (requiredSkillsArray.length > 0) {
      await prisma.postRequiredSkill.createMany({
        data: requiredSkillsArray.map((skillName: string) => ({
          postId: post.id,
          skillName,
          proficiencyLevel:"INTERMEDIATE",
        })),
      });
    }

    if (optionalSkillsArray.length > 0) {
      await prisma.postOptionalSkill.createMany({
        data: optionalSkillsArray.map((skillName: string) => ({
          postId: post.id,
          skillName,
          proficiencyLevel: "BEGINNER",
        })),
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