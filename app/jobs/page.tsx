"use client";

import { Badge, Card, Pagination } from "flowbite-react";
import { useState } from "react";
import Link from "next/link";
import {
  HiSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
} from "react-icons/hi";
import { useSession } from "next-auth/react";

// --- Dummy Data (Total 18 jobs for 2 pages) ---
const allJobs = Array.from({ length: 18 }, (_, i) => ({
  id: (i + 1).toString(),
  title: [
    "Frontend Intern (Next.js)",
    "Data Science Intern",
    "Cloud Support Intern",
    "UI/UX Designer",
    "Backend Developer",
    "Mobile App Intern",
    "DevOps Engineer",
    "QA Automation Intern",
    "Marketing Intern",
  ][i % 9],
  company: [
    "Acme Labs",
    "Zen Analytics",
    "Nimbus Cloud",
    "Tech Hive",
    "SoftVibe",
  ][i % 5],
  location: ["Remote", "Colombo", "Hybrid", "Kandy", "Galle"][i % 5],
  type: i % 2 === 0 ? "Internship" : "Full-time",
}));

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const { data: session } = useSession();

  console.log(session?.user.id);
  console.log(session?.user.role);

  // Pagination Logic
  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const selectedJobs = allJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 font-sans">
      {/* --- Search Section (Hero) --- */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-16 text-center shadow-inner">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-3 text-4xl font-black text-white tracking-tight uppercase">
            Find Your Dream Career
          </h1>
          <p className="mb-10 text-lg text-blue-100 font-medium">
            Explore the best internship opportunities curated for SLIIT
            students.
          </p>

          <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-3 shadow-2xl md:flex-row md:rounded-full">
            <div className="flex w-full items-center px-5 md:w-3/5">
              <HiSearch className="text-2xl text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                className="w-full border-none focus:ring-0 text-gray-700 font-medium text-lg placeholder:text-gray-300"
              />
            </div>
            <div className="hidden h-10 w-px bg-gray-200 md:block"></div>
            <div className="flex w-full items-center px-5 md:w-1/4">
              <HiOutlineBriefcase className="mr-2 text-2xl text-gray-400" />
              <select className="w-full border-none bg-transparent focus:ring-0 text-gray-600 font-bold uppercase text-xs">
                <option>All Categories</option>
                <option>Computing</option>
                <option>Business</option>
                <option>Engineering</option>
              </select>
            </div>
            <button className="w-full rounded-2xl bg-lime-500 px-10 py-4 font-black text-white transition-all hover:bg-lime-600 md:w-auto md:rounded-full shadow-lg shadow-lime-500/30">
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* --- Jobs Grid (Full Width) --- */}
      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between border-b pb-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              Latest Opportunities
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase mt-1">
              Showing {selectedJobs.length} of {allJobs.length} available roles
            </p>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {selectedJobs.map((job) => (
            <Card
              key={job.id}
              className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-white p-2"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <HiOutlineBriefcase className="text-2xl text-blue-600" />
                    </div>
                    <Badge
                      color="success"
                      className="rounded-full px-3 py-1 font-black uppercase text-[10px]"
                    >
                      {job.type}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <div className="mt-3 flex flex-col gap-1">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-wider">
                      {job.company}
                    </p>
                    <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                      <HiOutlineLocationMarker className="text-blue-500 text-lg" />{" "}
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end border-t border-gray-50 pt-5">
                  <Link href={`/jobs/${job.id}`}>
                    <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-[10px] font-black text-white hover:bg-blue-600 transition-all shadow-md uppercase tracking-wider">
                      Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="mt-16 flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(allJobs.length / jobsPerPage)}
            onPageChange={onPageChange}
            showIcons
            className="font-bold"
          />
        </div>
      </div>
    </div>
  );
}
