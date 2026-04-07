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
  HiAcademicCap,
  HiMail,
  HiOfficeBuilding,
  HiDocumentText,
  HiClipboardList,
  HiSparkles,
  HiTrash,
} from "react-icons/hi";

type StudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  institute: string | null;
  department: string | null;
  degreeType: string | null;
  createdAt: Date | string;
  skills: Array<unknown>;
  applications: Array<unknown>;
  resumes: Array<unknown>;
  user: {
    email: string;
    isActive: boolean;
  };
};

type Props = {
  students: StudentRow[];
};

export function AdminStudentsView({ students }: Props) {
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [studentRows, setStudentRows] = useState<StudentRow[]>(students);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);

  const openDeleteConfirm = (student: StudentRow) => {
    setDeleteTarget(student);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);

    try {
      const res = await fetch(`/api/admin/students/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        toast.error(payload?.message ?? "Failed to delete student.");
        return;
      }

      setStudentRows((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success("Student deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        key: "name",
        title: "Student",
        render: (row: StudentRow) => (
          <div>
            <p className="font-semibold text-gray-900">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.user.email}</p>
          </div>
        ),
      },
      {
        key: "institute",
        title: "Institute",
        render: (row: StudentRow) => (
          <div>
            <p>{row.institute || "—"}</p>
            <p className="text-xs text-gray-500">{row.department || "—"}</p>
          </div>
        ),
      },
      {
        key: "degree",
        title: "Degree",
        render: (row: StudentRow) => row.degreeType || "—",
      },
      {
        key: "skills",
        title: "Skills",
        render: (row: StudentRow) => row.skills.length,
      },
      {
        key: "applications",
        title: "Applications",
        render: (row: StudentRow) => row.applications.length,
      },
      {
        key: "resumes",
        title: "Resumes",
        render: (row: StudentRow) => row.resumes.length,
      },
      {
        key: "status",
        title: "User Status",
        render: (row: StudentRow) => (
          <StatusBadge value={row.user.isActive ? "ACTIVE" : "INACTIVE"} />
        ),
      },
      {
        key: "joined",
        title: "Joined",
        render: (row: StudentRow) => formatDate(row.createdAt),
      },
      {
        key: "actions",
        title: "Actions",
        render: (row: StudentRow) => (
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
          <h2 className="text-lg font-semibold text-gray-900">Student Directory</h2>
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
          <SimpleTable columns={tableColumns} rows={studentRows} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {studentRows.map((student) => (
            <div
              key={student.id}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <HiAcademicCap className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Joined {formatDate(student.createdAt)}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  value={student.user.isActive ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiMail className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{student.user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOfficeBuilding className="h-4 w-4 text-emerald-600" />
                  <span>
                    {student.institute || "No institute"}{" "}
                    {student.department ? `• ${student.department}` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiSparkles className="h-4 w-4 text-emerald-600" />
                  <span>{student.degreeType || "No degree type"}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">
                    {student.skills.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Skills</p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-700">
                    {student.applications.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Applications
                  </p>
                </div>

                <div className="rounded-2xl bg-violet-50 p-3 text-center">
                  <p className="text-lg font-bold text-violet-700">
                    {student.resumes.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Resumes</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiDocumentText className="h-4 w-4 text-gray-500" />
                  <span>Profile Summary</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <HiClipboardList className="h-4 w-4 text-gray-500" />
                  <span>{student.applications.length} records</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openDeleteConfirm(student)}
                disabled={deletingId === student.id}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiTrash className="h-4 w-4" />
                {deletingId === student.id ? "Deleting student..." : "Delete Student"}
              </button>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Student"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action permanently removes student account data.`
            : "Are you sure you want to delete this student?"
        }
        confirmLabel="Delete Student"
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