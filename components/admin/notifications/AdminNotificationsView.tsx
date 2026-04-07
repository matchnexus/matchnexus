"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiBell,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiTrash,
  HiX,
  HiSparkles,
  HiCalendar,
} from "react-icons/hi";
import { formatDate } from "@/lib/format";

type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ALERT";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  publishAt: string;
  createdAt: string;
  createdByLabel: string;
};

type FormErrors = {
  title?: string;
  message?: string;
  publishAt?: string;
  general?: string;
};

const LEVELS: Array<{ value: NotificationLevel; label: string }> = [
  { value: "INFO", label: "Info" },
  { value: "SUCCESS", label: "Success" },
  { value: "WARNING", label: "Warning" },
  { value: "ALERT", label: "Alert" },
];

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

export function AdminNotificationsView() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NotificationRow | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState<NotificationLevel>("INFO");
  const [publishAt, setPublishAt] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const stats = useMemo(() => {
    const now = Date.now();
    const scheduled = notifications.filter((notification) => {
      return new Date(notification.publishAt).getTime() > now;
    }).length;
    const live = notifications.length - scheduled;

    return {
      total: notifications.length,
      live,
      scheduled,
      latest: notifications[0] ?? null,
    };
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications");
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? "Failed to load notifications");
        setNotifications([]);
        return;
      }

      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch {
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (trimmedTitle.length < 3) {
      nextErrors.title = "Title must be at least 3 characters.";
    } else if (trimmedTitle.length > 100) {
      nextErrors.title = "Title must be 100 characters or less.";
    }

    if (trimmedMessage.length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 500) {
      nextErrors.message = "Message must be 500 characters or less.";
    }

    if (publishAt) {
      const date = new Date(publishAt);
      if (Number.isNaN(date.getTime())) {
        nextErrors.publishAt = "Publish date must be valid.";
      } else if (date.getTime() < Date.now() - 60_000) {
        nextErrors.publishAt = "Publish date cannot be in the past.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);

    try {
      const res = await fetch(`/api/admin/notifications/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message ?? "Failed to delete notification");
        return;
      }

      setNotifications((prev) => prev.filter((notification) => notification.id !== deleteTarget.id));
      toast.success("Notification deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          level,
          publishAt: publishAt || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrors({ general: data?.message ?? "Failed to publish notification" });
        toast.error(data?.message ?? "Failed to publish notification");
        return;
      }

      toast.success("Notification published");
      setTitle("");
      setMessage("");
      setLevel("INFO");
      setPublishAt("");

      if (data?.notification) {
        setNotifications((prev) => [data.notification, ...prev]);
      } else {
        loadNotifications();
      }
    } catch {
      const errorMessage = "Notification publish failed due to a network or server error.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-600 shadow-sm">
              <HiBell className="h-6 w-6" />
            </div>

          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Total</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Live</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{stats.live}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Scheduled</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-5 xl:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Create notification</h3>
               
              </div>
              
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Title
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (errors.title) {
                        setErrors((prev) => ({ ...prev, title: undefined }));
                      }
                    }}
                    placeholder="e.g. Internship deadline reminder"
                    className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.title
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-100"
                    }`}
                  />
                  {errors.title ? <span className="text-xs text-red-600">{errors.title}</span> : null}
                </label>

                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Level
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value as NotificationLevel)}
                    className="rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    {LEVELS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Message
                <textarea
                  rows={6}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (errors.message) {
                      setErrors((prev) => ({ ...prev, message: undefined }));
                    }
                  }}
                  placeholder="Write the notification message for students..."
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors.message
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                />
                {errors.message ? <span className="text-xs text-red-600">{errors.message}</span> : null}
              </label>

              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Publish date and time
                  <input
                    type="datetime-local"
                    value={publishAt}
                    onChange={(event) => {
                      setPublishAt(event.target.value);
                      if (errors.publishAt) {
                        setErrors((prev) => ({ ...prev, publishAt: undefined }));
                      }
                    }}
                    className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.publishAt
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-100"
                    }`}
                  />
                  {errors.publishAt ? (
                    <span className="text-xs text-red-600">{errors.publishAt}</span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Optional. Leave empty to publish immediately.
                    </span>
                  )}
                </label>

              
              </div>

              {errors.general ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.general}
                </div>
              ) : null}

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Publishing..." : "Publish Notification"}
                </button>
              </div>
            </div>
          </form>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Old notifications</h3>
              </div>
              <div className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                {stats.total} items
              </div>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              ) : notifications.length ? (
                <div className="grid gap-4">
                  {notifications.map((notification) => {
                    const isScheduled = new Date(notification.publishAt).getTime() > Date.now();

                    return (
                      <article
                        key={notification.id}
                        className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-sky-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${levelClasses(notification.level)}`}
                              >
                                {notification.level}
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                                {isScheduled ? "Scheduled" : "Published"}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(notification)}
                            disabled={deletingId === notification.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <HiTrash className="h-4 w-4" />
                            Delete
                          </button>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {notification.message}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-gray-100">
                            <HiClock className="h-4 w-4" />
                            {formatDate(notification.publishAt)}
                          </div>
                          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-gray-100">
                            <HiCheckCircle className="h-4 w-4 text-emerald-500" />
                            Sent by {notification.createdByLabel}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  No notifications published yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">Delete notification</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">Remove old notification</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              This will permanently delete <span className="font-semibold text-gray-900">{deleteTarget.title}</span> from the admin list and student inbox.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteTarget.id}
                className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
