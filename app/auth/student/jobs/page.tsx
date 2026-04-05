"use client";

import { Badge, Card, Pagination } from "flowbite-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
} from "react-icons/hi";

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // 1. Input fields වල අගයන් තියාගන්න states
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("All Categories");

  // 2. Button එක click කළාම filter වෙන්න ඕන අගයන් තියාගන්න states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setAllJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, []);

  // 3. Search Button Click function එක
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setFilterCategory(categoryInput);
    setCurrentPage(1); // මුල් පිටුවට reset කිරීම
  };

  // 4. Filter Logic (දැන් වැඩ කරන්නේ searchQuery සහ filterCategory මතයි)
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.company?.companyName && job.company.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        filterCategory === "All Categories" || 
        job.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allJobs, searchQuery, filterCategory]);

  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const selectedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-white pb-10 font-sans -mx-4 -mt-6">
      <section className="relative bg-sky-700 py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-50" />
        
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold text-white md:text-5xl tracking-tight"
          >
            Find Your Dream Career
          </motion.h1>
          <p className="mb-10 text-lg text-white/90 font-medium max-w-2xl mx-auto">
            Discover smart ML-powered internship opportunities curated for your success.
          </p>

          <div className="mx-auto flex flex-col items-center gap-3 rounded-2xl bg-white p-3 shadow-xl md:flex-row max-w-5xl">
            <div className="flex w-full items-center px-4 md:w-2/4">
              <HiSearch className="text-xl text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border-none focus:ring-0 text-gray-700 text-sm placeholder:text-gray-400"
              />
            </div>
            
            <div className="hidden h-8 w-px bg-gray-200 md:block"></div>
            
            <div className="flex w-full items-center px-4 md:w-1/4">
              <HiOutlineBriefcase className="mr-2 text-xl text-gray-400" />
              <select 
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full border-none bg-transparent focus:ring-0 text-gray-600 text-sm font-semibold"
              >
                <option value="All Categories">All Categories</option>
                <option value="COMPUTING">COMPUTING</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="ENGINEERING">ENGINEERING</option>
              </select>
            </div>

            {/* 5. Button එකට onClick එක එකතු කිරීම */}
            <button 
              onClick={handleSearch}
              className="w-full rounded-xl bg-lime-500 px-8 py-3 text-sm font-extrabold text-white transition-all hover:bg-lime-400 md:w-auto shadow-lg"
            >
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* Grid සහ Pagination පෙර පරිදිම... */}
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Latest <span className="text-sky-600">Opportunities</span>
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Showing {selectedJobs.length} of {filteredJobs.length} available roles
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {selectedJobs.length > 0 ? (
            selectedJobs.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="group border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                        <HiOutlineBriefcase className="text-2xl" />
                      </div>
                      <Badge className="rounded-full px-3 py-1 font-bold text-[10px] bg-lime-100 text-lime-700 border border-lime-200 uppercase">
                        {job.workType || "Internship"}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors leading-tight mb-2">
                      {job.title}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                        {job.company?.companyName || "Verified Company"}
                      </p>
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <HiOutlineLocationMarker className="text-sky-500 text-lg" />
                        {job.location || "Remote"}
                      </p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-gray-50 flex justify-end">
                      <Link href={`/auth/student/jobs/${job.id}`} className="w-full sm:w-auto">
                        <button className="w-full rounded-lg bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-sm uppercase tracking-wider">
                          Apply Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold uppercase">No matching jobs found.</p>
            </div>
          )}
        </div>

        {filteredJobs.length > jobsPerPage && (
          <div className="mt-20 flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredJobs.length / jobsPerPage)}
              onPageChange={onPageChange}
              showIcons
              className="font-semibold text-sky-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}