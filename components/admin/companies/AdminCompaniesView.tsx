"use client";

import { useMemo, useState } from "react";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { formatDate } from "@/lib/format";
import toast from "react-hot-toast";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOfficeBuilding,
  HiMail,
  HiGlobeAlt,
  HiBriefcase,
  HiCreditCard,
  HiClock,
  HiSparkles,
  HiTrash,
} from "react-icons/hi";

type CompanyRow = {
  id: string;
  companyName: string;
  corporateEmail: string;
  emailDomain: string | null;
  verificationStatus: string;
  createdAt: Date | string;
  posts: Array<unknown>;
  payments: Array<unknown>;
  profile?: {
    industry?: string | null;
  } | null;
};

type Props = {
  companies: CompanyRow[];
};

export function AdminCompaniesView({ companies }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [companyRows, setCompanyRows] = useState<CompanyRow[]>(companies);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompanyRow | null>(null);

  const openDeleteConfirm = (company: CompanyRow) => {
    setDeleteTarget(company);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);

    try {
      const res = await fetch(`/api/admin/companies/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        toast.error(payload?.message ?? "Failed to delete company.");
        return;
      }

      setCompanyRows((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success("Company deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete company.");
    } finally {
      setDeletingId(null);
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        key: "company",
        title: "Company",
        render: (row: CompanyRow) => (
          <div>
            <p className="font-semibold text-gray-900">{row.companyName}</p>
            <p className="text-xs text-gray-500">{row.corporateEmail}</p>
          </div>
        ),
      },
      {
        key: "domain",
        title: "Domain",
        render: (row: CompanyRow) => row.emailDomain || "—",
      },
      {
        key: "industry",
        title: "Industry",
        render: (row: CompanyRow) => row.profile?.industry ?? "—",
      },
      {
        key: "posts",
        title: "Posts",
        render: (row: CompanyRow) => row.posts.length,
      },
      {
        key: "payments",
        title: "Payments",
        render: (row: CompanyRow) => row.payments.length,
      },
      {
        key: "verification",
        title: "Verification",
        render: (row: CompanyRow) => (
          <StatusBadge value={row.verificationStatus} />
        ),
      },
      {
        key: "created",
        title: "Created",
        render: (row: CompanyRow) => formatDate(row.createdAt),
      },
      {
        key: "actions",
        title: "Actions",
        render: (row: CompanyRow) => (
          <button
            type="button"
            onClick={() => openDeleteConfirm(row)}
            disabled={deletingId === row.id}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiTrash className="h-4 w-4" />
            {deletingId === row.id ? "Deleting..." : "Delete"}
          </button>
        ),
      },
    ],
    [deletingId]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/40 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Company Directory</h2>
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
                    <HiOfficeBuilding className="h-7 w-7" />
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
                  <HiSparkles className="h-4 w-4 text-emerald-600" />
                  <span>{company.profile?.industry || "No industry"}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-700">
                    {company.posts.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Posts</p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-3 text-center">
                  <p className="text-lg font-bold text-violet-700">
                    {company.payments.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Payments</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiBriefcase className="h-4 w-4 text-gray-500" />
                    <span>Internship Posts</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {company.posts.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiCreditCard className="h-4 w-4 text-gray-500" />
                    <span>Payments</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {company.payments.length}
                  </span>
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
              </div>

              <button
                type="button"
                onClick={() => openDeleteConfirm(company)}
                disabled={deletingId === company.id}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiTrash className="h-4 w-4" />
                {deletingId === company.id ? "Deleting company..." : "Delete Company"}
              </button>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Company"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.companyName}? This action permanently removes the company and related data.`
            : "Are you sure you want to delete this company?"
        }
        confirmLabel="Delete Company"
        loading={!!deleteTarget && deletingId === deleteTarget.id}
        onCancel={() => {
          if (!deletingId) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}