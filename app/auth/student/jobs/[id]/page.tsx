"use client";

import { Badge, Card, Button } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiBriefcase,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiLightningBolt,
} from "react-icons/hi";

type Props = { params: { id: string } };
const handelApply = () => {
  toast.success("Apply Success!");
};

export default function JobDetailsPage({ params }: Props) {
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
                  Sample Internship Role
                </h1>
                <Badge
                  color="info"
                  className="px-3 py-1 rounded-full uppercase text-[9px] font-black tracking-widest bg-blue-50 text-blue-600 border-none"
                >
                  Internship
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <HiLightningBolt className="text-yellow-400" /> Acme Labs
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
                <span className="flex items-center gap-1.5">
                  <HiLocationMarker /> Remote / Colombo
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
                <span className="flex items-center gap-1.5">
                  <HiClock /> Full-time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description (Left Side) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-4">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-blue-500 rounded-full"></span>{" "}
                    Role Overview
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    We are seeking a highly motivated and detail-oriented
                    Software Engineering Intern to join our dynamic team. In
                    this role, you will collaborate with senior developers to
                    build and scale modern web applications using cutting-edge
                    technologies.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#87D01A] rounded-full"></span>{" "}
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Collaborate with cross-functional teams to define and design new features.",
                      "Write clean, maintainable, and efficient code.",
                      "Assist in troubleshooting and resolving software defects.",
                      "Participate in code reviews and team meetings.",
                    ].map((item, index) => (
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

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#87D01A] rounded-full"></span>{" "}
                    Key Requirements
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Collaborate with cross-functional teams to define and design new features.",
                      "Write clean, maintainable, and efficient code.",
                      "Assist in troubleshooting and resolving software defects.",
                      "Participate in code reviews and team meetings.",
                    ].map((item, index) => (
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

          {/* Requirements & Action (Right Side) */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden p-2">
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Tailwind", "Git"].map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {/* <Link href="/auth/login" className="block">
                    <Button className="w-full bg-blue-600 enabled:hover:bg-blue-700 rounded-xl font-bold py-2 shadow-lg shadow-blue-100 border-none uppercase tracking-widest text-xs">
                      Sign In to Apply
                    </Button>
                  </Link> */}
                  <Button
                    onClick={handelApply}
                    className="w-full bg-blue-600 enabled:hover:bg-blue-700 rounded-xl font-bold py-2 shadow-lg shadow-blue-100 border-none uppercase tracking-widest text-xs"
                  >
                    Apply
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Hurry! 3 days left
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
