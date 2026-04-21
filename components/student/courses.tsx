"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiSearch, HiBookOpen, HiClock, HiStar, HiChevronRight,
  HiAcademicCap, HiCalendar, HiX, HiCheckCircle,
} from "react-icons/hi";

const TABS = [
  { id: "browse",   label: "Browse",      icon: HiSearch },
  { id: "learning", label: "My Learning", icon: HiBookOpen },
  { id: "schedule", label: "Schedule",    icon: HiClock },
  { id: "saved",    label: "Saved",       icon: HiStar },
] as const;

type TabId = (typeof TABS)[number]["id"];
type Course = {
  id: string; title: string; provider: string; duration: string;
  progress: number; status: "in_progress" | "not_started" | "completed";
  level?: string; isFree?: boolean; priceAmount?: string;
};
type Schedule = { courseId: string; date: string; time: string; note: string };

const MOCK_COURSES: Course[] = [
  { id: "1", title: "Full Stack Web Development",          provider: "MatchNexus Learning",      duration: "8 weeks", progress: 30,  status: "in_progress" },
  { id: "2", title: "Data Structures & Algorithms",        provider: "Computing Fundamentals",   duration: "6 weeks", progress: 0,   status: "not_started" },
  { id: "3", title: "Career Readiness & Interview Skills", provider: "Professional Development", duration: "3 weeks", progress: 100, status: "completed" },
];

function ScheduleModal({ course, existing, onSave, onClose }: {
  course: Course; existing?: Schedule; onSave: (s: Schedule) => void; onClose: () => void;
}) {
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "09:00");
  const [note, setNote] = useState(existing?.note ?? "");
  const [done, setDone] = useState(false);
  const handleSave = () => { if (!date) return; onSave({ courseId: course.id, date, time, note }); setDone(true); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {done ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-green-100 p-3"><HiCheckCircle className="h-8 w-8 text-green-500" /></div>
            <p className="font-bold text-slate-800">Scheduled!</p>
            <p className="text-sm text-slate-500">{course.title} — {date} at {time}</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Schedule Course</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition"><HiX className="h-4 w-4 text-slate-500" /></button>
            </div>
            <p className="text-sm text-slate-500 truncate">{course.title}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date *</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Note (optional)</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Module 3 revision"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} disabled={!date} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ c, isSaved, schedule, onToggleSave, onSchedule, onClick }: {
  c: Course; isSaved: boolean; schedule?: Schedule;
  onToggleSave: () => void; onSchedule: () => void; onClick: () => void;
}) {
  return (
    <div onClick={onClick} className="group relative w-full rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
      <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className="absolute right-10 top-4 rounded-lg p-1.5 hover:bg-yellow-50 transition">
        <HiStar className={`h-4 w-4 transition ${isSaved ? "text-yellow-400" : "text-slate-300 group-hover:text-slate-400"}`} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onSchedule(); }} className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-blue-50 transition">
        <HiCalendar className={`h-4 w-4 transition ${schedule ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`} />
      </button>
      <div className="flex items-start gap-3 pr-16">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <HiAcademicCap className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{c.title}</h3>
          <p className="text-sm text-slate-500">{c.provider}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue-500">{c.status.replace("_", " ")}</p>
          {schedule && (
            <p className="mt-1 text-xs text-blue-400 flex items-center gap-1">
              <HiCalendar className="h-3 w-3" /> {schedule.date} at {schedule.time}
            </p>
          )}
          {c.progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${c.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">{c.progress}% complete</p>
            </div>
          )}
        </div>
        <HiChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition shrink-0 mt-1" />
      </div>
    </div>
  );
}

export default function StudentCoursesHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("browse");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulingCourse, setSchedulingCourse] = useState<Course | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("course_saved");
    const sched = localStorage.getItem("course_schedules");
    if (saved) setSavedIds(new Set(JSON.parse(saved)));
    if (sched) setSchedules(JSON.parse(sched));
  }, []);

  useEffect(() => {
    fetch("/api/student/courses")
      .then((r) => r.json())
      .then((data) => {
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses.map((c: any) => ({
            id: c.id, title: c.title, provider: "MatchNexus Learning",
            duration: c.moduleCount ? `${c.moduleCount} modules` : "—",
            progress: c.enrollment?.enrollmentStatus === "COMPLETED" ? 100 : c.enrollment ? 30 : 0,
            status: c.enrollment?.enrollmentStatus === "COMPLETED" ? "completed" : c.enrollment ? "in_progress" : "not_started",
            level: c.level, isFree: c.isFree, priceAmount: c.priceAmount,
          })));
        } else {
          setCourses(MOCK_COURSES);
        }
      })
      .catch(() => setCourses(MOCK_COURSES))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("course_saved", JSON.stringify([...next]));
      return next;
    });
  };

  const saveSchedule = (s: Schedule) => {
    setSchedules((prev) => {
      const next = prev.filter((x) => x.courseId !== s.courseId).concat(s);
      localStorage.setItem("course_schedules", JSON.stringify(next));
      return next;
    });
  };

  const removeSchedule = (courseId: string) => {
    setSchedules((prev) => {
      const next = prev.filter((x) => x.courseId !== courseId);
      localStorage.setItem("course_schedules", JSON.stringify(next));
      return next;
    });
  };

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (activeTab === "learning") list = list.filter((c) => c.status !== "not_started");
    if (activeTab === "saved")    list = list.filter((c) => savedIds.has(c.id));
    if (activeTab === "schedule") list = list.filter((c) => schedules.some((s) => s.courseId === c.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search, savedIds, schedules, courses]);

  return (
    <div className="space-y-6">
      {schedulingCourse && (
        <ScheduleModal
          course={schedulingCourse}
          existing={schedules.find((s) => s.courseId === schedulingCourse.id)}
          onSave={(s) => { saveSchedule(s); setSchedulingCourse(null); }}
          onClose={() => setSchedulingCourse(null)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === id ? "bg-blue-600 text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-blue-50"
            }`}>
            <Icon className="h-4 w-4" /> {label}
            {id === "saved" && savedIds.size > 0 && <span className="ml-1 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-black text-white">{savedIds.size}</span>}
            {id === "schedule" && schedules.length > 0 && <span className="ml-1 rounded-full bg-blue-400 px-1.5 py-0.5 text-[10px] font-black text-white">{schedules.length}</span>}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      {activeTab === "schedule" && schedules.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-white/80 overflow-hidden">
          <div className="border-b border-blue-100 px-5 py-3 bg-blue-50/60">
            <p className="text-xs font-black uppercase tracking-wide text-slate-600">Upcoming Sessions</p>
          </div>
          <div className="divide-y divide-blue-50">
            {schedules.slice().sort((a, b) => a.date.localeCompare(b.date)).map((s) => {
              const course = courses.find((c) => c.id === s.courseId);
              if (!course) return null;
              return (
                <div key={s.courseId} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{course.title}</p>
                    <p className="text-xs text-blue-500">{s.date} at {s.time}{s.note ? ` — ${s.note}` : ""}</p>
                  </div>
                  <button onClick={() => removeSchedule(s.courseId)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-400 transition">
                    <HiX className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" />)}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white/60 py-12 text-center">
          <HiAcademicCap className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">
            {activeTab === "saved" ? "No saved courses yet." : activeTab === "schedule" ? "No scheduled sessions." : "No courses found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} c={c}
              isSaved={savedIds.has(c.id)}
              schedule={schedules.find((s) => s.courseId === c.id)}
              onToggleSave={() => toggleSave(c.id)}
              onSchedule={() => setSchedulingCourse(c)}
              onClick={() => router.push(`/student/hub/courses/${c.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
