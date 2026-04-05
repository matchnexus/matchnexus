"use client";

import { Badge, Card, Spinner } from "flowbite-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RankedApplicant = {
  applicationId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  overallScore: number;
  requiredSkillsScore: number;
  optionalSkillsScore: number;
  educationScore: number;
  experienceScore: number;
  rankPosition: number;
  isRecommended: boolean;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  reason: string;
  cvSkills: string[];
};

type RankedPost = {
  id: string;
  postId: string;
  postTitle: string;
  companyName: string;
  applicants: RankedApplicant[];
};

function ApplicantRow({ applicant }: { applicant: RankedApplicant }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/company/student/${applicant.studentId}`}>
              <h4 className="text-base font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition">
                {applicant.rankPosition}. {applicant.firstName} {applicant.lastName}
              </h4>
            </Link>
            <Badge color={applicant.isRecommended ? "success" : "warning"}>
              {applicant.isRecommended ? "Best Match" : "Near Match"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{applicant.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
            <p className="font-bold text-slate-500">Score</p>
            <p className="text-base font-black text-blue-700">{applicant.overallScore.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
            <p className="font-bold text-slate-500">Required</p>
            <p className="text-base font-black text-emerald-700">{applicant.requiredSkillsScore.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
            <p className="font-bold text-slate-500">Optional</p>
            <p className="text-base font-black text-amber-700">{applicant.optionalSkillsScore.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
            <p className="font-bold text-slate-500">Exp</p>
            <p className="text-base font-black text-slate-800">{applicant.experienceScore.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostRankingCard({ post }: { post: RankedPost }) {
  const bestApplicant = post.applicants[0];

  return (
    <Card className="border-0 bg-white/80 shadow-md backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Job Post</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{post.postTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{post.companyName}</p>
        </div>

        {bestApplicant ? (
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Top Applicant</p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {bestApplicant.firstName} {bestApplicant.lastName}
            </p>
            <p className="text-sm font-semibold text-blue-700">
              {bestApplicant.overallScore.toFixed(1)}% match
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        {post.applicants.map((applicant) => (
          <ApplicantRow key={applicant.applicationId} applicant={applicant} />
        ))}
      </div>
    </Card>
  );
}

export default function CompanyApplicationsPage() {
  const [companyId, setCompanyId] = useState("");
  const [posts, setPosts] = useState<RankedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId") || "");
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const loadRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/company/analytics?companyId=${companyId}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          setPosts([]);
          setMessage(data.error || "Failed to load application rankings");
          return;
        }

        setPosts((data.rankings || []) as RankedPost[]);
        setMessage(null);
      } catch (error) {
        console.error("Failed to load company application rankings", error);
        setPosts([]);
        setMessage("Failed to load application rankings");
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [companyId]);

  const totals = useMemo(() => {
    const postsCount = posts.length;
    const applicantsCount = posts.reduce((total, post) => total + post.applicants.length, 0);
    const bestMatches = posts.reduce((total, post) => total + (post.applicants[0]?.isRecommended ? 1 : 0), 0);
    return { postsCount, applicantsCount, bestMatches };
  }, [posts]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">Applications</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ranked applicants are computed from the uploaded CV, profile skills, and post requirements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Posts Ranked", value: totals.postsCount, color: "info" as const },
          { label: "Total Applicants", value: totals.applicantsCount, color: "success" as const },
          { label: "Best Matches", value: totals.bestMatches, color: "purple" as const },
        ].map((item) => (
          <Card key={item.label} className="border-0 bg-white/80 shadow-md backdrop-blur">
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-600">{item.label}</p>
              <Badge color={item.color}>{item.label}</Badge>
            </div>
            <h2 className="mt-2 text-4xl font-black text-slate-800">{item.value}</h2>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/80 p-8 text-slate-600 shadow-sm backdrop-blur-sm">
          <Spinner size="md" />
          <span>Loading ranked applicants...</span>
        </div>
      ) : message ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {message}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500 shadow-sm backdrop-blur-sm">
          No applications ranked yet.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostRankingCard key={post.postId} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}