"use client";

import { Toaster } from "react-hot-toast";
import { HiBell, HiSearch, HiMenu, HiLogout, HiMoon, HiSun } from "react-icons/hi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type AdminNavbarProps = {
  onMenuClick?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
};

export function AdminNavbar({ onMenuClick, isDark = false, onToggleTheme }: AdminNavbarProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        toast.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred");
      setIsLoggingOut(false);
    }
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: "New student registration", time: "5 min ago", type: "success" },
    { id: 2, text: "Company verification pending", time: "1 hour ago", type: "warning" },
    { id: 3, text: "System update completed", time: "3 hours ago", type: "info" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl shadow-sm ${isDark ? "border-slate-700 bg-slate-900/80" : "border-gray-100 bg-background-base/80"}`}>
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button onClick={onMenuClick} className={`block rounded-lg p-2 transition-colors lg:hidden ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
            <HiMenu className={`h-5 w-5 ${isDark ? "text-slate-300" : "text-gray-600"}`} />
          </button>

          {/* Search Bar - Enhanced */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className={`
              relative transition-all duration-300
              ${isSearchFocused ? 'scale-105' : 'scale-100'}
            `}>
              <div className={`
                flex items-center gap-3 rounded-2xl border px-4 py-2.5
                transition-all duration-200
                ${isSearchFocused 
                  ? (isDark ? 'border-cyan-500 bg-slate-800 shadow-lg shadow-cyan-900/30 ring-2 ring-cyan-900/30' : 'border-blue-400 bg-white shadow-lg shadow-blue-100/50 ring-2 ring-blue-100')
                  : (isDark ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600' : 'border-gray-200 bg-gray-50/80 hover:bg-white hover:border-gray-300')
                }
              `}>
                <HiSearch className={`
                  h-5 w-5 transition-colors duration-200
                  ${isSearchFocused ? (isDark ? 'text-cyan-400' : 'text-blue-500') : (isDark ? 'text-slate-400' : 'text-gray-400')}
                `} />
                <input
                  type="text"
                  placeholder="Search students, companies, posts..."
                  className={`w-full border-none bg-transparent p-0 text-sm outline-none ring-0 ${isDark ? "text-slate-200 placeholder:text-slate-400" : "text-gray-700 placeholder:text-gray-400"}`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {isSearchFocused && (
                  <kbd className={`hidden rounded-md px-2 py-1 text-xs sm:block ${isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-400"}`}>
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className={`rounded-xl p-2 transition-all duration-200 ${isDark ? "bg-slate-800 text-yellow-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`group relative rounded-xl p-2 transition-all duration-200 ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
              >
                <HiBell className={`h-5 w-5 transition-colors ${isDark ? "text-slate-300 group-hover:text-cyan-300" : "text-gray-600 group-hover:text-blue-600"}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Dropdown Menu */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border z-50 animate-in slide-in-from-top-2 duration-200 ${isDark ? "border-slate-700 bg-slate-900 shadow-2xl shadow-black/40" : "border-gray-100 bg-white shadow-xl"}`}>
                    <div className={`border-b px-4 py-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-background-soft"}`}>
                      <h3 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Notifications</h3>
                      <p className={`mt-0.5 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>You have 3 new updates</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`cursor-pointer border-b px-4 py-3 transition-colors ${isDark ? "border-slate-800 hover:bg-slate-800" : "border-gray-50 hover:bg-gray-50"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              w-2 h-2 mt-2 rounded-full flex-shrink-0
                              ${notif.type === 'success' ? 'bg-green-500' : 
                                notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}
                            `} />
                            <div className="flex-1">
                              <p className={`text-sm ${isDark ? "text-slate-200" : "text-gray-700"}`}>{notif.text}</p>
                              <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-gray-400"}`}>{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={isDark ? "bg-slate-800 px-4 py-2" : "bg-gray-50 px-4 py-2"}>
                      <button className={`w-full text-center text-xs font-medium ${isDark ? "text-cyan-300 hover:text-cyan-200" : "text-blue-600 hover:text-blue-700"}`}>
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enhanced User Profile Card */}
            <div className="group relative">
              <div className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-1.5 transition-all duration-300 hover:shadow-md ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"}`}>
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white shadow-md">
                    A
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Admin User</p>
                  <p className={`flex items-center gap-1 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    System Control
                  </p>
                </div>
              </div>

              {/* Quick Actions Dropdown */}
              <div className={`absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border opacity-0 invisible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 group-hover:opacity-100 group-hover:visible ${isDark ? "border-slate-700 bg-slate-900 shadow-lg shadow-black/40" : "border-gray-100 bg-white shadow-lg"}`}>
                <button className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm ${isDark ? "text-slate-200 hover:bg-slate-800" : "text-gray-700 hover:bg-gray-50"}`}>
                  <HiBell className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`flex w-full items-center gap-2 border-t px-4 py-2 text-left text-sm text-red-600 disabled:opacity-50 ${isDark ? "border-slate-700 hover:bg-red-950/30" : "border-gray-100 hover:bg-red-50"}`}
                >
                  <HiLogout className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}