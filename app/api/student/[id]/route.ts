import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        resumes: {
          orderBy: { uploadedAt: "desc" },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user.email,
      institute: student.institute,
      department: student.department,
      degreeType: student.degreeType,
      grade: student.grade,
      githubLink: student.githubLink,
      linkedinLink: student.linkedinLink,
      personalPortfolio: student.personalPortfolio,
      skills: student.skills,
      resumes: student.resumes,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to load student profile" },
      { status: 500 }
    );
  }
}
