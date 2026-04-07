"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("admin-theme");
    setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin-theme", isDark ? "dark" : "light");
  }, [isDark]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "admin-theme-dark bg-slate-950 text-slate-200"
          : "admin-theme-light bg-background-base text-gray-700"
      }`}
    >
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <AdminNavbar
          onMenuClick={() => setMobileOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />
        <main className={`p-4 sm:p-6 lg:p-8 ${isDark ? "bg-slate-900/40" : "bg-background-soft"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
