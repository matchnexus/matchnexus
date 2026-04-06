"use client";

import { Badge, Card, Pagination } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  HiSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
} from "react-icons/hi";

type JobRow = {
  id: string;
  title: string;
  location: string | null;
  workType: string | null;
  category: string | null;
  company?: {
    companyName?: string;
  } | null;
};

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs");
        const data = await res.json();

        if (!res.ok) {
          setJobs([]);
          setMessage(data.message || "Failed to load jobs");
          return;
        }

        setJobs(Array.isArray(data) ? data : []);
        setMessage(null);
      } catch (error) {
        console.error("Failed to load jobs", error);
        setJobs([]);
        setMessage("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return jobs.filter((job) => {
      const companyName = job.company?.companyName?.toLowerCase() || "";
      const title = job.title.toLowerCase();
      const location = (job.location || "").toLowerCase();
      const workType = (job.workType || "").toLowerCase();
      const category = (job.category || "").toLowerCase();

      const matchesQuery =
        !query ||
        title.includes(query) ||
        companyName.includes(query) ||
        location.includes(query) ||
        workType.includes(query) ||
        category.includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase();

      const matchesLocation =
        selectedLocation === "All" ||
        location.includes(selectedLocation.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [jobs, searchText, selectedCategory, selectedLocation]);

  const locations = useMemo(() => {
    const unique = new Set<string>();
    jobs.forEach((job) => {
      if (job.location?.trim()) unique.add(job.location.trim());
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [jobs]);

  const heroImages = [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const startIndex = (currentPage - 1) * jobsPerPage;
  const selectedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 font-sans">
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-16 text-center shadow-inner overflow-hidden">
        {/* Carousel background */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: currentSlide === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-blue-900/60" />

        {/* Existing content — unchanged */}
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="mb-3 text-4xl font-black uppercase tracking-tight text-white">
            Explore All Internships
          </h1>
          <p className="mb-10 text-lg font-medium text-blue-100">
            Browse every active job post published by verified companies.
          </p>

          <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-3 shadow-2xl md:flex-row md:rounded-full">
            <div className="flex w-full items-center px-5 md:w-3/5">
              <HiSearch className="text-2xl text-gray-400" />
              <input
                type="text"
                placeholder="Job title, company, keyword..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="w-full border-none text-lg font-medium text-gray-700 placeholder:text-gray-300 focus:ring-0"
              />
            </div>

            <div className="hidden h-10 w-px bg-gray-200 md:block"></div>

            <div className="flex w-full items-center px-5 md:w-1/5">
              <HiOutlineBriefcase className="mr-2 text-2xl text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full border-none bg-transparent text-xs font-bold uppercase text-gray-600 focus:ring-0"
              >
                <option value="All">All Categories</option>
                <option value="COMPUTING">Computing</option>
                <option value="BUSINESS">Business</option>
                <option value="ENGINEERING">Engineering</option>
              </select>
            </div>

            <div className="flex w-full items-center px-5 md:w-1/5">
              <HiOutlineLocationMarker className="mr-2 text-2xl text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                className="w-full border-none bg-transparent text-xs font-bold uppercase text-gray-600 focus:ring-0"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between border-b pb-4">
          <div>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tighter text-slate-800">
              Latest Opportunities
            </h2>
            <p className="mt-1 text-sm font-bold uppercase text-gray-400">
              {loading
                ? "Loading jobs..."
                : `Showing ${selectedJobs.length} of ${filteredJobs.length} matching roles`}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            {message}
          </div>
        )}

        {!loading && selectedJobs.length === 0 && !message ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
            No jobs found for the selected filters.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {selectedJobs.map((job) => (
              <Card
                key={job.id}
                className="group rounded-[2rem] border-none bg-white p-2 shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-2xl bg-blue-50 p-3">
                        <HiOutlineBriefcase className="text-2xl text-blue-600" />
                      </div>
                      <Badge
                        color="success"
                        className="rounded-full px-3 py-1 text-[10px] font-black uppercase"
                      >
                        {job.workType || "Internship"}
                      </Badge>
                    </div>

                    <h3 className="leading-tight text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {job.title}
                    </h3>

                    <div className="mt-3 flex flex-col gap-1">
                      <p className="text-sm font-black uppercase tracking-wider text-slate-400">
                        {job.company?.companyName || "Verified Company"}
                      </p>
                      <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                        <HiOutlineLocationMarker className="text-lg text-blue-500" />
                        {job.location || "Remote"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
                    <Badge
                      color="info"
                      className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase"
                    >
                      {job.category || "UNCATEGORIZED"}
                    </Badge>
                    <Link href={`/auth/student/jobs/${job.id}`}>
                      <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-blue-600">
                        View Job
                      </button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(
              1,
              Math.ceil(filteredJobs.length / jobsPerPage),
            )}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
            className="font-bold"
          />
        </div>
      </div>
    </div>
  );
}
