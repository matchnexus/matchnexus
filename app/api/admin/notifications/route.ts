import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  parseAdminNotificationPayload,
  type NotificationLevel,
} from "@/lib/notification-validation";

function mapNotification(notification: {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  publishAt: Date;
  createdAt: Date;
  createdByAdminProfile: {
    displayName: string | null;
    user: {
      email: string;
    };
  };
}) {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    level: notification.level,
    publishAt: notification.publishAt.toISOString(),
    createdAt: notification.createdAt.toISOString(),
    createdByLabel:
      notification.createdByAdminProfile.displayName ??
      notification.createdByAdminProfile.user.email,
  };
}

export async function GET() {
  const cookieStore = cookies();
  const isAdminSession = cookieStore.get("admin-login")?.value === "true";

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = prisma as any;

  const notifications = await db.notification.findMany({
    orderBy: {
      publishAt: "desc",
    },
    take: 50,
    include: {
      createdByAdminProfile: {
        select: {
          displayName: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    notifications: notifications.map(mapNotification),
  });
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const isAdminSession = cookieStore.get("admin-login")?.value === "true";

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const parsed = parseAdminNotificationPayload(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  const adminEmail = cookieStore.get("admin-email")?.value;

  if (!adminEmail) {
    return NextResponse.json({ message: "Admin session missing" }, { status: 401 });
  }

  const db = prisma as any;

  const adminUser = await db.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      username: "Administrator",
      passwordHash: "admin-system",
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    },
    include: {
      adminProfile: true,
    },
  });

  const adminProfile =
    adminUser.adminProfile ||
    (await db.adminProfile.upsert({
      where: {
        userId: adminUser.id,
      },
      update: {},
      create: {
        userId: adminUser.id,
        displayName: adminUser.username || "Administrator",
      },
    }));

  const notification = await db.notification.create({
    data: {
      title: parsed.data.title,
      message: parsed.data.message,
      level: parsed.data.level,
      publishAt: parsed.data.publishAt ? new Date(parsed.data.publishAt) : new Date(),
      createdByAdminProfileId: adminProfile.id,
    },
    include: {
      createdByAdminProfile: {
        select: {
          displayName: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(
    {
      message: "Notification published",
      notification: mapNotification(notification),
    },
    { status: 201 }
  );
}
