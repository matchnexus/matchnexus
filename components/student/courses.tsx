"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiAcademicCap, HiBookOpen, HiClock, HiSearch, HiStar,
  HiCollection, HiLightningBolt, HiCalendar, HiCheckCircle, HiX,
} from "react-icons/hi";

const MOCK_COURSES = [
  { id: "1", title: "Full Stack Web Development", provider: "MatchNexus Learning", duration: "8 weeks", progress: 30, status: "in_progress" as const },
  { id: "2", title: "Data Structures & Algorithms", provider: "Computing Fundamentals", duration: "6 weeks", progress: 0, status: "not_started" as const },
  { id: "3", title: "Career Readiness & Interview Skills", provider: "Professional Development", duration: "3 weeks", progress: 100, status: "completed" as const },
];

type Schedule = { courseId: string; date: string; note: string };

const TABS = [
  { id: "browse",   label: "Browse",      icon: HiSearch,   color: "from-blue-500 to-cyan-400",    img: "/photos/01.jpg" },
  { id: "learning", label: "My Learning", icon: HiBookOpen, color: "from-violet-500 to-purple-400", img: "/photos/02.jpg" },
  { id: "schedule", label: "Schedule",    icon: HiClock,    color: "from-amber-500 to-orange-400",  img: "/photos/03.jpg" },
  { id: "saved",    label: "Saved",       icon: HiStar,     color: "from-pink-500 to-rose-400",     img: "/photos/04.jpg" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CARD_ACCENTS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"];

function ScheduleModal({ courseId, existing, onSave, onClose }: {
  courseId: string; existing?: Schedule; onSave: (s: Schedule) => void; onClose: () => void;
}) {
  const course = MOCK_COURSES.find((c) => c.id === courseId)!;
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(existing?.date ?? "");
  const [note, setNote] = useState(existing?.note ?? "");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSave = () => {
    if (!date) { setError("Please pick a start date."); return; }
    if (date < today) { setError("Date cannot be in the past."); return; }
    onSave({ courseId, date, note });
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-100 p-4"><HiCheckCircle className="h-10 w-10 text-green-500" /></div>
            <h3 className="text-lg font-bold text-gray-900">Scheduled!</h3>
            <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{course.title}</span> starts on <span className="font-semibold text-blue-600">{date}</span>.</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Schedule Course</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition"><HiX className="h-5 w-5 text-gray-500" /></button>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{course.provider}</p>
              <p className="mt-0.5 text-sm font-black text-gray-900">{course.title}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date *</label>
              <input type="date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setError(""); }}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-gray-200"}`} />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optional)</label>
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Study 2 hours every evening"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none placeholder:text-gray-400" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-blue-700 transition">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "in_progress" | "not_started" | "completed" }) {
  const map = {
    completed:   "bg-emerald-100 text-emerald-700 border-emerald-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    not_started: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const labels = { completed: "Completed", in_progress: "In Progress", not_started: "Not Started" };
  return (
    <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function StudentCoursesHub() {
  const [activeTab, setActiveTab] = useState<TabId>("browse");
  const [search, setSearch] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["2"]));
  const router = useRouter();

  const toggleSave = (id: string) =>
    setSavedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES;
    if (activeTab === "learning") courses = courses.filter((c) => c.status === "in_progress" || c.status === "completed");
    if (activeTab === "saved") courses = courses.filter((c) => savedIds.has(c.id));
    if (activeTab === "schedule") return [];
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));
    }
    return courses;
  }, [activeTab, search, savedIds]);

  const headings: Record<TabId, { title: string; desc: string }> = {
    browse:   { title: "Course Hub",    desc: "Explore learning paths and build your skills." },
    learning: { title: "My Learning",   desc: "Continue the courses you already started." },
    schedule: { title: "Schedule",      desc: "Plan and track your learning timeline." },
    saved:    { title: "Saved Courses", desc: "Courses you have bookmarked. Click the star to save or unsave." },
  };
  const section = headings[activeTab];
  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      {schedulingId && (
        <ScheduleModal
          courseId={schedulingId}
          existing={schedules.find((s) => s.courseId === schedulingId)}
          onSave={(s) => setSchedules((prev) => [...prev.filter((x) => x.courseId !== s.courseId), s])}
          onClose={() => setSchedulingId(null)}
        />
      )}

      {/* Outer card — transparent blue mix */}
      <div className="overflow-hidden rounded-3xl border border-blue-200/70 shadow-lg"
        style={{ background: "rgba(219,234,254,0.45)", backdropFilter: "blur(16px)" }}>

        {/* Tab bar — image cards */}
        <div className="border-b border-blue-200 px-4 pt-4" style={{ background: "rgba(219,234,254,0.6)" }}>
          <div className="flex gap-2 overflow-x-auto pb-4">
            {TABS.map(({ id, label, icon: Icon, color, img }) => {
              const active = activeTab === id;
              return (
                <button key={id} type="button" onClick={() => setActiveTab(id)}
                  className={`group relative flex shrink-0 flex-col items-start justify-end overflow-hidden rounded-2xl transition-all duration-200 ${
                    active ? "ring-2 ring-blue-400 shadow-lg" : "opacity-70 hover:opacity-90"
                  }`}
                  style={{ width: "130px", height: "72px" }}
                >
                  <div className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url('${img}')` }} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${active ? "from-black/70 via-black/30" : "from-black/60 via-black/20"} to-transparent`} />
                  {active && <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-40`} />}
                  <div className="relative flex items-center gap-1.5 px-3 pb-2.5">
                    <Icon className="h-3.5 w-3.5 text-white shrink-0" />
                    <span className="text-xs font-bold text-white">{label}</span>
                  </div>
                  {active && <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5 lg:p-6">

          {/* Header + search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${activeTabMeta.color} text-white shadow-md`}>
                <activeTabMeta.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-gray-900">{section.title}</h2>
                <p className="text-xs text-gray-500">{section.desc}</p>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { icon: HiBookOpen,      label: "Active",    value: "02", bg: "bg-blue-50",   border: "border-blue-100",   icon_c: "text-blue-600" },
              { icon: HiLightningBolt, label: "Completed", value: "01", bg: "bg-amber-50",  border: "border-amber-100",  icon_c: "text-amber-600" },
              { icon: HiCalendar,      label: "This Week", value: "3",  bg: "bg-violet-50", border: "border-violet-100", icon_c: "text-violet-600" },
            ].map(({ icon: Icon, label, value, bg, border, icon_c }) => (
              <div key={label} className={`flex items-center gap-3 rounded-2xl border ${border} ${bg} px-4 py-3.5`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white ${icon_c}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
                  <p className="text-xl font-black text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Featured banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-5 shadow-lg">
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Featured Path</p>
                <h3 className="mt-1 text-lg font-black text-white">Build your developer profile faster</h3>
                <p className="mt-1 text-xs text-white/80 max-w-sm">Curated courses to grow your skills and land your internship.</p>
              </div>
              <button onClick={() => setActiveTab("browse")}
                className="shrink-0 self-start rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition shadow-sm sm:self-auto">
                Explore Now
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-blue-100 p-4" style={{ background: "rgba(255,255,255,0.6)" }}>
            <div className="mb-3 flex items-center gap-2">
              <HiCollection className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-black uppercase tracking-wide text-gray-600">Popular Categories</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Web Dev", "UI/UX", "Data Science", "Career Skills", "Mobile App"].map((cat) => (
                <button key={cat}
                  className="rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule tab */}
          {activeTab === "schedule" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-100 p-5" style={{ background: "rgba(255,255,255,0.65)" }}>
                <p className="mb-4 text-xs font-black uppercase tracking-wide text-gray-500">All Courses</p>
                <div className="space-y-3">
                  {MOCK_COURSES.map((course) => {
                    const sched = schedules.find((s) => s.courseId === course.id);
                    return (
                      <div key={course.id} className="flex flex-col gap-3 rounded-2xl border border-blue-100 p-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: "rgba(255,255,255,0.8)" }}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                            <HiAcademicCap className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{course.title}</p>
                            <p className="text-xs text-gray-500">{course.provider} · {course.duration}</p>
                            {sched && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <HiCalendar className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-xs font-bold text-blue-600">{sched.date}</span>
                                {sched.note && <span className="text-xs text-gray-400">— {sched.note}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <button onClick={() => setSchedulingId(course.id)}
                          className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            sched ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}>
                          {sched ? "Edit Schedule" : "Set Schedule"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {schedules.length > 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="mb-4 text-xs font-black uppercase tracking-wide text-gray-500">Upcoming</p>
                  <div className="space-y-2">
                    {[...schedules].sort((a, b) => a.date.localeCompare(b.date)).map((s) => {
                      const course = MOCK_COURSES.find((c) => c.id === s.courseId)!;
                      return (
                        <div key={s.courseId} className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3">
                          <HiCalendar className="h-5 w-5 shrink-0 text-emerald-500" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{course.title}</p>
                            {s.note && <p className="text-xs text-gray-500">{s.note}</p>}
                          </div>
                          <span className="text-xs font-black text-emerald-600">{s.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Course cards */}
          {activeTab !== "schedule" && (
            filteredCourses.length === 0 ? (
              <div className="rounded-2xl border border-blue-100 p-10 text-center" style={{ background: "rgba(255,255,255,0.6)" }}>
                <HiStar className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-3 text-base font-bold text-gray-800">
                  {activeTab === "saved" ? "No saved courses yet" : "No courses found"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {activeTab === "saved" ? "Click the star on any course to save it here." : "Nothing to show right now."}
                </p>
                {activeTab === "saved" && (
                  <button onClick={() => setActiveTab("browse")}
                    className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition">
                    Browse Courses
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course, idx) => (
                  <div key={course.id}
                    className="group flex flex-col gap-4 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ border: `2px solid ${CARD_ACCENTS[idx % CARD_ACCENTS.length]}`, background: "rgba(255,255,255,0.82)" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                        style={{ background: `linear-gradient(135deg, ${CARD_ACCENTS[filteredCourses.indexOf(course) % CARD_ACCENTS.length]}, ${CARD_ACCENTS[(filteredCourses.indexOf(course) + 1) % CARD_ACCENTS.length]})` }}>
                        <HiAcademicCap className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleSave(course.id)}
                          title={savedIds.has(course.id) ? "Remove from saved" : "Save for later"}
                          className={`rounded-xl p-2 transition ${
                            savedIds.has(course.id)
                              ? "bg-amber-100 text-amber-500 hover:bg-amber-200"
                              : "bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-400"
                          }`}>
                          <HiStar className="h-4 w-4" />
                        </button>
                        <StatusBadge status={course.status} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-black leading-snug text-gray-900">{course.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{course.provider}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">{course.duration}</p>
                    </div>
                    <div className="mt-auto space-y-2.5">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400">
                        <span>Progress</span>
                        <span className="text-gray-600">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                          style={{ width: `${course.progress}%` }} />
                      </div>
                      <button onClick={() => router.push(`/student/hub/courses/${course.id}`)}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
                        Open Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
