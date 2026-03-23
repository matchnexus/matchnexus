"use client";

import { Avatar, Dropdown } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLogout,
  HiOutlineUserCircle,
} from "react-icons/hi";

export default function NavbarMain() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (
    pathname === "/auth/company/login" ||
    pathname.startsWith("/company/")
  ) {
    return null;
  }

  const isHome = pathname === "/";

  const headerClass = isHome
    ? "absolute top-0 left-0 z-50 w-full"
    : "sticky top-0 z-50 w-full border-b bg-white";

  const brandClass = isHome ? "text-white" : "text-gray-900";

  const mobileBtnClass = isHome
    ? "inline-flex items-center rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
    : "inline-flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 md:hidden";

  const mobileMenuClass = isHome ? "bg-sky-700/95" : "bg-white";

  // Base styles for links
  const baseLink = isHome
    ? "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
    : "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition";

  const normalLink = isHome
    ? "text-white/95 hover:bg-white hover:text-slate-900"
    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  // Active styles (current page highlight)
  const activeLink = isHome
    ? "bg-white text-slate-900 shadow-sm"
    : "bg-blue-600 text-white shadow-sm";

  // helper to mark active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (href: string) =>
    `${baseLink} ${isActive(href) ? activeLink : normalLink}`;

  const user = {
    name: "Chamindu Perera",
    email: "chamindu@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    status: "Student",
  };

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span
            className={`text-3xl font-extrabold tracking-tight ${brandClass}`}
          >
            MatchNexus
          </span>
        </Link>

        {/* MOBILE hamburger */}
        <button
          className={mobileBtnClass}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open main menu"
          type="button"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* CENTER + RIGHT */}
        <nav
          className={[
            "md:flex md:items-center md:gap-10",
            open
              ? `absolute left-0 top-full w-full ${mobileMenuClass} px-6 py-6 md:static md:w-auto md:bg-transparent md:px-0 md:py-0`
              : "hidden md:flex",
          ].join(" ")}
        >
          {/* CENTER MENU */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 md:mx-auto">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>

            <Link href="/jobs" className={linkClass("/jobs")}>
              Jobs
            </Link>

            <Link href="/contact" className={linkClass("/contact")}>
              Contact us
            </Link>

            <Link href="/about" className={linkClass("/about")}>
              About Us
            </Link>

            <Link href="/terms" className={linkClass("/terms")}>
              Terms
            </Link>

            <Link href="/privacy" className={linkClass("/privacy")}>
              Privacy
            </Link>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="mt-6 ml-4 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:gap-4">
            <Link
              href="/auth/login"
              className="rounded-2xl bg-lime-500 px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-black/20 hover:bg-lime-900 text-center"
            >
              LOGIN / SIGNUP
            </Link>

            <Link
              href="/auth/company/login"
              className="rounded-2xl bg-red-800 px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-black/20 hover:bg-red-900 text-center"
            >
              POST YOUR VACANCY
            </Link>
          </div>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user.avatar}
                rounded
                size="sm"
                className="ring-2 ring-blue-100 p-0.5 h-8 w-8 object-cover"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-bold">{user.name}</span>
              <span className="block truncate text-xs text-gray-500">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiOutlineUserCircle}>
              <Link
                href="/auth/user"
                className="font-bold text-sky-600 hover:underline"
              >
                My profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item icon={HiOutlineAcademicCap}>
              <Link
                href="/student/hub"
                className="font-bold text-sky-600 hover:underline"
              >
                Student hub
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiOutlineLogout} className="text-red-600">
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </nav>
      </div>
    </header>
  );
}
