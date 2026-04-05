"use client";

import { Badge, Card, Pagination } from "flowbite-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Added for consistent animations
import {
  HiSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiCheckCircle,
  HiAcademicCap,
  HiLightningBolt,
} from "react-icons/hi";

type RecommendationRow = {
  id: string;
  title: string;
  companyName: string;
  location: string | null;
  workType: string | null;
  applicationDeadline: string;
  score: number;
  qualified: boolean;
  rank: number;
  matchedRequiredSkills: string[];
  matchedOptionalSkills: string[];
  missingRequiredSkills: string[];
  missingOptionalSkills: string[];
  reason: string;
  resumeSkills: string[];
};

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<RecommendationRow[]>([]);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/student/recommendations");
        const data = await res.json();

        if (!res.ok) {
          setAllJobs([]);
          setMessage(data.message || "Failed to load recommendations");
          return;
        }

        setAllJobs(data.exactMatches || []);
        setResumeSkills(data.resumeSkills || []);
        setMessage(
          data.exactMatches?.length
            ? null
            : "No exact job matches found from your current CV. Update your CV or profile skills to improve your score."
        );
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setMessage("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const onPageChange = (page: number) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const selectedJobs = allJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-white pb-10 font-sans -mx-4 -mt-6">
      {/* --- Search Section (Hero) --- */}
      <section className="relative bg-sky-700 py-20 px-6 text-center overflow-hidden">
        {/* Subtle Background pattern to match Home Hero overlay depth */}
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
            Discover exact-match internships scored directly from your uploaded CV and profile.
          </p>

          <div className="mx-auto mb-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/90">
            <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <span className="font-bold">Exact matches only</span>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <span className="font-bold">CV skills detected:</span> {resumeSkills.length}
            </div>
          </div>

          <div className="mx-auto flex flex-col items-center gap-3 rounded-2xl bg-white p-3 shadow-xl md:flex-row max-w-5xl">
            <div className="flex w-full items-center px-4 md:w-2/4">
              <HiSearch className="text-xl text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                className="w-full border-none focus:ring-0 text-gray-700 text-sm placeholder:text-gray-400"
              />
            </div>
            
            <div className="hidden h-8 w-px bg-gray-200 md:block"></div>
            
            <div className="flex w-full items-center px-4 md:w-1/4">
              <HiOutlineBriefcase className="mr-2 text-xl text-gray-400" />
              <select className="w-full border-none bg-transparent focus:ring-0 text-gray-600 text-sm font-semibold">
                <option>All Categories</option>
                <option>Computing</option>
                <option>Business</option>
                <option>Engineering</option>
              </select>
            </div>

            <button className="w-full rounded-xl bg-lime-500 px-8 py-3 text-sm font-extrabold text-white transition-all hover:bg-lime-400 md:w-auto shadow-lg">
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* --- Jobs Grid --- */}
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Best <span className="text-sky-600">Job Matches</span>
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              {loading
                ? "Analyzing your CV and scoring jobs..."
                : `Showing ${selectedJobs.length} of ${allJobs.length} exact matches`}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            {message}
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {selectedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="group border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-5">
                    <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                      <HiOutlineBriefcase className="text-2xl" />
                    </div>

                    <Badge
                      className="rounded-full px-3 py-1 font-bold text-[10px] bg-lime-100 text-lime-700 border border-lime-200 uppercase"
                    >
                      {job.workType || "Internship"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors leading-tight mb-2">
                    {job.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                      {job.companyName || "Verified Company"}
                    </p>

                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                      <HiOutlineLocationMarker className="text-sky-500 text-lg" />
                      {job.location || "Remote"}
                    </p>
                  </div>

                  <div className="mb-5 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          Match Score
                        </p>
                        <p className="text-2xl font-black text-sky-700">
                          {job.score.toFixed(1)}%
                        </p>
                      </div>

                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                        Qualified
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                      <HiCheckCircle className="mt-0.5 text-emerald-600" />
                      <span>{job.reason}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-50 flex justify-end">
                    <a href={`/auth/student/jobs/${job.id}`} className="w-full sm:w-auto">
                      <button className="w-full rounded-lg bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-sm uppercase tracking-wider">
                        Review Job
                      </button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {allJobs.length > jobsPerPage && (
          <div className="mt-20 flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(allJobs.length / jobsPerPage)}
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