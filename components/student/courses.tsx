"use client";

import { Badge, Button, Card } from "flowbite-react";
import {
  HiAcademicCap,
  HiBookOpen,
  HiClock,
  HiSearch,
  HiStar,
} from "react-icons/hi";

const MOCK_COURSES = [
  {
    id: "1",
    title: "Full Stack Web Development",
    provider: "MatchNexus Learning",
    duration: "8 weeks",
    progress: 30,
    status: "in_progress" as const,
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    provider: "Computing Fundamentals",
    duration: "6 weeks",
    progress: 0,
    status: "not_started" as const,
  },
  {
    id: "3",
    title: "Career Readiness & Interview Skills",
    provider: "Professional Development",
    duration: "3 weeks",
    progress: 100,
    status: "completed" as const,
  },
];

const sidebarItems = [
  { id: "browse", label: "Browse", icon: HiSearch },
  { id: "learning", label: "My learning", icon: HiBookOpen },
  { id: "schedule", label: "Schedule", icon: HiClock },
  { id: "saved", label: "Saved", icon: HiStar },
];

export default function StudentCoursesHub() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 lg:w-52 lg:flex-col lg:gap-3 lg:pb-0">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="flex min-w-[7.5rem] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/60 lg:min-w-0"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Icon className="h-5 w-5" />
            </span>
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
              Course hub
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Browse and track your learning paths (preview — not connected yet).
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              readOnly
              placeholder="Search courses…"
              className="w-full rounded-2xl border-none bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_COURSES.map((course) => (
            <Card
              key={course.id}
              className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex h-full flex-col gap-4 p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                    <HiAcademicCap className="h-6 w-6" />
                  </div>
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
                        ? "In progress"
                        : "Not started"}
                  </Badge>
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
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <Button
                    color="light"
                    className="w-full rounded-xl border-none bg-slate-50 font-bold text-slate-800 hover:bg-slate-100"
                    disabled
                  >
                    Open course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
