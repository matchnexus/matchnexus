import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  console.log(userId);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const studentId = userId;

  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    include: { resumes: true },
  });

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  const applications = await prisma.application.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      post: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return NextResponse.json(applications);
}
