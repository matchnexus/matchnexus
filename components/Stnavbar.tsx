"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("studentName") || "";
    setCompanyName(storedName);
  }, []);

  const tabs = [
    { name: "jobs", href: "/auth/student/jobs" },
    { name: "Profile", href: "/auth/student/user" },
    { name: "suggestions", href: "/auth/student/suggestions" },
    { name: "courses", href: "/student/hub" },
      { name: "applications", href: "/auth/student/applications" }
  ];

  const baseLink =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition";
  const normalLink = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const activeLink = "bg-sky-700 text-white shadow-sm";

  const isActive = (href: string) => {
    if (href === "/company/dashboard") return pathname === "/company/dashboard";
    if (href === "/company/posts") {
      return (
        pathname === "/company/posts" || pathname.startsWith("/company/posts/")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (href: string) =>
    `${baseLink} ${isActive(href) ? activeLink : normalLink}`;

  const displayTitle = companyName ? `Welcome, ${companyName}` : "Welcome";

  const handelLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
    localStorage.removeItem("studentName");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/auth/student/jobs" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            {displayTitle}
          </span>
        </Link>

        <button
          className="inline-flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open company menu"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav
          className={[
            "md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center",
            open
              ? "absolute left-0 top-full w-full border-b bg-white px-6 py-6 shadow-sm md:top-auto md:w-auto md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none"
              : "hidden md:flex",
          ].join(" ")}
        >
          <div className="flex flex-col gap-3 md:mx-auto md:flex-row md:items-center md:gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={linkClass(tab.href)}
              >
                <span>{tab.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/auth/login"
              onClick={handelLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <span className="text-base leading-none">🚪</span>
              <span>Logout</span>
            </Link>
          </div>
        </nav>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Link
            href="/auth/login"
            onClick={handelLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <span className="text-base leading-none"></span>
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
}