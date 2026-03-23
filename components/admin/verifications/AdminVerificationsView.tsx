"use client";

import { useMemo, useState } from "react";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOfficeBuilding,
  HiMail,
  HiGlobeAlt,
  HiBadgeCheck,
  HiClock,
  HiSparkles,
  HiShieldCheck,
} from "react-icons/hi";

type VerificationCompanyRow = {
  id: string;
  companyName: string;
  corporateEmail: string;
  emailDomain: string | null;
  verificationStatus: string;
  createdAt: Date | string;
  verification?: {
    attemptCount?: number | null;
    tokenExpiresAt?: Date | string | null;
  } | null;
  profile?: {
    websiteUrl?: string | null;
  } | null;
};

type Props = {
  companies: VerificationCompanyRow[];
};

export function AdminVerificationsView({ companies }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  const tableColumns = useMemo(
    () => [
      {
        key: "company",
        title: "Company",
        render: (row: VerificationCompanyRow) => (
          <div>
            <p className="font-semibold text-gray-900">{row.companyName}</p>
            <p className="text-xs text-gray-500">{row.corporateEmail}</p>
          </div>
        ),
      },
      {
        key: "domain",
        title: "Domain",
        render: (row: VerificationCompanyRow) => row.emailDomain || "—",
      },
      {
        key: "attempts",
        title: "Attempt Count",
        render: (row: VerificationCompanyRow) =>
          row.verification?.attemptCount ?? 0,
      },
      {
        key: "tokenExpiry",
        title: "Token Expires",
        render: (row: VerificationCompanyRow) =>
          row.verification?.tokenExpiresAt
            ? formatDate(row.verification.tokenExpiresAt)
            : "—",
      },
      {
        key: "website",
        title: "Website",
        render: (row: VerificationCompanyRow) =>
          row.profile?.websiteUrl ?? "—",
      },
      {
        key: "status",
        title: "Status",
        render: (row: VerificationCompanyRow) => (
          <StatusBadge value={row.verificationStatus} />
        ),
      },
      {
        key: "created",
        title: "Created",
        render: (row: VerificationCompanyRow) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/40 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Verification Queue
          </h2>
          <p className="text-sm text-gray-500">
            Switch between table view and card view.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              viewMode === "table"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <HiOutlineTable className="h-5 w-5" />
            Table
          </button>

          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              viewMode === "card"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <HiOutlineViewGrid className="h-5 w-5" />
            Cards
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <SimpleTable columns={tableColumns} rows={companies} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <HiShieldCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {company.companyName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Created {formatDate(company.createdAt)}
                    </p>
                  </div>
                </div>

                <StatusBadge value={company.verificationStatus} />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiMail className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{company.corporateEmail}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiGlobeAlt className="h-4 w-4 text-emerald-600" />
                  <span>{company.emailDomain || "No domain"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOfficeBuilding className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">
                    {company.profile?.websiteUrl || "No website"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-50 p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">
                    {company.verification?.attemptCount ?? 0}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Attempts</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                  <p className="text-sm font-bold text-emerald-700">
                    {company.verification?.tokenExpiresAt
                      ? formatDate(company.verification.tokenExpiresAt)
                      : "—"}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Token Expires
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiBadgeCheck className="h-4 w-4 text-gray-500" />
                    <span>Verification Status</span>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge value={company.verificationStatus} />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiClock className="h-4 w-4 text-gray-500" />
                    <span>Created Date</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(company.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiSparkles className="h-4 w-4 text-gray-500" />
                    <span>Website</span>
                  </div>
                  <span className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
                    {company.profile?.websiteUrl || "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}