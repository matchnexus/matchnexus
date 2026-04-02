import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      description,
      responsibilities,
      qualifications,
      experience,
      location,
      workType,
      durationMonths,
      stipendAmount,
      applicationDeadline,
      requiredSkills,
      optionalSkills,
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

    const descriptionSections = [description?.trim() || ""];
    if (typeof qualifications === "string" && qualifications.trim()) {
      descriptionSections.push(`Qualifications:\n${qualifications.trim()}`);
    }
    if (typeof experience === "string" && experience.trim()) {
      descriptionSections.push(`Experience:\n${experience.trim()}`);
    }

    await prisma.internshipPost.update({
      where: { id: postId },
      data: {
        title,
        description: descriptionSections.filter(Boolean).join("\n\n"),
        responsibilities,
        location,
        workType,
        durationMonths,
        stipendAmount,
        applicationDeadline: new Date(applicationDeadline),
      },
    });

    await prisma.postRequiredSkill.deleteMany({
      where: { postId },
    });

    await prisma.postOptionalSkill.deleteMany({
      where: { postId },
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
          postId,
          skillName,
          proficiencyLevel: "INTERMEDIATE",
        })),
      });
    }

    if (optionalSkillsArray.length > 0) {
      await prisma.postOptionalSkill.createMany({
        data: optionalSkillsArray.map((skillName: string) => ({
          postId,
          skillName,
          proficiencyLevel: "BEGINNER",
        })),
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