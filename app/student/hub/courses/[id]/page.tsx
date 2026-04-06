"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiArrowLeft, HiAcademicCap, HiClock, HiCheckCircle, HiPlay,
  HiDocumentText, HiVideoCamera, HiBookOpen, HiX, HiDownload,
  HiLightningBolt, HiChevronRight,
} from "react-icons/hi";

const MOCK_COURSES = [
  {
    id: "1", title: "Full Stack Web Development", provider: "MatchNexus Learning",
    duration: "8 weeks", progress: 30, status: "in_progress" as const,
    description: "Master Next.js, TypeScript, and PostgreSQL. Build real-world full-stack applications from scratch.",
    modules: [
      {
        id: "m1", title: "Introduction to Next.js", done: true,
        lectures: [
          { id: "l1", type: "video" as const, title: "What is Next.js?", duration: "12 min", url: "#" },
          { id: "l2", type: "note" as const, title: "Next.js Core Concepts", content: "Next.js is a React framework that enables server-side rendering, static site generation, and API routes. Key features include: file-based routing, automatic code splitting, built-in CSS support, and fast refresh during development." },
          { id: "l3", type: "video" as const, title: "Setting Up Your Project", duration: "8 min", url: "#" },
          { id: "l4", type: "doc" as const, title: "Project Setup Guide", content: "Run `npx create-next-app@latest` to scaffold a new project. Choose TypeScript, ESLint, and Tailwind CSS when prompted. The `app/` directory uses the App Router — pages are `page.tsx` files inside folders." },
        ],
      },
      {
        id: "m2", title: "TypeScript Fundamentals", done: true,
        lectures: [
          { id: "l1", type: "video" as const, title: "Types & Interfaces", duration: "15 min", url: "#" },
          { id: "l2", type: "note" as const, title: "TypeScript Cheat Sheet", content: "Key TypeScript concepts: `interface` vs `type`, generics `<T>`, union types `string | number`, optional properties `prop?`, readonly, enums, and utility types like `Partial<T>`, `Pick<T>`, `Omit<T>`." },
        ],
      },
      {
        id: "m3", title: "Database Design with PostgreSQL", done: false,
        lectures: [
          { id: "l1", type: "video" as const, title: "Relational Database Basics", duration: "18 min", url: "#" },
          { id: "l2", type: "doc" as const, title: "SQL Quick Reference", content: "Essential SQL: SELECT, INSERT, UPDATE, DELETE. JOINs: INNER, LEFT, RIGHT. Indexes improve query performance. Use `EXPLAIN ANALYZE` to debug slow queries. PostgreSQL-specific: JSONB columns, full-text search, CTEs." },
          { id: "l3", type: "video" as const, title: "Prisma ORM Setup", duration: "14 min", url: "#" },
          { id: "l4", type: "note" as const, title: "Prisma Schema Guide", content: "Define your schema in `prisma/schema.prisma`. Use `prisma migrate dev` to apply changes. Prisma Client auto-generates type-safe queries. Relations: `@relation`, one-to-many, many-to-many with join tables." },
        ],
      },
      {
        id: "m4", title: "API Routes & Server Actions", done: false,
        lectures: [
          { id: "l1", type: "video" as const, title: "Building REST APIs", duration: "20 min", url: "#" },
          { id: "l2", type: "note" as const, title: "Server Actions Guide", content: "Server Actions let you run server-side code directly from components. Mark functions with `'use server'`. They can be called from forms or event handlers. Great for mutations without building a separate API endpoint." },
        ],
      },
      {
        id: "m5", title: "Authentication & Authorization", done: false,
        lectures: [
          { id: "l1", type: "video" as const, title: "NextAuth.js Setup", duration: "22 min", url: "#" },
          { id: "l2", type: "doc" as const, title: "Auth Patterns", content: "Use NextAuth.js for authentication. Configure providers (Credentials, Google, GitHub). JWT sessions are stateless. Use middleware to protect routes. Role-based access: store role in JWT token and check in middleware." },
          { id: "l3", type: "video" as const, title: "Protecting Routes", duration: "10 min", url: "#" },
        ],
      },
    ],
  },
  {
    id: "2", title: "Data Structures & Algorithms", provider: "Computing Fundamentals",
    duration: "6 weeks", progress: 0, status: "not_started" as const,
    description: "Core CS concepts for technical interviews. Arrays, trees, graphs, sorting, and dynamic programming.",
    modules: [
      { id: "m1", title: "Arrays & Strings", done: false, lectures: [{ id: "l1", type: "video" as const, title: "Array Operations", duration: "16 min", url: "#" }, { id: "l2", type: "note" as const, title: "Array Patterns", content: "Two pointers, sliding window, prefix sums. Time complexity: access O(1), search O(n), insert/delete O(n). Common patterns: reverse in-place, find duplicates with hash set, merge sorted arrays." }] },
      { id: "m2", title: "Linked Lists & Stacks", done: false, lectures: [{ id: "l1", type: "video" as const, title: "Linked List Basics", duration: "14 min", url: "#" }] },
      { id: "m3", title: "Trees & Graphs", done: false, lectures: [{ id: "l1", type: "video" as const, title: "Tree Traversals", duration: "20 min", url: "#" }] },
      { id: "m4", title: "Sorting Algorithms", done: false, lectures: [{ id: "l1", type: "video" as const, title: "QuickSort & MergeSort", duration: "18 min", url: "#" }] },
      { id: "m5", title: "Dynamic Programming", done: false, lectures: [{ id: "l1", type: "video" as const, title: "DP Fundamentals", duration: "25 min", url: "#" }] },
    ],
  },
  {
    id: "3", title: "Career Readiness & Interview Skills", provider: "Professional Development",
    duration: "3 weeks", progress: 100, status: "completed" as const,
    description: "Resume writing, mock interviews, and professional networking strategies.",
    modules: [
      { id: "m1", title: "Resume & LinkedIn Optimization", done: true, lectures: [{ id: "l1", type: "video" as const, title: "Resume Best Practices", duration: "12 min", url: "#" }, { id: "l2", type: "doc" as const, title: "Resume Template", content: "Use a clean single-page format. Lead with a strong summary. Quantify achievements: 'Reduced load time by 40%'. Tailor keywords to each job description. LinkedIn: professional photo, headline with keywords, 500+ connections." }] },
      { id: "m2", title: "Mock Interview Practice", done: true, lectures: [{ id: "l1", type: "video" as const, title: "STAR Method", duration: "10 min", url: "#" }] },
      { id: "m3", title: "Networking & Job Search", done: true, lectures: [{ id: "l1", type: "video" as const, title: "Building Your Network", duration: "15 min", url: "#" }] },
    ],
  },
];

