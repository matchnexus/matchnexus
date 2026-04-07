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

export function hasAdminSession(cookieValue?: string) {
  return cookieValue === "true";
}

export function parseUuidParam(value: string | undefined, label: string): ParseResult<string> {
  if (!value) {
    return { success: false, message: `${label} is required` };
  }

  if (!UUID_REGEX.test(value)) {
    return { success: false, message: `${label} must be a valid UUID` };
  }

  return { success: true, data: value };
}

export type VerificationDecisionInput = {
  action: "APPROVE" | "REJECT";
  reason?: string;
};

export function parseVerificationDecisionPayload(payload: unknown): ParseResult<VerificationDecisionInput> {
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "Invalid request payload" };
  }

  const raw = payload as Record<string, unknown>;
  const action = raw.action;
  const reasonValue = raw.reason;
  const reason = typeof reasonValue === "string" ? reasonValue.trim() : "";

  if (action !== "APPROVE" && action !== "REJECT") {
    return { success: false, message: "action must be APPROVE or REJECT" };
  }

  if (action === "REJECT") {
    if (!reason) {
      return { success: false, message: "Rejection reason is required" };
    }

    if (reason.length < 10) {
      return { success: false, message: "Rejection reason must be at least 10 characters" };
    }

    if (reason.length > 500) {
      return { success: false, message: "Rejection reason must be 500 characters or less" };
    }
  }

  return {
    success: true,
    data: {
      action,
      reason: reason || undefined,
    },
  };
}
