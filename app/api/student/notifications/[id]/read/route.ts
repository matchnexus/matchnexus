import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { parseUuidParam } from "@/lib/notification-validation";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  const parsedId = parseUuidParam(params.id, "Notification id");

  if (!parsedId.success) {
    return NextResponse.json({ message: parsedId.message }, { status: 400 });
  }

  const db = prisma as any;

  const notification = await db.notification.findUnique({
    where: {
      id: parsedId.data,
    },
    select: {
      id: true,
    },
  });

  if (!notification) {
    return NextResponse.json({ message: "Notification not found" }, { status: 404 });
  }

  await db.notificationRead.upsert({
    where: {
      notificationId_studentId: {
        notificationId: notification.id,
        studentId: student.id,
      },
    },
    update: {
      readAt: new Date(),
    },
    create: {
      notificationId: notification.id,
      studentId: student.id,
    },
  });

  return NextResponse.json({ message: "Notification marked as read" });
}
