"use client";

import { useMemo, useState } from "react";
import type { Decimal } from "@prisma/client/runtime/library";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/format";
import {
  HiOutlineTable,
  HiOutlineViewGrid,
  HiCreditCard,
  HiLightningBolt,
  HiBriefcase,
  HiOfficeBuilding,
  HiUser,
  HiCalendar,
  HiCash,
  HiSparkles,
} from "react-icons/hi";

type PaymentRow = {
  id: string;
  provider: string | null;
  amount: Decimal | number | string;
  status: string;
  createdAt: Date | string;
  events: Array<unknown>;
  product?: {
    name?: string | null;
  } | null;
  company?: {
    companyName?: string | null;
    corporateEmail?: string | null;
  } | null;
  student?: {
    firstName?: string | null;
    lastName?: string | null;
    user?: {
      email?: string | null;
    } | null;
  } | null;
};

type BoostedPostRow = {
  id: string;
  startAt: Date | string;
  endAt: Date | string;
  status: string;
  createdAt: Date | string;
  package?: {
    name?: string | null;
  } | null;
  post: {
    title: string;
    company: {
      companyName: string;
    };
  };
};

type Props = {
  payments: PaymentRow[];
  boostedPosts: BoostedPostRow[];
};

function getPayerName(row: PaymentRow) {
  const studentName = row.student
    ? `${row.student.firstName ?? ""} ${row.student.lastName ?? ""}`.trim()
    : "";

  return row.company?.companyName ?? (studentName || "-");
}

function getPayerEmail(row: PaymentRow) {
  return row.company?.corporateEmail ?? row.student?.user?.email ?? "-";
}

function getAmountText(value: Decimal | number | string) {
  return formatCurrency(value.toString());
}

export function AdminPaymentsView({ payments, boostedPosts }: Props) {
  const [paymentsView, setPaymentsView] = useState<"table" | "card">("table");
  const [boostedView, setBoostedView] = useState<"table" | "card">("table");

  const paymentColumns = useMemo(
    () => [
      {
        key: "payer",
        title: "Payer",
        render: (row: PaymentRow) => (
          <div>
            <p className="font-semibold text-gray-900">{getPayerName(row)}</p>
            <p className="text-xs text-gray-500">{getPayerEmail(row)}</p>
          </div>
        ),
      },
      {
        key: "product",
        title: "Product",
        render: (row: PaymentRow) => row.product?.name ?? "—",
      },
      {
        key: "provider",
        title: "Provider",
        render: (row: PaymentRow) => row.provider ?? "—",
      },
      {
        key: "amount",
        title: "Amount",
        render: (row: PaymentRow) => getAmountText(row.amount),
      },
      {
        key: "status",
        title: "Status",
        render: (row: PaymentRow) => <StatusBadge value={row.status} />,
      },
      {
        key: "events",
        title: "Events",
        render: (row: PaymentRow) => row.events.length,
      },
      {
        key: "created",
        title: "Created",
        render: (row: PaymentRow) => formatDate(row.createdAt),
      },
    ],
    []
  );

  const boostedColumns = useMemo(
    () => [
      {
        key: "post",
        title: "Post",
        render: (row: BoostedPostRow) => (
          <div>
            <p className="font-semibold text-gray-900">{row.post.title}</p>
            <p className="text-xs text-gray-500">
              {row.post.company.companyName}
            </p>
          </div>
        ),
      },
      {
        key: "package",
        title: "Package",
        render: (row: BoostedPostRow) => row.package?.name ?? "—",
      },
      {
        key: "startAt",
        title: "Starts",
        render: (row: BoostedPostRow) => formatDate(row.startAt),
      },
      {
        key: "endAt",
        title: "Ends",
        render: (row: BoostedPostRow) => formatDate(row.endAt),
      },
      {
        key: "status",
        title: "Status",
        render: (row: BoostedPostRow) => <StatusBadge value={row.status} />,
      },
      {
        key: "created",
        title: "Created",
        render: (row: BoostedPostRow) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <HiCreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <HiLightningBolt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Boosted Posts</p>
              <p className="text-2xl font-bold text-gray-900">
                {boostedPosts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
              <HiCash className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length + boostedPosts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <HiCreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
              <p className="text-sm text-gray-500">
                Transaction history, payers, products, and payment status
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setPaymentsView("table")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                paymentsView === "table"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineTable className="h-5 w-5" />
              Table
            </button>

            <button
              type="button"
              onClick={() => setPaymentsView("card")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                paymentsView === "card"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineViewGrid className="h-5 w-5" />
              Cards
            </button>
          </div>
        </div>

        <div className="p-5">
          {payments.length ? (
            paymentsView === "table" ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <SimpleTable columns={paymentColumns} rows={payments} />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {payments.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                          {row.company ? (
                            <HiOfficeBuilding className="h-7 w-7" />
                          ) : (
                            <HiUser className="h-7 w-7" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {getPayerName(row)}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {getPayerEmail(row)}
                          </p>
                        </div>
                      </div>

                      <StatusBadge value={row.status} />
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiSparkles className="h-4 w-4 text-emerald-600" />
                        <span>{row.product?.name ?? "No product"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCreditCard className="h-4 w-4 text-emerald-600" />
                        <span>{row.provider ?? "No provider"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 text-emerald-600" />
                        <span>{formatDate(row.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">
                          {getAmountText(row.amount)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Amount</p>
                      </div>

                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-lg font-bold text-blue-700">
                          {row.events.length}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Events</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No payments"
              description="Payment records are not available yet."
            />
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <HiLightningBolt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Boosted Posts
              </h2>
              <p className="text-sm text-gray-500">
                Premium promoted internships and boost package tracking
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBoostedView("table")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                boostedView === "table"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineTable className="h-5 w-5" />
              Table
            </button>

            <button
              type="button"
              onClick={() => setBoostedView("card")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                boostedView === "card"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineViewGrid className="h-5 w-5" />
              Cards
            </button>
          </div>
        </div>

        <div className="p-5">
          {boostedPosts.length ? (
            boostedView === "table" ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <SimpleTable columns={boostedColumns} rows={boostedPosts} />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {boostedPosts.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
                          <HiBriefcase className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {row.post.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {row.post.company.companyName}
                          </p>
                        </div>
                      </div>

                      <StatusBadge value={row.status} />
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiSparkles className="h-4 w-4 text-blue-600" />
                        <span>{row.package?.name ?? "No package"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 text-blue-600" />
                        <span>Starts {formatDate(row.startAt)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 text-blue-600" />
                        <span>Ends {formatDate(row.endAt)}</span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-sm font-bold text-blue-700">
                          {formatDate(row.startAt)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Start</p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-sm font-bold text-emerald-700">
                          {formatDate(row.endAt)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">End</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCalendar className="h-4 w-4 text-gray-500" />
                        <span>Created</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatDate(row.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No boosted posts"
              description="Boosted internship posts are not available yet."
            />
          )}
        </div>
      </section>
    </div>
  );
}