import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { postId, coverLetter } = await req.json();

  const studentId = userId;

  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    include: { resumes: true },
  });

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  const cvUrl = student.resumes?.[0]?.filePath || null;

  const existing = await prisma.application.findUnique({
    where: {
      postId_studentId: {
        postId,
        studentId: student.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already applied" }, { status: 400 });
  }

  const application = await prisma.application.create({
    data: {
      postId,
      studentId: student.id,
      coverLetter,
      cvUrl,
    },
  });

  return NextResponse.json(application);
}
