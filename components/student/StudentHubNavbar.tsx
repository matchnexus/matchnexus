"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiAcademicCap,
  HiCreditCard,
  HiArrowLeft,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";

type HubTab = "courses" | "payment";

interface StudentHubNavbarProps {
  activeTab: HubTab;
  onTabChange: (tab: HubTab) => void;
}

export default function StudentHubNavbar({ activeTab, onTabChange }: StudentHubNavbarProps) {
  const router = useRouter();

  const tabs: { id: HubTab; label: string; icon: React.ElementType }[] = [
    { id: "courses", label: "Course Hub", icon: HiAcademicCap },
    { id: "payment", label: "Payments", icon: HiCreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Left: back + brand */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:text-blue-600"
          >
            <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          <span className="h-5 w-px bg-slate-200" />
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
            MatchNexus
          </Link>
        </div>

        {/* Center: tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right: profile + sign out */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/user"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <HiOutlineUserCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider text-red-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineLogout className="h-5 w-5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
