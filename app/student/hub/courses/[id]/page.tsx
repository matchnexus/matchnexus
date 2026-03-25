"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HiArrowLeft, HiAcademicCap, HiClock, HiCheckCircle, HiPlay } from "react-icons/hi";

const MOCK_COURSES = [
  {
    id: "1",
    title: "Full Stack Web Development",
    provider: "MatchNexus Learning",
    duration: "8 weeks",
    progress: 30,
    status: "in_progress" as const,
    description:
      "Master Next.js, TypeScript, and PostgreSQL. Build real-world full-stack applications from scratch.",
    modules: [
      { id: "m1", title: "Introduction to Next.js", done: true },
      { id: "m2", title: "TypeScript Fundamentals", done: true },
      { id: "m3", title: "Database Design with PostgreSQL", done: false },
      { id: "m4", title: "API Routes & Server Actions", done: false },
      { id: "m5", title: "Authentication & Authorization", done: false },
    ],
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    provider: "Computing Fundamentals",
    duration: "6 weeks",
    progress: 0,
    status: "not_started" as const,
    description:
      "Core CS concepts for technical interviews. Arrays, trees, graphs, sorting, and dynamic programming.",
    modules: [
      { id: "m1", title: "Arrays & Strings", done: false },
      { id: "m2", title: "Linked Lists & Stacks", done: false },
      { id: "m3", title: "Trees & Graphs", done: false },
      { id: "m4", title: "Sorting Algorithms", done: false },
      { id: "m5", title: "Dynamic Programming", done: false },
    ],
  },
  {
    id: "3",
    title: "Career Readiness & Interview Skills",
    provider: "Professional Development",
    duration: "3 weeks",
    progress: 100,
    status: "completed" as const,
    description:
      "Resume writing, mock interviews, and professional networking strategies for landing your first role.",
    modules: [
      { id: "m1", title: "Resume & LinkedIn Optimization", done: true },
      { id: "m2", title: "Mock Interview Practice", done: true },
      { id: "m3", title: "Networking & Job Search", done: true },
    ],
  },
];

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const base = MOCK_COURSES.find((c) => c.id === id);
  const [modules, setModules] = useState(base?.modules ?? []);

  if (!base) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <HiAcademicCap className="h-12 w-12 text-slate-300" />
        <p className="text-lg font-bold text-slate-600">Course not found</p>
        <button
          onClick={() => router.back()}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const completedCount = modules.filter((m) => m.done).length;
  const progress = Math.round((completedCount / modules.length) * 100);

  const toggleModule = (modId: string) =>
    setModules((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, done: !m.done } : m)),
    );

  return (
    <div style={{ backgroundColor: "#F8FBFF" }} className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to Courses
      </button>

      {/* Header card */}
      <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <HiAcademicCap className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{base.provider}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight">{base.title}</h1>
            <p className="mt-2 text-sm text-white/85">{base.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs font-bold text-white/80">
              <span className="flex items-center gap-1"><HiClock className="h-4 w-4" />{base.duration}</span>
              <span>{completedCount}/{modules.length} modules done</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-black uppercase text-white/70">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="rounded-[1.5rem] border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">Course Modules</h2>
        </div>
        <ul className="divide-y divide-slate-50">
          {modules.map((mod, idx) => (
            <li key={mod.id} className="flex items-center gap-4 px-6 py-4">
              {/* Clickable toggle */}
              <button
                onClick={() => toggleModule(mod.id)}
                title={mod.done ? "Mark as incomplete" : "Mark as complete"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all ${
                  mod.done
                    ? "bg-green-100 text-green-600 hover:bg-red-50 hover:text-red-400"
                    : "bg-slate-100 text-slate-500 hover:bg-green-50 hover:text-green-500"
                }`}
              >
                {mod.done ? <HiCheckCircle className="h-5 w-5" /> : idx + 1}
              </button>

              <span
                className={`flex-1 text-sm font-semibold transition-all ${
                  mod.done ? "text-slate-400 line-through" : "text-slate-800"
                }`}
              >
                {mod.title}
              </span>

              {!mod.done && (
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  <HiPlay className="h-3.5 w-3.5" />
                  Start
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}
