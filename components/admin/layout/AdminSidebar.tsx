"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { adminNavItems } from "@/lib/admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
            MatchNexus
          </p>
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}