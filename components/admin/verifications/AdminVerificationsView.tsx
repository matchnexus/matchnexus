"use client";

import { useMemo, useState } from "react";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import toast from "react-hot-toast";
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
  const [companyRows, setCompanyRows] = useState<VerificationCompanyRow[]>(companies);
  const [decisionTarget, setDecisionTarget] = useState<VerificationCompanyRow | null>(null);
  const [decisionAction, setDecisionAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const openDecisionModal = (
    company: VerificationCompanyRow,
    action: "APPROVE" | "REJECT"
  ) => {
    setDecisionTarget(company);
    setDecisionAction(action);
    setRejectionReason("");
    setReasonError(null);
  };

  const closeDecisionModal = () => {
    if (processingId) {
      return;
    }

    setDecisionTarget(null);
    setDecisionAction(null);
    setRejectionReason("");
    setReasonError(null);
  };

  const submitDecision = async () => {
    if (!decisionTarget || !decisionAction) {
      return;
    }

    const reason = rejectionReason.trim();
    if (decisionAction === "REJECT") {
      if (!reason) {
        setReasonError("Rejection reason is required.");
        return;
      }

      if (reason.length < 10) {
        setReasonError("Rejection reason must be at least 10 characters.");
        return;
      }
    }

    setReasonError(null);
    setProcessingId(decisionTarget.id);

    try {
      const res = await fetch(`/api/admin/verifications/${decisionTarget.id}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: decisionAction,
          reason: decisionAction === "REJECT" ? reason : undefined,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message ?? "Failed to process verification.");
        return;
      }

      setCompanyRows((prev) => prev.filter((item) => item.id !== decisionTarget.id));
      toast.success(
        decisionAction === "APPROVE"
          ? "Company approved successfully."
          : "Company rejected successfully."
      );
      closeDecisionModal();
    } catch {
      toast.error("Failed to process verification.");
    } finally {
      setProcessingId(null);
    }
  };

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
      {
        key: "actions",
        title: "Actions",
        render: (row: VerificationCompanyRow) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openDecisionModal(row, "APPROVE")}
              disabled={processingId === row.id}
              className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => openDecisionModal(row, "REJECT")}
              disabled={processingId === row.id}
              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    [processingId]
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
          <SimpleTable columns={tableColumns} rows={companyRows} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {companyRows.map((company) => (
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

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openDecisionModal(company, "APPROVE")}
                  disabled={processingId === company.id}
                  className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => openDecisionModal(company, "REJECT")}
                  disabled={processingId === company.id}
                  className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {decisionTarget && decisionAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                decisionAction === "APPROVE"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {decisionAction === "APPROVE" ? "Approve Verification" : "Reject Verification"}
            </span>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              {decisionAction === "APPROVE" ? "Approve Company" : "Reject Company"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {decisionAction === "APPROVE"
                ? `Confirm approval for ${decisionTarget.companyName}.`
                : `Provide a rejection reason for ${decisionTarget.companyName}.`}
            </p>

            {decisionAction === "REJECT" ? (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (reasonError) {
                      setReasonError(null);
                    }
                  }}
                  rows={4}
                  placeholder="Enter reason (minimum 10 characters)"
                  className={`w-full resize-none rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none ${
                    reasonError
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-emerald-400"
                  }`}
                />
                {reasonError ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{reasonError}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Minimum 10 characters required.</p>
                )}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDecisionModal}
                disabled={!!processingId}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDecision}
                disabled={processingId === decisionTarget.id}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  decisionAction === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processingId === decisionTarget.id
                  ? "Processing..."
                  : decisionAction === "APPROVE"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}