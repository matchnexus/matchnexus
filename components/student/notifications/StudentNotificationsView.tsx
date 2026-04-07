"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiBell, HiClock, HiCheckCircle } from "react-icons/hi";

type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ALERT";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  publishAt: string;
  createdAt: string;
  createdByLabel: string;
  isRead: boolean;
};

function levelClasses(level: NotificationLevel) {
  switch (level) {
    case "SUCCESS":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "WARNING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ALERT":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-sky-50 text-sky-700 border-sky-200";
  }
}

export function StudentNotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/student/notifications");
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? "Failed to load notifications");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const rows = Array.isArray(data?.notifications) ? data.notifications : [];
      setNotifications(rows);
      setUnreadCount(data?.unreadCount ?? 0);
    } catch {
      toast.error("Failed to load notifications");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    const target = notifications.find((notification) => notification.id === notificationId);

    if (!target || target.isRead) {
      return;
    }

    try {
      const res = await fetch(`/api/student/notifications/${notificationId}/read`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? "Failed to update notification");
        return;
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to update notification");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
            <HiBell className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Unread</p>
            <p className="mt-2 text-3xl font-black text-sky-900">{unreadCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{notifications.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length ? (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`w-full rounded-3xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  notification.isRead
                    ? "border-gray-200 bg-white"
                    : "border-sky-200 bg-sky-50/70"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${levelClasses(notification.level)}`}
                      >
                        {notification.level}
                      </span>
                      {!notification.isRead ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                          Unread
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          Read
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="max-w-3xl text-sm leading-6 text-gray-600">
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-gray-100">
                    <HiClock className="h-4 w-4" />
                    {new Date(notification.publishAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <HiCheckCircle className="h-4 w-4 text-emerald-500" />
                  Sent by {notification.createdByLabel}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
            No notifications yet.
          </div>
        )}
      </section>
    </div>
  );
}
