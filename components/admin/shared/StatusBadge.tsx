import { Badge } from "flowbite-react";

type StatusBadgeProps = {
  value: string;
};

const colorMap: Record<string, string> = {
  PENDING: "warning",
  VERIFIED: "success",
  REJECTED: "failure",
  ACTIVE: "success",
  INACTIVE: "failure",
  DRAFT: "gray",
  CLOSED: "failure",
  EXPIRED: "warning",
  APPLIED: "info",
  SHORTLISTED: "purple",
  INTERVIEW: "indigo",
  ACCEPTED: "success",
  FAILED: "failure",
  SUCCEEDED: "success",
  REFUNDED: "purple",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const color = colorMap[value] ?? "gray";

  return (
    <Badge color={color as any} className="w-fit px-2 py-1">
      {value}
    </Badge>
  );
}