type Lecture = { id: string; type: "video" | "note" | "doc"; title: string; duration?: string; url?: string; content?: string };
type Module = { id: string; title: string; done: boolean; lectures: Lecture[] };

function LecturePanel({ lecture, onClose }: { lecture: Lecture; onClose: () => void }) {
  const icons = { video: HiVideoCamera, note: HiBookOpen, doc: HiDocumentText };
  const Icon = icons[lecture.type];
  const colors = { video: "from-blue-600 to-cyan-500", note: "from-violet-600 to-purple-500", doc: "from-amber-500 to-orange-400" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-0 backdrop-blur-sm md:items-center md:pb-4">
      <div className="w-full max-w-2xl rounded-t-3xl md:rounded-3xl border border-white/20 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors[lecture.type]} p-5 text-white flex items-start justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{lecture.type === "video" ? "Video Lecture" : lecture.type === "note" ? "Study Notes" : "Document"}</p>
              <h3 className="text-base font-black">{lecture.title}</h3>
              {lecture.duration && <p className="text-xs text-white/70 mt-0.5">{lecture.duration}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/20 transition shrink-0"><HiX className="h-5 w-5" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {lecture.type === "video" && (
            <div className="space-y-4">
              {/* Mock video player */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 aspect-video flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 70% 60%, #06b6d4 0%, transparent 60%)" }} />
                <div className="relative flex flex-col items-center gap-3 text-white">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm border border-white/30">
                    <HiPlay className="h-8 w-8 ml-1" />
                  </button>
                  <p className="text-sm font-semibold text-white/80">{lecture.title}</p>
                  <p className="text-xs text-white/50">{lecture.duration}</p>
                </div>
              </div>
              {/* Progress bar mock */}
              <div className="rounded-xl bg-gray-100 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                  <span>0:00</span><span>{lecture.duration}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-200">
                  <div className="h-full w-0 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          )}

          {(lecture.type === "note" || lecture.type === "doc") && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{lecture.content}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition">
                <HiDownload className="h-4 w-4" /> Download PDF
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <button onClick={onClose} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const base = MOCK_COURSES.find((c) => c.id === id);
  const [modules, setModules] = useState<Module[]>(base?.modules ?? []);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (!base) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <HiAcademicCap className="h-12 w-12 text-slate-300" />
        <p className="text-lg font-bold text-slate-600">Course not found</p>
        <button onClick={() => router.back()} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">Go Back</button>
      </div>
    );
  }

  const completedCount = modules.filter((m) => m.done).length;
  const progress = Math.round((completedCount / modules.length) * 100);
  const toggleModule = (modId: string) => setModules((prev) => prev.map((m) => (m.id === modId ? { ...m, done: !m.done } : m)));

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)" }}>
      {activeLecture && <LecturePanel lecture={activeLecture} onClose={() => setActiveLecture(null)} />}

      <div className="mx-auto max-w-3xl space-y-5">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition">
            <HiArrowLeft className="h-4 w-4" /> Back to Courses
          </button>
        </div>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
              <HiAcademicCap className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">{base.provider}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight">{base.title}</h1>
              <p className="mt-2 text-sm text-white/80">{base.description}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  <HiClock className="h-3.5 w-3.5" />{base.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  <HiLightningBolt className="h-3.5 w-3.5" />{completedCount}/{modules.length} modules done
                </span>
              </div>
            </div>
          </div>
          <div className="relative mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-black uppercase text-white/70">
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="overflow-hidden rounded-3xl shadow-md" style={{ border: "1px solid rgba(147,197,253,0.5)", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)" }}>
          <div className="border-b border-blue-100 px-6 py-4" style={{ background: "rgba(219,234,254,0.6)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide text-gray-800">Course Modules</h2>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">{completedCount}/{modules.length} done</span>
            </div>
          </div>

          <div className="divide-y divide-blue-50">
            {modules.map((mod, idx) => {
              const isExpanded = expandedModule === mod.id;
              const rowBg = idx % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(219,234,254,0.5)";
              return (
                <div key={mod.id} style={{ background: rowBg }}>
                  {/* Module row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <button onClick={() => toggleModule(mod.id)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all ${
                        mod.done ? "bg-green-100 text-green-600 hover:bg-red-50 hover:text-red-400" : "bg-blue-100 text-blue-600 hover:bg-green-50 hover:text-green-500"
                      }`}>
                      {mod.done ? <HiCheckCircle className="h-5 w-5" /> : <span>{idx + 1}</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${mod.done ? "text-slate-400 line-through" : "text-slate-800"}`}>{mod.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.lectures.length} lectures</p>
                    </div>
                    <button onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm">
                      <HiPlay className="h-3.5 w-3.5" />
                      {isExpanded ? "Hide" : "Start"}
                      <HiChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                  {/* Expanded lectures */}
                  {isExpanded && (
                    <div className="border-t border-blue-100 px-5 pb-4 pt-3 space-y-2" style={{ background: "rgba(239,246,255,0.8)" }}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Lectures</p>
                      {mod.lectures.map((lec) => {
                        const LecIcon = lec.type === "video" ? HiVideoCamera : lec.type === "note" ? HiBookOpen : HiDocumentText;
                        const lecColor = lec.type === "video" ? "bg-blue-100 text-blue-600" : lec.type === "note" ? "bg-violet-100 text-violet-600" : "bg-amber-100 text-amber-600";
                        return (
                          <button key={lec.id} onClick={() => setActiveLecture(lec)}
                            className="flex w-full items-center gap-3 rounded-xl border border-white bg-white px-4 py-3 text-left shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${lecColor}`}>
                              <LecIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{lec.title}</p>
                              <p className="text-xs text-slate-400">{lec.type === "video" ? lec.duration : lec.type === "note" ? "Study notes" : "Document"}</p>
                            </div>
                            <HiChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
