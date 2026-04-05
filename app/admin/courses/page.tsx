"use client";

import { useState } from "react";
import { Badge } from "flowbite-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SectionCard } from "@/components/admin/shared/SectionCard";
import { HiPlus, HiTrash, HiX, HiAcademicCap, HiCheckCircle } from "react-icons/hi";

type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type Course = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  priceAmount: string;
  isFree: boolean;
  status: CourseStatus;
  createdAt: string;
};

const INITIAL_COURSES: Course[] = [
  { id: "1", title: "Full Stack Web Development", description: "Master Next.js, TypeScript, and PostgreSQL.", level: "INTERMEDIATE", duration: "8 weeks", priceAmount: "4500", isFree: false, status: "PUBLISHED", createdAt: "2025-03-01" },
  { id: "2", title: "Data Structures & Algorithms", description: "Core CS concepts for technical interviews.", level: "ADVANCED", duration: "6 weeks", priceAmount: "3200", isFree: false, status: "PUBLISHED", createdAt: "2025-02-15" },
  { id: "3", title: "Career Readiness & Interview Skills", description: "Resume, mock interviews, and networking.", level: "BEGINNER", duration: "3 weeks", priceAmount: "0", isFree: true, status: "PUBLISHED", createdAt: "2025-01-10" },
  { id: "4", title: "UI/UX Design Fundamentals", description: "User-centered design and prototyping.", level: "BEGINNER", duration: "5 weeks", priceAmount: "2800", isFree: false, status: "DRAFT", createdAt: "2025-03-10" },
];

const levelColor: Record<CourseLevel, string> = {
  BEGINNER: "success",
  INTERMEDIATE: "info",
  ADVANCED: "warning",
};

const statusColor: Record<CourseStatus, string> = {
  PUBLISHED: "success",
  DRAFT: "gray",
  ARCHIVED: "failure",
};


function CreateCourseModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (course: Course) => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", level: "BEGINNER" as CourseLevel,
    duration: "", priceAmount: "", isFree: false, status: "DRAFT" as CourseStatus,
  });
  const [done, setDone] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ id: Date.now().toString(), ...form, createdAt: new Date().toISOString().slice(0, 10) });
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <HiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Course Created</h3>
            <p className="text-sm text-gray-500">The course has been added successfully.</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-gray-900 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Create New Course</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition">
                <HiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Course title"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Level *</label>
                  <select value={form.level} onChange={(e) => set("level", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Duration *</label>
                  <input required value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 weeks"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (LKR)</label>
                  <input value={form.priceAmount} onChange={(e) => set("priceAmount", e.target.value)} placeholder="0" disabled={form.isFree}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 disabled:opacity-50" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFree} onChange={(e) => set("isFree", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Free course</span>
              </label>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <button type="button" onClick={onClose}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit"
                  className="rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition">Create Course</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


function DeleteConfirmModal({ course, onClose, onConfirm }: {
  course: Course;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-100 p-2.5">
            <HiTrash className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Delete Course</h3>
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{course.title}&quot;</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const handleCreate = (course: Course) => setCourses((prev) => [course, ...prev]);
  const handleDelete = () => {
    if (!deleteTarget) return;
    setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      {showCreate && (
        <CreateCourseModal onClose={() => setShowCreate(false)} onCreate={(c) => { handleCreate(c); }} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal course={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}

      <div className="space-y-6">
        <PageHeader
          title="Courses"
          description="Create and manage courses available to students."
          action={
            <button onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-blue-600 transition">
              <HiPlus className="h-4 w-4" /> New Course
            </button>
          }
        />

        <SectionCard>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="pb-3 pr-6">Course</th>
                  <th className="pb-3 pr-6">Level</th>
                  <th className="pb-3 pr-6">Duration</th>
                  <th className="pb-3 pr-6">Price</th>
                  <th className="pb-3 pr-6">Status</th>
                  <th className="pb-3 pr-6">Created</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">No courses yet. Create one to get started.</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <HiAcademicCap className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{course.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[220px]">{course.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <Badge color={levelColor[course.level] as any} className="w-fit px-2 py-1 text-[10px] font-bold uppercase">
                          {course.level}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-gray-600">{course.duration}</td>
                      <td className="py-4 pr-6 font-semibold text-gray-800">
                        {course.isFree ? <span className="text-green-600 font-bold">Free</span> : `LKR ${course.priceAmount}`}
                      </td>
                      <td className="py-4 pr-6">
                        <Badge color={statusColor[course.status] as any} className="w-fit px-2 py-1 text-[10px] font-bold uppercase">
                          {course.status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-xs text-gray-500">{course.createdAt}</td>
                      <td className="py-4">
                        <button onClick={() => setDeleteTarget(course)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition" title="Delete course">
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
