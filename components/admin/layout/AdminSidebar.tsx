"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { adminNavItems } from "@/lib/admin-nav";
import { useState, useEffect } from "react";
import {
  HiChevronDown,
  HiChevronLeft,
  HiCog,
  HiSupport,
  HiLogout,
  HiMenu,
} from "react-icons/hi";

const LOGO_URL = "/photos/logo.png";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleDropdown = (href: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const navItemsWithChildren = adminNavItems.map((item) => ({
    ...item,
    children:
      item.label === "Users"
        ? [
            { href: "/admin/users/students", label: "Students", icon: HiCog },
            { href: "/admin/users/companies", label: "Companies", icon: HiCog },
          ]
        : item.label === "Content"
        ? [
            { href: "/admin/content/posts", label: "Posts", icon: HiCog },
            { href: "/admin/content/reports", label: "Reports", icon: HiCog },
          ]
        : undefined,
  }));

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative flex flex-col items-center justify-center border-b border-gray-200 px-4 py-4">
          {!isCollapsed ? (
            <div className="flex w-full flex-col items-center gap-2">
              <Link href="/admin" className="group flex flex-col items-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-background-soft to-background-base shadow-md transition-all duration-300 group-hover:scale-105">
                  {LOGO_URL ? (
                    <Image
                      src={LOGO_URL}
                      alt="MatchNexus Logo"
                      width={135}
                      height={135}
                      className="rounded-xl object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">MN</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h2 className="text-xl font-bold text-gray-900">MatchNexus</h2>
                </div>
              </Link>
            </div>
          ) : (
            <Link
              href="/admin"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-background-soft to-background-base shadow-md transition-all duration-300 hover:scale-105"
            >
              {LOGO_URL ? (
                <Image
                  src={LOGO_URL}
                  alt="MatchNexus Logo"
                  width={56}
                  height={56}
                  className="rounded-lg object-contain"
                />
              ) : (
                <span className="text-sm font-bold text-white">MN</span>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={clsx(
              "absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-600 hover:shadow",
              isCollapsed && "rotate-180"
            )}
          >
            <HiChevronLeft className="h-3 w-3" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItemsWithChildren.map((item) => {
              const Icon = item.icon;
             const isActive =
                                item.href === "/admin"
                                  ? pathname === "/admin"
                                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openDropdowns.includes(item.href);

              return (
                <div key={item.href} className="relative">
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.href)}
                        className={clsx(
                          "group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-green-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={clsx(
                              "h-5 w-5 transition-all duration-200",
                              isActive
                                ? "text-white"
                                : "text-gray-500 group-hover:scale-110 group-hover:text-white"
                            )}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isCollapsed && (
                          <HiChevronDown
                            className={clsx(
                              "h-4 w-4 transition-transform duration-200",
                              isOpen && "rotate-180",
                              isActive ? "text-white" : "group-hover:text-white"
                            )}
                          />
                        )}
                      </button>

                      {!isCollapsed && isOpen && hasChildren && (
                        <div className="animate-in slide-in-from-top-2 mt-1 ml-8 space-y-1 duration-200">
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = pathname === child.href;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={clsx(
                                  "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200",
                                  isChildActive
                                    ? "bg-green-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-green-500 hover:text-white hover:shadow-md"
                                )}
                              >
                                <ChildIcon
                                  className={clsx(
                                    "h-4 w-4 transition-all duration-200",
                                    isChildActive
                                      ? "text-white"
                                      : "text-gray-400 group-hover:text-white"
                                  )}
                                />
                                <span>{child.label}</span>
                                {isChildActive && (
                                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-green-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon
                        className={clsx(
                          "h-5 w-5 transition-all duration-200",
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:scale-110 group-hover:text-white"
                        )}
                      />

                      {!isCollapsed && <span>{item.label}</span>}

                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full z-50 ml-2 invisible whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                          {item.label}
                        </div>
                      )}

                      {isActive && !isCollapsed && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-auto border-t border-gray-200 pt-4">
            <div className="space-y-1 px-3">
              <Link
                href="/admin/settings"
                className={clsx(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  pathname === "/admin/settings"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <HiCog
                  className={clsx(
                    "h-5 w-5 transition-all duration-200",
                    pathname === "/admin/settings"
                      ? "text-white"
                      : "text-gray-500 group-hover:scale-110 group-hover:text-white"
                  )}
                />
                {!isCollapsed && <span>Settings</span>}
                {isCollapsed && (
                  <div className="invisible absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    Settings
                  </div>
                )}
              </Link>

              <Link
                href="/support"
                className={clsx(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  pathname === "/support"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <HiSupport
                  className={clsx(
                    "h-5 w-5 transition-all duration-200",
                    pathname === "/support"
                      ? "text-white"
                      : "text-gray-500 group-hover:scale-110 group-hover:text-white"
                  )}
                />
                {!isCollapsed && <span>Support</span>}
                {isCollapsed && (
                  <div className="invisible absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    Support
                  </div>
                )}
              </Link>
            </div>

            {!isCollapsed && (
              <div className="mx-3 mt-4 rounded-xl bg-gradient-to-r from-background-soft to-background-base p-3 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-sm font-semibold text-white">
                      A
                    </div>
                    <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">
                      admin@matchnexus.com
                    </p>
                  </div>
                  <button className="rounded-lg p-1 transition-colors hover:bg-gray-200">
                    <HiLogout className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg lg:hidden"
      >
        <HiMenu className="h-5 w-5" />
      </button>
    </>
  );
}