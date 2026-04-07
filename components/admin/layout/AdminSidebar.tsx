"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HiX } from "react-icons/hi";
import { adminNavItems } from "@/lib/admin-nav";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-600">MatchNexus</p>
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-gray-100 lg:hidden">
            <HiX className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <nav className="space-y-1 p-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={clsx("h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-gray-200 bg-white lg:block">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-gray-200 bg-white shadow-xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}