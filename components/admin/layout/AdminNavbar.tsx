"use client";

import { Button } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import { HiBell, HiSearch, HiMenu, HiLogout } from "react-icons/hi";
import { useState } from "react";

export function AdminNavbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications data
  const notifications = [
    { id: 1, text: "New student registration", time: "5 min ago", type: "success" },
    { id: 2, text: "Company verification pending", time: "1 hour ago", type: "warning" },
    { id: 3, text: "System update completed", time: "3 hours ago", type: "info" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HiMenu className="h-5 w-5 text-gray-600" />
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
                  ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50 ring-2 ring-blue-100' 
                  : 'border-gray-200 bg-gray-50/80 hover:bg-white hover:border-gray-300'
                }
              `}>
                <HiSearch className={`
                  h-5 w-5 transition-colors duration-200
                  ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}
                `} />
                <input
                  type="text"
                  placeholder="Search students, companies, posts..."
                  className="w-full border-none bg-transparent p-0 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {isSearchFocused && (
                  <kbd className="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <HiBell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Dropdown Menu */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-500 mt-0.5">You have 3 new updates</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              w-2 h-2 mt-2 rounded-full flex-shrink-0
                              ${notif.type === 'success' ? 'bg-green-500' : 
                                notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}
                            `} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{notif.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50">
                      <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enhanced User Profile Card */}
            <div className="group relative">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-1.5 bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white shadow-md">
                    A
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    System Control
                  </p>
                </div>
              </div>

              {/* Quick Actions Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <HiBell className="h-4 w-4" />
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                  <HiLogout className="h-4 w-4" />
                  Logout
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