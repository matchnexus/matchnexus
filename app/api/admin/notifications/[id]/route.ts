import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { parseUuidParam } from "@/lib/notification-validation";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const isAdminSession = cookieStore.get("admin-login")?.value === "true";

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsedId = parseUuidParam(params.id, "Notification id");

  if (!parsedId.success) {
    return NextResponse.json({ message: parsedId.message }, { status: 400 });
  }

  const db = prisma as any;

  const existing = await db.notification.findUnique({
    where: {
      id: parsedId.data,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ message: "Notification not found" }, { status: 404 });
  }

  await db.notification.delete({
    where: {
      id: parsedId.data,
    },
  });

  return NextResponse.json({ message: "Notification deleted" });
}
