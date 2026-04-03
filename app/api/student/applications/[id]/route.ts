import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

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
  // check ownership
  const application = await prisma.application.findFirst({
    where: {
      id: params.id,
      studentId : student.id,
    },
  });

  if (!application) {
    return NextResponse.json(
      { message: "Application not found" },
      { status: 404 },
    );
  }

  await prisma.application.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({ message: "Application cancelled" });
}
