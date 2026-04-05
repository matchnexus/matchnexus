"use client";

import { useState, useCallback } from "react";
import {
  HiAcademicCap, HiCreditCard, HiLockClosed, HiPlus, HiPencil,
  HiTrash, HiCheckCircle, HiX, HiEye, HiEyeOff, HiShieldCheck,
  HiBookOpen, HiCurrencyDollar, HiChartBar, HiClock,
} from "react-icons/hi";

const ACCESS_PIN = "admin2024";

type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type Course = { id: string; title: string; description: string; level: CourseLevel; duration: string; priceAmount: string; isFree: boolean; status: CourseStatus; createdAt: string };
type Payment = { id: string; student: string; label: string; amount: string; raw: number; date: string; status: "Paid" | "Pending" | "Free" };

const INIT_COURSES: Course[] = [
  { id: "1", title: "Full Stack Web Development", description: "Master Next.js, TypeScript, and PostgreSQL.", level: "INTERMEDIATE", duration: "8 weeks", priceAmount: "4500", isFree: false, status: "PUBLISHED", createdAt: "2025-03-01" },
  { id: "2", title: "Data Structures & Algorithms", description: "Core CS concepts for technical interviews.", level: "ADVANCED", duration: "6 weeks", priceAmount: "3200", isFree: false, status: "PUBLISHED", createdAt: "2025-02-15" },
  { id: "3", title: "Career Readiness & Interview Skills", description: "Resume, mock interviews, and networking.", level: "BEGINNER", duration: "3 weeks", priceAmount: "0", isFree: true, status: "PUBLISHED", createdAt: "2025-01-10" },
  { id: "4", title: "UI/UX Design Fundamentals", description: "User-centered design and prototyping.", level: "BEGINNER", duration: "5 weeks", priceAmount: "2800", isFree: false, status: "DRAFT", createdAt: "2025-03-10" },
];

const INIT_PAYMENTS: Payment[] = [
  { id: "tx-1024", student: "Student A", label: "Course bundle â€” Spring track", amount: "LKR 4,500.00", raw: 4500, date: "2025-03-12", status: "Paid" },
  { id: "tx-1023", student: "Student B", label: "Certificate verification fee", amount: "LKR 1,200.00", raw: 1200, date: "2025-02-01", status: "Paid" },
  { id: "tx-1018", student: "Student C", label: "Platform access (student)", amount: "LKR 0.00", raw: 0, date: "2025-01-15", status: "Free" },
];

const levelColor: Record<CourseLevel, string> = { BEGINNER: "bg-green-100 text-green-700 border-green-200", INTERMEDIATE: "bg-blue-100 text-blue-700 border-blue-200", ADVANCED: "bg-amber-100 text-amber-700 border-amber-200" };
const statusColor: Record<CourseStatus, string> = { PUBLISHED: "bg-emerald-100 text-emerald-700 border-emerald-200", DRAFT: "bg-gray-100 text-gray-600 border-gray-200", ARCHIVED: "bg-red-100 text-red-600 border-red-200" };

