"use client";

import { Badge, Card, Pagination } from "flowbite-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiSparkles,
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

type RecommendationPayload = {
  resumeSkills?: string[];
  exactMatches?: RecommendationRow[];
  nearMatches?: RecommendationRow[];
  message?: string;
};

const ITEMS_PER_PAGE = 6;

function JobCard({ job, exact }: { job: RecommendationRow; exact: boolean }) {
  const daysLeft = Math.ceil(
    (new Date(job.applicationDeadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="rounded-2xl border-none bg-white p-2 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <HiOutlineBriefcase className="text-2xl" />
          </div>
          <Badge color={exact ? "success" : "warning"} className="uppercase">
            {exact ? "Exact Match" : "Near Match"}
          </Badge>
        </div>

        <h3 className="text-lg font-extrabold text-gray-900">{job.title}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
          {job.companyName}
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <HiOutlineLocationMarker className="text-blue-500" />
          {job.location || "Remote"}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ML Score
          </p>
          <p className="text-2xl font-black text-blue-700">{job.score.toFixed(1)}%</p>
          <p className="mt-1 text-xs text-slate-600">{job.reason}</p>
        </div>

        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Matched Skills
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...job.matchedRequiredSkills, ...job.matchedOptionalSkills]
              .slice(0, 6)
              .map((skill) => (
                <span
                  key={`${job.id}-${skill}`}
                  className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {job.missingRequiredSkills.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Missing Required
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.missingRequiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={`${job.id}-missing-${skill}`}
                  className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {daysLeft > 0 ? `${daysLeft} days left` : "Deadline reached"}
          </p>
          <Link href={`/auth/student/jobs/${job.id}`}>
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-blue-600">
              View Job
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default function StudentSuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [exactMatches, setExactMatches] = useState<RecommendationRow[]>([]);
  const [nearMatches, setNearMatches] = useState<RecommendationRow[]>([]);
  const [exactPage, setExactPage] = useState(1);
  const [nearPage, setNearPage] = useState(1);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/student/recommendations", {
          credentials: "include",
          cache: "no-store",
        });

        const data: RecommendationPayload = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to analyze CV and generate suggestions.");
          setExactMatches([]);
          setNearMatches([]);
          return;
        }

        setResumeSkills(data.resumeSkills || []);
        setExactMatches(data.exactMatches || []);
        setNearMatches(data.nearMatches || []);

        if (!(data.exactMatches?.length || data.nearMatches?.length)) {
          setMessage("No suggestions yet. Upload CV and add skills in profile to improve matching.");
        } else {
          setMessage(null);
        }
      } catch (error) {
        console.error("Failed to load ML suggestions", error);
        setMessage("Failed to analyze CV and generate suggestions.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const visibleExact = useMemo(() => {
    const start = (exactPage - 1) * ITEMS_PER_PAGE;
    return exactMatches.slice(start, start + ITEMS_PER_PAGE);
  }, [exactMatches, exactPage]);

  const visibleNear = useMemo(() => {
    const start = (nearPage - 1) * ITEMS_PER_PAGE;
    return nearMatches.slice(start, start + ITEMS_PER_PAGE);
  }, [nearMatches, nearPage]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      <section className="bg-gradient-to-r from-sky-700 to-indigo-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
                CV Skill Analyzer
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
                Personalized job suggestions based on your actual CV skills and profile data.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <span className="font-bold">Detected CV Skills:</span> {resumeSkills.length}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {resumeSkills.slice(0, 20).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
            {!resumeSkills.length && !loading && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                No CV skills detected yet
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-7xl space-y-8 px-6">
        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            <HiExclamationCircle />
            <span>{message}</span>
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-blue-100 bg-white p-6 text-sm font-semibold text-slate-600">
            Analyzing CV and ranking jobs...
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-800">
              Exact Matches ({exactMatches.length})
            </h2>
          </div>

          {!loading && visibleExact.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
              No exact matches yet.
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleExact.map((job) => (
                  <JobCard key={job.id} job={job} exact />
                ))}
              </div>
              {exactMatches.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={exactPage}
                    totalPages={Math.ceil(exactMatches.length / ITEMS_PER_PAGE)}
                    onPageChange={setExactPage}
                    showIcons
                  />
                </div>
              )}
            </>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-amber-600" />
            <h2 className="text-xl font-extrabold text-slate-800">
              Near Matches ({nearMatches.length})
            </h2>
          </div>

          {!loading && visibleNear.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
              No near matches at this moment.
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleNear.map((job) => (
                  <JobCard key={job.id} job={job} exact={false} />
                ))}
              </div>
              {nearMatches.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={nearPage}
                    totalPages={Math.ceil(nearMatches.length / ITEMS_PER_PAGE)}
                    onPageChange={setNearPage}
                    showIcons
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
