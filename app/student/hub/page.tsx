"use client";

import { useState } from "react";
import StudentCoursesHub from "@/components/student/courses";
import StudentPaymentHub from "@/components/student/payment";

type HubTab = "courses" | "payment";

export default function StudentHubPage() {
  const [tab, setTab] = useState<HubTab>("courses");

  const tabs: { id: HubTab; label: string }[] = [
    { id: "courses", label: "Courses" },
    { id: "payment", label: "Payment" },
  ];

  return (
    <div style={{ backgroundColor: "#F8FBFF" }} className="min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wide transition ${
                tab === t.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "courses" && <StudentCoursesHub />}

        {tab === "payment" && <StudentPaymentHub />}
      </div>
    </div>
  );
}
