export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = "LKR"
) {
  if (amount === null || amount === undefined) return "-";

  const numericAmount =
    typeof amount === "string" ? Number(amount) : amount;

  if (Number.isNaN(numericAmount)) return "-";

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}