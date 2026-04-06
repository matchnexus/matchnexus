"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HiSearch, HiBookOpen, HiClock, HiStar, HiChevronRight, HiAcademicCap } from "react-icons/hi";

// Tabs
const TABS = [
  { id: "browse", label: "Browse", icon: HiSearch },
  { id: "learning", label: "My Learning", icon: HiBookOpen },
  { id: "schedule", label: "Schedule", icon: HiClock },
  { id: "saved", label: "Saved", icon: HiStar },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Example course type
type Course = {
  id: string;
  title: string;
  provider: string;
  duration: string;
  progress: number;
  status: "in_progress" | "not_started" | "completed";
  saved?: boolean;
};

// Mock data
const MOCK_COURSES: Course[] = [
  { id: "1", title: "Full Stack Web Development", provider: "MatchNexus Learning", duration: "8 weeks", progress: 30, status: "in_progress" },
  { id: "2", title: "Data Structures & Algorithms", provider: "Computing Fundamentals", duration: "6 weeks", progress: 0, status: "not_started" },
  { id: "3", title: "Career Readiness & Interview Skills", provider: "Professional Development", duration: "3 weeks", progress: 100, status: "completed" },
];

export default function StudentCoursesHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("browse");
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["2"]));

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (activeTab === "learning") list = list.filter((c) => c.status !== "not_started");
    if (activeTab === "saved") list = list.filter((c) => savedIds.has(c.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search, savedIds, courses]);

  return (
    <div className="space-y-6 p-5">
      {/* Tab selector */}
      <div className="flex gap-4 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-lg ${activeTab === id ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
            <Icon className="inline h-4 w-4 mr-1" /> {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses..."
        className="w-full rounded-lg border border-gray-300 p-2"
      />

      {/* Course list */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredCourses.map((c) => {
          const isSaved = savedIds.has(c.id);
          return (
            <div
              key={c.id}
              onClick={() => router.push(`/student/hub/courses/${c.id}`)}
              className="group relative w-full rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Star save button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSavedIds((prev) => {
                    const next = new Set(prev);
                    isSaved ? next.delete(c.id) : next.add(c.id);
                    return next;
                  });
                }}
                className="absolute right-4 top-4 rounded-lg p-1.5 transition hover:bg-yellow-50"
                title={isSaved ? "Unsave" : "Save course"}
              >
                <HiStar className={`h-4 w-4 transition ${isSaved ? "text-yellow-400" : "text-slate-300 group-hover:text-slate-400"}`} />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <HiAcademicCap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{c.title}</h3>
                  <p className="text-sm text-slate-500">{c.provider}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue-500">{c.status.replace("_", " ")}</p>
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
        })}
      </div>
    </div>
  );
}