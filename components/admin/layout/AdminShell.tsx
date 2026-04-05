"use client";

<<<<<<< Updated upstream
import { usePathname } from "next/navigation";
=======
import { useState } from "react";
>>>>>>> Stashed changes
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
<<<<<<< Updated upstream
  const pathname = usePathname();

  // Don't render admin UI on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background-base text-gray-700">
      <AdminSidebar />

      <div className="lg:pl-72">
        <AdminNavbar />
        <main className="p-4 sm:p-6 lg:p-8 bg-background-soft">
          {children}
        </main>
=======
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <AdminNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
