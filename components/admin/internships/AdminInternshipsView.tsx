"use client";

import { useMemo, useState } from "react";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate } from "@/lib/format";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiBriefcase,
  HiOfficeBuilding,
  HiSparkles,
  HiClipboardList,
  HiCalendar,
  HiClock,
} from "react-icons/hi";

type InternshipRow = {
  id: string;
  title: string;
  workType: string | null;
  requiredSkills: Array<unknown>;
  optionalSkills: Array<unknown>;
  applications: Array<unknown>;
  applicationDeadline: Date | string | null;
  createdAt: Date | string;
  status: string;
  company: {
    companyName: string;
  };
};

type Props = {
  internships: InternshipRow[];
};

export function AdminInternshipsView({ internships }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  const tableColumns = useMemo(
    () => [
      {
        key: "title",
        title: "Post",
        render: (row: InternshipRow) => (
          <div>
            <p className="font-semibold text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-500">{row.company.companyName}</p>
          </div>
        ),
      },
      {
        key: "type",
        title: "Work Type",
        render: (row: InternshipRow) => row.workType ?? "—",
      },
      {
        key: "requiredSkills",
        title: "Required Skills",
        render: (row: InternshipRow) => row.requiredSkills.length,
      },
      {
        key: "optionalSkills",
        title: "Optional Skills",
        render: (row: InternshipRow) => row.optionalSkills.length,
      },
      {
        key: "applications",
        title: "Applications",
        render: (row: InternshipRow) => row.applications.length,
      },
      {
        key: "deadline",
        title: "Deadline",
        render: (row: InternshipRow) =>
          row.applicationDeadline ? formatDate(row.applicationDeadline) : "—",
      },
      {
        key: "status",
        title: "Status",
        render: (row: InternshipRow) => <StatusBadge value={row.status} />,
      },
      {
        key: "createdAt",
        title: "Created",
        render: (row: InternshipRow) => formatDate(row.createdAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/40 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Internship Posts
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
          <SimpleTable columns={tableColumns} rows={internships} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <HiBriefcase className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {internship.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Created {formatDate(internship.createdAt)}
                    </p>
                  </div>
                </div>

                <StatusBadge value={internship.status} />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOfficeBuilding className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">
                    {internship.company.companyName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiSparkles className="h-4 w-4 text-emerald-600" />
                  <span>{internship.workType || "No work type"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiCalendar className="h-4 w-4 text-emerald-600" />
                  <span>
                    {internship.applicationDeadline
                      ? formatDate(internship.applicationDeadline)
                      : "No deadline"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">
                    {internship.requiredSkills.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Required</p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-700">
                    {internship.optionalSkills.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Optional</p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-3 text-center">
                  <p className="text-lg font-bold text-violet-700">
                    {internship.applications.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Applications
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiClipboardList className="h-4 w-4 text-gray-500" />
                    <span>Application Count</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {internship.applications.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiClock className="h-4 w-4 text-gray-500" />
                    <span>Created Date</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(internship.createdAt)}
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