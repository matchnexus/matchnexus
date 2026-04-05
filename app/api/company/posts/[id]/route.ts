import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    await prisma.postRequiredSkill.deleteMany({
      where: { postId },
    });

    await prisma.postOptionalSkill.deleteMany({
      where: { postId },
    });

    await prisma.internshipPost.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Error deleting post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await req.json();

    const {
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

    const existingPost = await prisma.internshipPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const normalizedDescription = description?.trim() || "";
    const normalizedCategory = normalizeCategory(category);
    const normalizedKeyRequirements = toNullableString(keyRequirements);
    const normalizedTechStack = toNullableString(techStack);

    const commonData = {
      title,
      responsibilities,
      location,
      workType,
      durationMonths,
      applicationDeadline: new Date(applicationDeadline),
    };

    try {
      await prisma.internshipPost.update({
        where: { id: postId },
        data: {
          ...commonData,
          category: normalizedCategory,
          description: normalizedDescription,
          keyRequirements: normalizedKeyRequirements,
          techStack: normalizedTechStack,
        },
      });
    } catch (updateError) {
      if (!hasPostMetadataSchemaMismatch(updateError)) {
        throw updateError;
      }

      await prisma.internshipPost.update({
        where: { id: postId },
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
      { message: "Post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Error updating post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await req.json();
    const { status } = body;

    if (!status || !["ACTIVE", "CLOSED"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    const post = await prisma.internshipPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.internshipPost.update({
      where: { id: postId },
      data: { status },
    });

    return NextResponse.json(
      {
        message: `Post ${status === "ACTIVE" ? "published" : "closed"} successfully`,
        post: {
          id: updatedPost.id,
          status: updatedPost.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Error updating post status" },
      { status: 500 }
    );
  }
}