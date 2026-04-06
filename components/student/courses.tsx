"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HiSearch, HiBookOpen, HiClock, HiStar } from "react-icons/hi";
import { Card } from "flowbite-react";

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
        {filteredCourses.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/student/hub/courses/${c.id}`)}
            className="text-left"
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.provider}</p>
              <p className="text-xs font-black uppercase tracking-wide">{c.status}</p>
              {c.progress > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{c.progress}% complete</p>
                </div>
              )}
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}