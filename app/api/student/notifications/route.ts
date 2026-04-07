import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { NotificationLevel } from "@/lib/notification-validation";

function mapNotification(notification: {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  publishAt: Date;
  createdAt: Date;
  reads: Array<{ id: string }>;
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
    isRead: notification.reads.length > 0,
  };
}

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const db = prisma as any;

  const student = userId
    ? await prisma.student.findUnique({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      })
    : null;

  const notifications = await db.notification.findMany({
    where: {
      publishAt: {
        lte: new Date(),
      },
    },
    orderBy: {
      publishAt: "desc",
    },
    take: 50,
    include: {
      reads: {
        ...(student
          ? {
              where: {
                studentId: student.id,
              },
            }
          : {}),
        select: {
          id: true,
        },
      },
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

  const mappedNotifications = notifications.map(mapNotification);
  const unreadCount = mappedNotifications.filter(
    (notification: { isRead: boolean }) => !notification.isRead
  ).length;

  return NextResponse.json({
    notifications: mappedNotifications,
    unreadCount,
  });
}
