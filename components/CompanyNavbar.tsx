"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

  const syncCompanyIdentity = () => {
    setCompanyName(localStorage.getItem("companyName") || "");
    setCompanyLogoUrl(localStorage.getItem("companyLogoUrl") || "");
  };

  useEffect(() => {
    syncCompanyIdentity();

    const onProfileUpdated = () => syncCompanyIdentity();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "companyName" || event.key === "companyLogoUrl") {
        syncCompanyIdentity();
      }
    };

    window.addEventListener("company-profile-updated", onProfileUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("company-profile-updated", onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const tabs = [
    { name: "Home", href: "/company/dashboard" },
    { name: "Applications", href: "/company/applications" },
    { name: "Analytics", href: "/company/analytics" },
    { name: "Posts", href: "/company/posts" },
    { name: "Settings", href: "/company/profile" },
    { name: "Contact Us", href: "/company/contactus" },
  ];

  const isActive = (href: string) => {
    if (href === "/company/dashboard") return pathname === "/company/dashboard";
    if (href === "/company/posts") {
      return pathname === "/company/posts" || pathname.startsWith("/company/posts/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const displayTitle = companyName ? companyName : "MatchNexus";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-100/50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">

        {/* LEFT - LOGO */}
        <Link href="/company/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt="Company logo"
                className="h-full w-full object-cover"
              />
            ) : (
              "M"
            )}
          </div>
          <h1 className="hidden text-lg font-bold text-slate-800 md:block">
            {displayTitle}
          </h1>
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-700 hover:bg-white/50 rounded-lg transition"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* CENTER NAV - Desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(tab.href)
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE - Logout */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/auth/company/login"
            onClick={() => {
              localStorage.removeItem("companyName");
              localStorage.removeItem("companyLogoUrl");
            }}
            className="hidden md:inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </Link>

          <Link
            href="/auth/company/login"
            onClick={() => {
              localStorage.removeItem("companyName");
              localStorage.removeItem("companyLogoUrl");
            }}
            className="md:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
            title="Logout"
          >
            🚪
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden border-t border-purple-100/50 bg-white/90 px-4 py-3 space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(tab.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.name}
            </Link>
          ))}
          <Link
            href="/auth/company/login"
            onClick={() => {
              localStorage.removeItem("companyName");
              localStorage.removeItem("companyLogoUrl");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition text-center"
          >
            Logout
          </Link>
        </nav>
      )}
    </header>
  );
}