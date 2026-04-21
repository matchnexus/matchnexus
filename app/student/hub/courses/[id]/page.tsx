"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HiArrowLeft, HiAcademicCap, HiCheckCircle, HiPlay,
  HiDocumentText, HiVideoCamera, HiBookOpen, HiX, HiDownload,
  HiLightningBolt, HiChevronRight, HiExternalLink,
} from "react-icons/hi";

type Lecture = {
  id: string; type: "video" | "note" | "pdf";
  title: string; duration?: string; url?: string; content?: string;
};
type Module = { id: string; title: string; done: boolean; lectures: Lecture[] };
type CourseDetail = {
  id: string; title: string; description: string; level: string;
  isFree: boolean; priceAmount: string; modules: Module[]; progress: number;
};

// Rich fallback content used when DB course has no modules yet
const FALLBACK_MODULES: Record<string, Module[]> = {
  default: [
    {
      id: "m1", title: "Getting Started", done: false,
      lectures: [
        { id: "l1", type: "video", title: "Introduction & Overview", duration: "10 min", url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA" },
        { id: "l2", type: "note", title: "Course Notes", content: "**What You Will Learn**\n• Core concepts and fundamentals\n• Hands-on practical exercises\n• Real-world project experience\n\n**Prerequisites**\n• Basic computer knowledge\n• Willingness to learn\n\n**Tools Required**\n• A modern web browser\n• Code editor (VS Code recommended)\n• Node.js installed" },
        { id: "l3", type: "pdf", title: "Course Syllabus", url: "/docs/syllabus.pdf", content: "Download the full course syllabus including weekly breakdown, assessment criteria, and learning outcomes." },
      ],
    },
    {
      id: "m2", title: "Core Concepts", done: false,
      lectures: [
        { id: "l1", type: "video", title: "Deep Dive — Core Concepts", duration: "18 min", url: "https://www.youtube.com/watch?v=843nec-IvW0" },
        { id: "l2", type: "note", title: "Key Concepts Cheat Sheet", content: "**Fundamentals**\n• Understand the problem before coding\n• Break problems into smaller parts\n• Write clean, readable code\n\n**Best Practices**\n• Comment your code\n• Use meaningful variable names\n• Test edge cases\n\n**Common Patterns**\n• Input → Process → Output\n• Divide and conquer\n• Iterative refinement" },
        { id: "l3", type: "pdf", title: "Reference Guide PDF", url: "/docs/reference.pdf", content: "A comprehensive reference guide covering all core concepts discussed in this module." },
      ],
    },
    {
      id: "m3", title: "Practical Application", done: false,
      lectures: [
        { id: "l1", type: "video", title: "Hands-on Project Walkthrough", duration: "22 min", url: "https://www.youtube.com/watch?v=30LWjhZzg50" },
        { id: "l2", type: "note", title: "Project Notes", content: "**Project Goals**\n• Apply concepts from previous modules\n• Build something you can showcase\n• Practice debugging and problem solving\n\n**Steps**\n• Plan your approach first\n• Implement step by step\n• Test as you go\n• Refactor and improve\n\n**Submission**\n• Push to GitHub\n• Write a README\n• Record a short demo" },
        { id: "l3", type: "pdf", title: "Project Brief PDF", url: "/docs/project-brief.pdf", content: "Full project brief with requirements, marking criteria, and submission guidelines." },
      ],
    },
  ],
};

// ── Note renderer ─────────────────────────────────────────────────────────────
function renderNoteContent(content: string) {
  const sections: { heading: string | null; lines: string[] }[] = [];
  let current: { heading: string | null; lines: string[] } = { heading: null, lines: [] };
  content.split("\n").forEach((line) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      if (current.lines.length > 0 || current.heading) sections.push(current);
      current = { heading: line.replace(/\*\*/g, ""), lines: [] };
    } else {
      current.lines.push(line);
    }
  });
  sections.push(current);
  return sections.map((sec, si) => (
    <div key={si} className={`rounded-xl border p-4 space-y-1.5 ${sec.heading ? "border-blue-100 bg-blue-50/50" : "border-gray-100 bg-gray-50"}`}>
      {sec.heading && <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">{sec.heading}</p>}
      {sec.lines.filter((l) => l.trim()).map((line, li) => {
        if (line.startsWith("•"))
          return (
            <div key={li} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <p className="text-sm text-slate-700 leading-relaxed">{line.replace("• ", "")}</p>
            </div>
          );
        const isCode = line.includes("(") || line.includes("{") || line.includes("npm") || line.includes("npx") || line.includes("export") || line.includes("import") || line.includes("SELECT");
        if (isCode)
          return <p key={li} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-mono text-green-300 break-all">{line}</p>;
        return <p key={li} className="text-sm text-slate-700 leading-relaxed">{line}</p>;
      })}
    </div>
  ));
}

