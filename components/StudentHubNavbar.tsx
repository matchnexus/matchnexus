"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  HiAcademicCap,
  HiUser,
  HiBriefcase,
  HiLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";

const navLinks = [
  { href: "/student/hub", label: "Hub", icon: HiAcademicCap, exact: true },
  { href: "/auth/student/jobs", label: "Jobs", icon: HiBriefcase },
  { href: "/auth/student/user", label: "Profile", icon: HiUser },
];

export default function StudentHubNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="relative z-30 w-full border-b border-blue-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Link href="/student/hub" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
              <HiAcademicCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Match<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Nexus</span>
            </span>
          </Link>
          {/* Disguised admin link — looks like a version tag to students */}
          <a href="/manage"
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:text-slate-400 transition select-none"
            title=" ">
            v1.0
          </a>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/student/user"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-100 transition"
          >
            <HiUser className="h-5 w-5" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-100 transition"
          >
            <HiLogout className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-xl p-2 text-slate-600 hover:bg-blue-50 transition md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-blue-100 bg-white/90 px-6 py-4 space-y-1 md:hidden">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition"
          >
            <HiLogout className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

