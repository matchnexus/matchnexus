"use client";

import { useMemo, useState } from "react";
import type { Decimal } from "@prisma/client/runtime/library";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiAcademicCap,
  HiBriefcase,
  HiOfficeBuilding,
  HiChartBar,
  HiStar,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi";

type ApplicationRow = {
  id: string;
  status: string;
  appliedAt: Date | string;
  student: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
  post: {
    title: string;
    company: {
      companyName: string;
    };
  };
  mlScore: {
    overallScore: Decimal | null;
    rankPosition: number | null;
    isRecommended: boolean | null;
  } | null;
};

type Props = {
  applications: ApplicationRow[];
};

function formatOverallScore(score: Decimal | null | undefined) {
  return score != null ? score.toString() : "—";
}

export function AdminApplicationsView({ applications }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const tableColumns = useMemo(
    () => [
      {
        key: "student",
        title: "Student",
        render: (row: ApplicationRow) => (
          <div>
            <p className="font-semibold text-gray-900">
              {row.student.firstName} {row.student.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.student.user.email}</p>
          </div>
        ),
      },
      {
        key: "post",
        title: "Internship",
        render: (row: ApplicationRow) => (
          <div>
            <p className="font-medium text-gray-900">{row.post.title}</p>
            <p className="text-xs text-gray-500">
              {row.post.company.companyName}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row: ApplicationRow) => <StatusBadge value={row.status} />,
      },
      {
        key: "score",
        title: "ML Score",
        render: (row: ApplicationRow) => formatOverallScore(row.mlScore?.overallScore),
      },
      {
        key: "rank",
        title: "Rank",
        render: (row: ApplicationRow) =>
          row.mlScore?.rankPosition != null ? row.mlScore.rankPosition : "—",
      },
      {
        key: "recommended",
        title: "Recommended",
        render: (row: ApplicationRow) =>
          row.mlScore?.isRecommended ? (
            <StatusBadge value="ACTIVE" />
          ) : (
            <StatusBadge value="INACTIVE" />
          ),
      },
      {
        key: "appliedAt",
        title: "Applied",
        render: (row: ApplicationRow) => formatDate(row.appliedAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/40 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Application Records
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
          <SimpleTable columns={tableColumns} rows={applications} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <HiAcademicCap className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {application.student.firstName} {application.student.lastName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Applied {formatDate(application.appliedAt)}
                    </p>
                  </div>
                </div>

                <StatusBadge value={application.status} />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiBriefcase className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{application.post.title}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOfficeBuilding className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">
                    {application.post.company.companyName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiClock className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{application.student.user.email}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-700">
                    {formatOverallScore(application.mlScore?.overallScore)}
                  </p>
                  <p className="text-xs font-medium text-gray-500">ML Score</p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-3 text-center">
                  <p className="text-lg font-bold text-violet-700">
                    {application.mlScore?.rankPosition != null
                      ? application.mlScore.rankPosition
                      : "—"}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Rank</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">
                    {application.mlScore?.isRecommended ? "Yes" : "No"}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Recommend</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiChartBar className="h-4 w-4 text-gray-500" />
                    <span>ML Score</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatOverallScore(application.mlScore?.overallScore)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiStar className="h-4 w-4 text-gray-500" />
                    <span>Rank Position</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {application.mlScore?.rankPosition != null
                      ? application.mlScore.rankPosition
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiCheckCircle className="h-4 w-4 text-gray-500" />
                    <span>Recommended</span>
                  </div>
                  <div className="shrink-0">
                    {application.mlScore?.isRecommended ? (
                      <StatusBadge value="ACTIVE" />
                    ) : (
                      <StatusBadge value="INACTIVE" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}