// ── Lecture Panel ─────────────────────────────────────────────────────────────
function LecturePanel({ lecture, onClose }: { lecture: Lecture; onClose: () => void }) {
  const icons = { video: HiVideoCamera, note: HiBookOpen, pdf: HiDocumentText };
  const Icon = icons[lecture.type];
  const colors = { video: "from-blue-600 to-cyan-500", note: "from-violet-600 to-purple-500", pdf: "from-amber-500 to-orange-400" };

  const downloadNote = () => {
    const text = `${lecture.title}\n${"=".repeat(lecture.title.length)}\n\n${lecture.content ?? ""}`;
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
    a.download = `${lecture.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-0 backdrop-blur-sm md:items-center md:pb-4">
      <div className="w-full max-w-2xl rounded-t-3xl md:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors[lecture.type]} p-5 text-white flex items-start justify-between gap-3 shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                {lecture.type === "video" ? "Video Lecture" : lecture.type === "note" ? "Study Notes" : "PDF Document"}
              </p>
              <h3 className="text-base font-black">{lecture.title}</h3>
              {lecture.duration && <p className="text-xs text-white/70 mt-0.5">{lecture.duration}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/20 transition shrink-0">
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* VIDEO */}
          {lecture.type === "video" && lecture.url && (
            <>
              <a href={lecture.url} target="_blank" rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg"
                style={{ paddingTop: "56.25%" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg group-hover:bg-red-500 transition">
                    <HiPlay className="h-8 w-8 ml-1 text-white" />
                  </div>
                  <p className="text-sm font-bold text-white/80">{lecture.title}</p>
                  {lecture.duration && <p className="text-xs text-white/50">{lecture.duration}</p>}
                  <span className="mt-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70 group-hover:bg-white/20 transition">
                    Click to watch on YouTube ↗
                  </span>
                </div>
              </a>
              <a href={lecture.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition">
                <HiExternalLink className="h-4 w-4" /> Open on YouTube
              </a>
            </>
          )}

          {/* NOTES */}
          {lecture.type === "note" && lecture.content && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Study Notes</span>
              </div>
              {renderNoteContent(lecture.content)}
              <button onClick={downloadNote}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 hover:bg-violet-100 transition">
                <HiDownload className="h-4 w-4" /> Download Notes (.txt)
              </button>
            </div>
          )}

          {/* PDF */}
          {lecture.type === "pdf" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">PDF Document</span>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <HiDocumentText className="h-6 w-6 text-amber-600" />
                </div>
                <p className="font-bold text-slate-800">{lecture.title}</p>
                <p className="text-sm text-slate-500">{lecture.content}</p>
                {lecture.url && (
                  <a href={lecture.url} target="_blank" rel="noopener noreferrer" download
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition shadow-sm">
                    <HiDownload className="h-4 w-4" /> Download PDF
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-100 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("guest");

  useEffect(() => {
    const uid = localStorage.getItem("userId") || "guest";
    setUserId(uid);
    fetch(`/api/student/courses/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.course) {
          setCourse(d.course);
          const saved = localStorage.getItem(`course_progress_${uid}_${id}`);
          const doneIds: string[] = saved ? JSON.parse(saved) : [];
          const apiModules: Module[] = (d.course.modules ?? []).map((m: any) => ({
            id: m.id,
            title: m.title,
            done: doneIds.includes(m.id),
            lectures: (m.lessons ?? []).map((l: any) => ({
              id: l.id,
              title: l.title,
              type: l.contentType === "VIDEO" ? "video" : l.contentType === "NOTE" ? "note" : "pdf",
              url: l.contentUrl,
              content: l.contentUrl,
            })),
          }));
          // Use API modules if they exist, otherwise use rich fallback
          setModules(apiModules.length > 0 ? apiModules : FALLBACK_MODULES.default);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <HiAcademicCap className="h-12 w-12 text-slate-300 animate-pulse" />
        <p className="text-lg font-bold text-slate-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <HiAcademicCap className="h-12 w-12 text-slate-300" />
        <p className="text-lg font-bold text-slate-600">Course not found</p>
        <button onClick={() => router.back()} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">Go Back</button>
      </div>
    );
  }

  const completedCount = modules.filter((m) => m.done).length;
  const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  const toggleModule = (modId: string) => {
    setModules((prev) => {
      const next = prev.map((m) => m.id === modId ? { ...m, done: !m.done } : m);
      localStorage.setItem(`course_progress_${userId}_${id}`, JSON.stringify(next.filter((m) => m.done).map((m) => m.id)));
      return next;
    });
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)" }}>
      {activeLecture && <LecturePanel lecture={activeLecture} onClose={() => setActiveLecture(null)} />}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-6">
        {/* Back */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition">
          <HiArrowLeft className="h-4 w-4" /> Back to Courses
        </button>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
              <HiAcademicCap className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">MatchNexus Learning</p>
              <h1 className="mt-1 text-2xl font-black leading-tight">{course.title}</h1>
              <p className="mt-2 text-sm text-white/80">{course.description}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{course.level}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  {course.isFree ? "Free" : `LKR ${course.priceAmount}`}
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

                  {isExpanded && (
                    <div className="border-t border-blue-100 px-5 pb-4 pt-3 space-y-2" style={{ background: "rgba(239,246,255,0.8)" }}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Lectures</p>
                      {mod.lectures.map((lec) => {
                        const LecIcon = lec.type === "video" ? HiVideoCamera : lec.type === "note" ? HiBookOpen : HiDocumentText;
                        const lecColor = lec.type === "video"
                          ? "bg-blue-100 text-blue-600"
                          : lec.type === "note"
                          ? "bg-violet-100 text-violet-600"
                          : "bg-amber-100 text-amber-600";
                        const lecLabel = lec.type === "video" ? lec.duration : lec.type === "note" ? "Study notes" : "PDF download";
                        return (
                          <button key={lec.id} onClick={() => setActiveLecture(lec)}
                            className="flex w-full items-center gap-3 rounded-xl border border-white bg-white px-4 py-3 text-left shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${lecColor}`}>
                              <LecIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{lec.title}</p>
                              <p className="text-xs text-slate-400">{lecLabel}</p>
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
