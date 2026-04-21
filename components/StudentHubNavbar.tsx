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
  HiCog,
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
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-52 flex-col bg-white/95 backdrop-blur-md shadow-xl border-r border-slate-100 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
              <HiAcademicCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-800">MatchNexus</span>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <HiX className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <p className="mb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Navigate</p>
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Management link */}
        <div className="px-3 pb-2">
          <a
            href="/manage"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
          >
            <HiCog className="h-4 w-4 shrink-0" />
            Management
          </a>
        </div>

        {/* Sign out */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <HiLogout className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Navbar */}
      <header className="relative z-30 w-full border-b border-blue-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5">

          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <HiMenu className="h-5 w-5" />
            </button>

            <Link href="/student/hub" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/25">
                <HiAcademicCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900">
                Match<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Nexus</span>
              </span>
            </Link>
          </div>

          {/* Right: logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition"
          >
            <HiLogout className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </header>
    </>
  );
}