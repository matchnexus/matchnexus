"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  HiAcademicCap,
  HiCreditCard,
  HiUser,
  HiBriefcase,
  HiLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";

const navLinks = [
  { href: "/student/hub", label: "Courses", icon: HiAcademicCap, exact: true },
  { href: "/auth/student/jobs", label: "Jobs", icon: HiBriefcase },
  { href: "/auth/student/user", label: "Profile", icon: HiUser },
];

export default function StudentHubNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="relative w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/student/hub" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
            <HiAcademicCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Match<span className="text-blue-600">Nexus</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <HiUser className="h-5 w-5" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition"
          >
            <HiLogout className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 space-y-1 md:hidden">
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
                    : "text-slate-600 hover:bg-slate-100"
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
