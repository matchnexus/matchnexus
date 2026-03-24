"use client";

import { Badge, Button, Card } from "flowbite-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiAcademicCap,
  HiBookOpen,
  HiClock,
  HiSearch,
  HiStar,
  HiCollection,
  HiLightningBolt,
  HiCalendar,
  HiCheckCircle,
  HiX,
} from "react-icons/hi";

const MOCK_COURSES = [
  { id: "1", title: "Full Stack Web Development", provider: "MatchNexus Learning", duration: "8 weeks", progress: 30, status: "in_progress" as const },
  { id: "2", title: "Data Structures & Algorithms", provider: "Computing Fundamentals", duration: "6 weeks", progress: 0, status: "not_started" as const },
  { id: "3", title: "Career Readiness & Interview Skills", provider: "Professional Development", duration: "3 weeks", progress: 100, status: "completed" as const },
];

type Schedule = { courseId: string; date: string; note: string };

const sidebarItems = [
  { id: "browse", label: "Browse", icon: HiSearch },
  { id: "learning", label: "My Learning", icon: HiBookOpen },
  { id: "schedule", label: "Schedule", icon: HiClock },
  { id: "saved", label: "Saved", icon: HiStar },
] as const;

type TabId = (typeof sidebarItems)[number]["id"];

// ── Schedule modal ────────────────────────────────────────────────────────────
function ScheduleModal({
  courseId,
  existing,
  onSave,
  onClose,
}: {
  courseId: string;
  existing?: Schedule;
  onSave: (s: Schedule) => void;
  onClose: () => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <HiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Scheduled</h3>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">{course.title}</span> is scheduled for <span className="font-semibold">{date}</span>.
            </p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-gray-900 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Schedule Course</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition"><HiX className="h-5 w-5 text-gray-500" /></button>
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-3">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">{course.provider}</p>
              <p className="mt-0.5 text-sm font-black text-slate-800">{course.title}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date *</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => { setDate(e.target.value); setError(""); }}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-gray-200"}`}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optional)</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Study 2 hours every evening"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <button onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition">Save Schedule</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StudentCoursesHub() {
  const [activeTab, setActiveTab] = useState<TabId>("browse");
  const [search, setSearch] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["2"])); // pre-save one as demo
  const router = useRouter();

  const toggleSave = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES;
    switch (activeTab) {
      case "learning":
        courses = courses.filter((c) => c.status === "in_progress" || c.status === "completed");
        break;
      case "saved":
        courses = courses.filter((c) => savedIds.has(c.id));
        break;
      case "schedule":
        return []; // schedule tab has its own UI
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));
    }
    return courses;
  }, [activeTab, search, savedIds]);

  const getHeading = () => {
    switch (activeTab) {
      case "browse":
        return {
          title: "Course Hub",
          desc: "Explore available learning paths and continue building your skills.",
        };
      case "learning":
        return {
          title: "My Learning",
          desc: "Continue the courses you already started.",
        };
      case "schedule":
        return {
          title: "Schedule",
          desc: "Track your active learning timeline.",
        };
      case "saved":
        return {
          title: "Saved Courses",
          desc: "Courses you've bookmarked to start later. Click ★ on any course to save or unsave.",
        };
      default:
        return {
          title: "Course Hub",
          desc: "Browse and track your learning paths.",
        };
    }
  };

  const section = getHeading();

  return (
    <>
      {schedulingId && (
        <ScheduleModal
          courseId={schedulingId}
          existing={schedules.find((s) => s.courseId === schedulingId)}
          onSave={(s) => {
            setSchedules((prev) => {
              const filtered = prev.filter((x) => x.courseId !== s.courseId);
              return [...filtered, s];
            });
          }}
          onClose={() => setSchedulingId(null)}
        />
      )}
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 p-5 shadow-xl lg:flex-row lg:p-6">
      {/* soft background glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-3xl" />

      {/* Sidebar */}
      <aside className="relative z-10 flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 lg:w-56 lg:flex-col lg:gap-3 lg:pb-0">
        {sidebarItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex min-w-[7.5rem] items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold shadow-sm transition-all duration-200 lg:min-w-0 ${
                isActive
                  ? "border border-blue-200 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                  : "border border-slate-200/80 bg-white/90 text-slate-700 hover:border-sky-200 hover:bg-sky-50"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="hidden lg:inline">{label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main content */}
      <div className="relative z-10 min-w-0 flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
              {section.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {section.desc}
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-2xl border-none bg-white/90 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-blue-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Top stats - makes page feel fuller */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.5rem] border-none bg-white/95 shadow-sm ring-1 ring-blue-100">
            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <HiBookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Active Courses
                </p>
                <p className="text-2xl font-black text-slate-800">02</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[1.5rem] border-none bg-white/95 shadow-sm ring-1 ring-blue-100">
            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                <HiLightningBolt className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Completed
                </p>
                <p className="text-2xl font-black text-slate-800">01</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[1.5rem] border-none bg-white/95 shadow-sm ring-1 ring-blue-100">
            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <HiCalendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  This Week
                </p>
                <p className="text-2xl font-black text-slate-800">03 Tasks</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured banner */}
        <Card className="rounded-[1.75rem] border-none bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-lg">
          <div className="flex flex-col gap-4 p-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                Featured Learning Path
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Build your developer profile faster
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/85">
                Continue your current learning journey, track progress, and grow
                your skills with curated student-friendly courses.
              </p>
            </div>

            <Button
              onClick={() => setActiveTab("browse")}
              className="rounded-xl border-0 bg-white text-blue-700 font-bold hover:bg-blue-50"
            >
              Explore Now
            </Button>
          </div>
        </Card>

        {/* Categories */}
        <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <HiCollection className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-black uppercase tracking-wide text-slate-700">
              Popular Categories
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Web Dev", "UI/UX", "Data Science", "Career Skills", "Mobile App"].map(
              (category) => (
                <button
                  key={category}
                  className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Schedule tab */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 shadow-sm">
              <p className="mb-4 text-xs font-black uppercase tracking-wide text-slate-500">All Courses</p>
              <div className="space-y-3">
                {MOCK_COURSES.map((course) => {
                  const sched = schedules.find((s) => s.courseId === course.id);
                  return (
                    <div key={course.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                          <HiAcademicCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{course.title}</p>
                          <p className="text-xs text-slate-500">{course.provider} · {course.duration}</p>
                          {sched && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <HiCalendar className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-xs font-bold text-blue-600">{sched.date}</span>
                              {sched.note && <span className="text-xs text-slate-400">— {sched.note}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSchedulingId(course.id)}
                        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                          sched
                            ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {sched ? "Edit Schedule" : "Set Schedule"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {schedules.length > 0 && (
              <div className="rounded-[1.5rem] border border-green-100 bg-white/90 p-5 shadow-sm">
                <p className="mb-4 text-xs font-black uppercase tracking-wide text-slate-500">Upcoming</p>
                <div className="space-y-2">
                  {[...schedules]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((s) => {
                      const course = MOCK_COURSES.find((c) => c.id === s.courseId)!;
                      return (
                        <div key={s.courseId} className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3">
                          <HiCalendar className="h-5 w-5 shrink-0 text-green-500" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{course.title}</p>
                            {s.note && <p className="text-xs text-slate-500">{s.note}</p>}
                          </div>
                          <span className="text-xs font-black text-green-600">{s.date}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Course cards (all tabs except schedule) */}
        {activeTab !== "schedule" && (
          <>
            {filteredCourses.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-8 text-center shadow-md ring-1 ring-blue-100 backdrop-blur-sm">
            <HiStar className="mx-auto h-10 w-10 text-slate-200" />
            <h3 className="mt-3 text-lg font-bold text-slate-800">
              {activeTab === "saved" ? "No saved courses yet" : "No courses found"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {activeTab === "saved"
                ? "Click the ★ on any course to save it here for later."
                : "There is nothing to show in this section right now."}
            </p>
            {activeTab === "saved" && (
              <button
                onClick={() => setActiveTab("browse")}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="rounded-[1.75rem] border-none bg-white/95 shadow-lg ring-1 ring-blue-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-full flex-col gap-4 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
                      <HiAcademicCap className="h-6 w-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSave(course.id)}
                        title={savedIds.has(course.id) ? "Remove from saved" : "Save for later"}
                        className={`rounded-xl p-2 transition ${
                          savedIds.has(course.id)
                            ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
                            : "bg-slate-100 text-slate-400 hover:bg-yellow-50 hover:text-yellow-400"
                        }`}
                      >
                        <HiStar className="h-4 w-4" />
                      </button>

                      <Badge
                        color={
                          course.status === "completed"
                            ? "success"
                            : course.status === "in_progress"
                              ? "info"
                              : "gray"
                        }
                        className="rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wide"
                      >
                        {course.status === "completed"
                          ? "Completed"
                          : course.status === "in_progress"
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black leading-snug text-slate-800">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {course.provider}
                    </p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {course.duration}
                    </p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                      <span>Progress</span>
                      <span className="text-slate-700">{course.progress}%</span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <Button
                      color="light"
                      onClick={() => router.push(`/student/hub/courses/${course.id}`)}
                      className="w-full rounded-xl border-none bg-blue-50 font-bold text-blue-700 hover:bg-blue-100"
                    >
                      Open Course
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
    </>
  );
}