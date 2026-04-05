"use client";

import { Badge, Card, Button } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiBriefcase,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiLightningBolt,
} from "react-icons/hi";
import { useSession } from "next-auth/react";

type Props = { params: { id: string } };

export default function JobDetailsPage({ params }: Props) {
  const { data: session } = useSession();
  const [job, setJob] = useState<any>(null);
  console.log(session?.user?.id);

  const handleApply = async () => {
    try {
      const res = await fetch("/api/student/apply", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: params.id,
          coverLetter: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Apply failed");
        return;
      }

      toast.success("Applied Successfully!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJob();
  }, [params.id]);

  if (!job) return <p className="text-center mt-10">Loading...</p>;

  // Parse newline-separated strings into arrays
  const techStackItems: string[] = job.techStack
    ? job.techStack.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const keyRequirementItems: string[] = job.keyRequirements
    ? job.keyRequirements.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const responsibilityItems: string[] = job.responsibilities
    ? job.responsibilities.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#F4F7FA] py-10 px-4 md:px-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation - Back Button */}
        <Link
          href="/auth/student/jobs"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all w-max group"
        >
          <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back to Explorations
        </Link>

        {/* Header Section Card */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-[1.5rem] text-white shadow-lg shadow-blue-100">
              <HiBriefcase size={36} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                  {job.title}
                </h1>
                <Badge
                  color="info"
                  className="px-3 py-1 rounded-full uppercase text-[9px] font-black tracking-widest bg-blue-50 text-blue-600 border-none"
                >
                  {job.workType || "Internship"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <HiLightningBolt className="text-yellow-400" />
                  {job.company?.companyName}
                </span>

                <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>

                <span className="flex items-center gap-1.5">
                  <HiLocationMarker /> {job.location || "Remote"}
                </span>

                <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>

                <span className="flex items-center gap-1.5">
                  <HiClock /> {job.durationMonths} Months
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-4">
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
                    Role Overview
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {job.description}
                  </p>
                </div>

                {/* Responsibilities — dynamic */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#87D01A] rounded-full"></span>
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {responsibilityItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-600 text-sm font-medium"
                      >
                        <HiCheckCircle
                          className="text-blue-500 mt-0.5 flex-shrink-0"
                          size={18}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Requirements — dynamic */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#87D01A] rounded-full"></span>
                    Key Requirements
                  </h3>
                  <ul className="space-y-3">
                    {keyRequirementItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-600 text-sm font-medium"
                      >
                        <HiCheckCircle
                          className="text-blue-500 mt-0.5 flex-shrink-0"
                          size={18}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden p-2">
              <div className="p-4 space-y-6">
                {/* Tech Stack — dynamic */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techStackItems.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply */}
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleApply}
                    className="w-full bg-sky-600 enabled:hover:bg-sky-700 rounded-xl font-bold py-2 shadow-lg shadow-sky-100 border-none uppercase tracking-widest text-xs"
                  >
                    Apply
                  </Button>

                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Hurry!{" "}
                    {Math.ceil(
                      (new Date(job.applicationDeadline).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days left
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}