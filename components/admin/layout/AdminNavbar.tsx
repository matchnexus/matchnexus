"use client";

import { Button } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import { HiBell, HiSearch } from "react-icons/hi";

export function AdminNavbar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <HiSearch className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, companies, posts..."
              className="w-full border-none bg-transparent p-0 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400"
            />
          </div>

          <div className="ml-4 flex items-center gap-3">
            <Button color="light" pill>
              <HiBell className="mr-2 h-4 w-4" />
              Alerts
            </Button>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">System Control</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Toaster position="top-right" />
    </>
  );
}