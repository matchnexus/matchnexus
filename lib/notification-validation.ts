export type ParseSuccess<T> = {
  success: true;
  data: T;
};

export type ParseFailure = {
  success: false;
  message: string;
};

export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ALERT";

export type AdminNotificationInput = {
  title: string;
  message: string;
  level: NotificationLevel;
  publishAt?: string;
};

export function parseUuidParam(value: string | undefined, label: string): ParseResult<string> {
  if (!value) {
    return { success: false, message: `${label} is required` };
  }

  if (!UUID_REGEX.test(value)) {
    return { success: false, message: `${label} must be a valid UUID` };
  }

  return { success: true, data: value };
}

export function parseAdminNotificationPayload(payload: unknown): ParseResult<AdminNotificationInput> {
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "Invalid request payload" };
  }

  const raw = payload as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const levelValue = typeof raw.level === "string" ? raw.level.trim().toUpperCase() : "INFO";
  const publishAtValue = typeof raw.publishAt === "string" ? raw.publishAt.trim() : "";

  if (title.length < 3) {
    return { success: false, message: "Title must be at least 3 characters" };
  }

  if (title.length > 100) {
    return { success: false, message: "Title must be 100 characters or less" };
  }

  if (message.length < 10) {
    return { success: false, message: "Message must be at least 10 characters" };
  }

  if (message.length > 500) {
    return { success: false, message: "Message must be 500 characters or less" };
  }

  if (!["INFO", "SUCCESS", "WARNING", "ALERT"].includes(levelValue)) {
    return { success: false, message: "Level must be INFO, SUCCESS, WARNING, or ALERT" };
  }

  if (publishAtValue) {
    const publishDate = new Date(publishAtValue);

    if (Number.isNaN(publishDate.getTime())) {
      return { success: false, message: "Publish date must be valid" };
    }

    if (publishDate.getTime() < Date.now() - 60_000) {
      return { success: false, message: "Publish date cannot be in the past" };
    }
  }

  return {
    success: true,
    data: {
      title,
      message,
      level: levelValue as NotificationLevel,
      publishAt: publishAtValue || undefined,
    },
  };
}