// â”€â”€ Course Form Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseFormModal({ course, onClose, onSave }: { course?: Course; onClose: () => void; onSave: (c: Course) => void }) {
  const [form, setForm] = useState({ title: course?.title ?? "", description: course?.description ?? "", level: (course?.level ?? "BEGINNER") as CourseLevel, duration: course?.duration ?? "", priceAmount: course?.priceAmount ?? "", isFree: course?.isFree ?? false, status: (course?.status ?? "DRAFT") as CourseStatus });
  const [done, setDone] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: course?.id ?? Date.now().toString(), ...form, createdAt: course?.createdAt ?? new Date().toISOString().slice(0, 10) });
    setDone(true);
  };

  const inputCls = "w-full rounded-xl border border-white/20 bg-slate-700/80 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-400/70 focus:bg-slate-700 placeholder:text-slate-400 transition [&_option]:bg-slate-800 [&_option]:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-slate-800/90 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[90vh]">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-400/20 p-4"><HiCheckCircle className="h-10 w-10 text-green-400" /></div>
            <h3 className="text-lg font-bold text-white">{course ? "Course Updated" : "Course Created"}</h3>
            <p className="text-sm text-white/60">{course ? "Changes saved successfully." : "Course added successfully."}</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{course ? "Edit Course" : "Create New Course"}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10 transition"><HiX className="h-5 w-5 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Course title" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Level *</label>
                  <select value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Duration *</label>
                  <input required value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 weeks" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Price (LKR)</label>
                  <input value={form.priceAmount} onChange={(e) => set("priceAmount", e.target.value)} placeholder="0" disabled={form.isFree} className={`${inputCls} disabled:opacity-40`} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFree} onChange={(e) => set("isFree", e.target.checked)} className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500" />
                <span className="text-sm font-semibold text-white/70">Free course</span>
              </label>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button type="button" onClick={onClose} className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/60 hover:bg-white/8 transition">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition">{course ? "Save Changes" : "Create Course"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// â”€â”€ Delete confirm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DeleteModal({ title, onClose, onConfirm }: { title: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-800/90 p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/20 p-2.5"><HiTrash className="h-5 w-5 text-red-400" /></div>
          <h3 className="text-base font-bold text-white">Delete Course</h3>
        </div>
        <p className="text-sm text-white/60">Are you sure you want to delete <span className="font-semibold text-white">"{title}"</span>? This cannot be undone.</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase text-white/60 hover:bg-white/8 transition">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-red-500 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ManagePage() {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"courses" | "payments">("courses");
  const [courses, setCourses] = useState<Course[]>(INIT_COURSES);
  const [payments] = useState<Payment[]>(INIT_PAYMENTS);
  const [courseModal, setCourseModal] = useState<{ mode: "create" | "edit"; course?: Course } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const handleUnlock = useCallback(() => {
    if (pin === ACCESS_PIN) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }, [pin]);

  const saveCourse = (c: Course) => {
    setCourses((prev) => prev.some((x) => x.id === c.id) ? prev.map((x) => x.id === c.id ? c : x) : [c, ...prev]);
    setCourseModal(null);
  };

  const deleteCourse = () => { if (deleteTarget) { setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id)); setDeleteTarget(null); } };

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.raw, 0);

  // â”€â”€ PIN gate â”€â”€
  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-200">
              <HiLockClosed className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-900">Management Panel</h1>
            <p className="text-sm text-gray-500">Enter your access PIN to continue</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input type={showPin ? "text" : "password"} value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="Enter PIN"
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:bg-white placeholder:text-gray-400 ${pinError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-blue-400"}`}
              />
              <button onClick={() => setShowPin((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showPin ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
              </button>
            </div>
            {pinError && <p className="text-xs text-red-500 text-center">Incorrect PIN. Try again.</p>}
            <button onClick={handleUnlock} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-cyan-400 transition shadow-md shadow-blue-100">
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Management UI â”€â”€
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a2d4a 40%, #162440 70%, #1e3a5f 100%)" }}>
      {courseModal && <CourseFormModal course={courseModal.course} onClose={() => setCourseModal(null)} onSave={saveCourse} />}
      {deleteTarget && <DeleteModal title={deleteTarget.title} onClose={() => setDeleteTarget(null)} onConfirm={deleteCourse} />}

      {/* Top header bar */}
      <div className="border-b border-white/10 bg-white/8 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/20">
              <HiShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Management Panel</h1>
              <p className="text-xs text-white/40">Courses & Payments</p>
            </div>
          </div>
          <a href="/student/hub"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/20 hover:text-white transition">
            ← Back to Hub
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: HiBookOpen,       label: "Total Courses",   value: courses.length,                                         color: "border-blue-400/20",   icon_color: "text-blue-300",   bg: "bg-blue-500/20" },
            { icon: HiCheckCircle,    label: "Published",       value: courses.filter((c) => c.status === "PUBLISHED").length, color: "border-emerald-400/20", icon_color: "text-emerald-300", bg: "bg-emerald-500/20" },
            { icon: HiClock,          label: "Drafts",          value: courses.filter((c) => c.status === "DRAFT").length,     color: "border-amber-400/20",   icon_color: "text-amber-300",  bg: "bg-amber-500/20" },
            { icon: HiCurrencyDollar, label: "Total Collected", value: `LKR ${totalPaid.toLocaleString()}`,                    color: "border-violet-400/20",  icon_color: "text-violet-300", bg: "bg-violet-500/20" },
          ].map(({ icon: Icon, label, value, color, icon_color, bg }) => (
            <div key={label} className={`rounded-3xl border bg-white/10 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 ${color}`}>
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
                <Icon className={`h-5 w-5 ${icon_color}`} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
              <p className="mt-1 text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm">
          {[
            { id: "courses" as const, label: "Courses", icon: HiAcademicCap },
            { id: "payments" as const, label: "Payments", icon: HiCreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                activeTab === id ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* â”€â”€ Courses â”€â”€ */}
        {activeTab === "courses" && (
          <div className="overflow-hidden rounded-3xl border border-blue-400/25 backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(59,130,246,0.20) 50%, rgba(30,64,175,0.25) 100%)" }}>
            <div className="flex items-center justify-between border-b border-blue-300/15 px-6 py-4" style={{ background: "rgba(59,130,246,0.10)" }}>
              <div>
                <h2 className="font-black text-white">All Courses</h2>
                <p className="text-xs text-white/40">{courses.length} courses total</p>
              </div>
              <button onClick={() => setCourseModal({ mode: "create" })}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-blue-500 transition">
                <HiPlus className="h-4 w-4" /> New Course
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-blue-300/15 text-xs font-semibold uppercase tracking-wider text-blue-200/70" style={{ background: "rgba(59,130,246,0.12)" }}>
                  <tr>
                    {["Course", "Level", "Duration", "Price", "Status", "Created", ""].map((h) => (
                      <th key={h} className="px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-400/10">
                  {courses.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-sm text-blue-200/40">No courses yet. Create one to get started.</td></tr>
                  ) : courses.map((course) => (
                    <tr key={course.id} className="hover:bg-blue-400/10 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                            <HiAcademicCap className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{course.title}</p>
                            <p className="text-xs text-white/40 line-clamp-1 max-w-[200px]">{course.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex w-24 justify-center rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase ${levelColor[course.level]}`}>{course.level}</span>
                      </td>
                      <td className="px-6 py-4 text-white/60">{course.duration}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {course.isFree ? <span className="text-emerald-400 font-bold">Free</span> : `LKR ${course.priceAmount}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase ${statusColor[course.status]}`}>{course.status}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/40">{course.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setCourseModal({ mode: "edit", course })} className="rounded-lg p-2 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition"><HiPencil className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteTarget(course)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition"><HiTrash className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* â”€â”€ Payments â”€â”€ */}
        {activeTab === "payments" && (
          <div className="overflow-hidden rounded-3xl border border-blue-400/25 backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(59,130,246,0.20) 50%, rgba(30,64,175,0.25) 100%)" }}>
            <div className="flex items-center justify-between border-b border-blue-300/15 px-6 py-4" style={{ background: "rgba(59,130,246,0.10)" }}>
              <div>
                <h2 className="font-black text-white">Payment Records</h2>
                <p className="text-xs text-white/40">{payments.length} transactions</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-400/20 px-4 py-2">
                <HiChartBar className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">LKR {totalPaid.toLocaleString()} collected</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-blue-300/15 text-xs font-semibold uppercase tracking-wider text-blue-200/70" style={{ background: "rgba(59,130,246,0.12)" }}>
                  <tr>{["Ref", "Student", "Description", "Amount", "Date", "Status"].map((h) => <th key={h} className="px-6 py-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-blue-400/10">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-400/10 transition">
                      <td className="px-6 py-4 font-mono text-xs text-white/30">{p.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">{p.student}</td>
                      <td className="px-6 py-4 text-white/60">{p.label}</td>
                      <td className="px-6 py-4 font-bold text-white">{p.amount}</td>
                      <td className="px-6 py-4 text-xs text-white/40">{p.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          p.status === "Paid" ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-400"
                          : p.status === "Free" ? "border-white/15 bg-white/8 text-white/40"
                          : "border-amber-400/25 bg-amber-400/15 text-amber-400"
                        }`}>
                          {p.status === "Paid" && <HiCheckCircle className="h-3 w-3" />}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





