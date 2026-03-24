"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type DashboardSkill = {
  id: string;
  skillName: string;
};

type DashboardPost = {
  id: string;
  title: string;
  status: string;
  applicationsCount?: number;
  applicationDeadline: string;
  workType?: string | null;
  location?: string | null;
  durationMonths?: number | null;
  stipendAmount?: string | number | null;
  description?: string | null;
  responsibilities?: string | null;
  requiredSkills: DashboardSkill[];
  optionalSkills: DashboardSkill[];
};

export default function CompanyDashboardPage() {
  const searchParams = useSearchParams();
  const publishedPostId = searchParams.get("published") || "";
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("companyName") || "";
    const storedCompanyId = localStorage.getItem("companyId") || "";

    setCompanyName(storedName);
    setCompanyId(storedCompanyId);
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch(`/api/company/posts?companyId=${companyId}`);
        const data = await res.json();

        if (!res.ok) {
          setPosts([]);
          return;
        }

        setPosts((data.posts || []) as DashboardPost[]);
      } catch {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [companyId]);

  const heading = companyName ? `Welcome, ${companyName}` : "Welcome";
  const activePosts = posts.filter((post) => post.status === "ACTIVE");
  const totalPosts = posts.length;
  const totalApplications = posts.reduce(
    (total, post) => total + (post.applicationsCount || 0),
    0
  );
  const averageApplicationsPerPost =
    totalPosts > 0 ? (totalApplications / totalPosts).toFixed(1) : "0.0";
  const statCards = [
    {
      title: "Total Posts",
      value: loadingPosts ? "..." : String(totalPosts),
      subtitle: "All internship posts created by your company.",
      cardClass: "border-slate-600 bg-slate-950 text-white",
      glowClass: "from-rose-600/35 via-rose-500/10 to-transparent",
    },
    {
      title: "Total Applications",
      value: loadingPosts ? "..." : String(totalApplications),
      subtitle: `Avg. ${loadingPosts ? "..." : averageApplicationsPerPost} applications per post.`,
      cardClass: "border-slate-600 bg-slate-950 text-white",
      glowClass: "from-blue-500/30 via-sky-500/10 to-transparent",
    },
    {
      title: "Active Posts",
      value: loadingPosts ? "..." : String(activePosts.length),
      subtitle: "Currently visible posts open for candidates.",
      cardClass: "border-slate-600 bg-slate-950 text-white",
      glowClass: "from-emerald-500/30 via-emerald-400/10 to-transparent",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-700/60 p-4 md:p-6">
      <Image
        src="/photos/cccc.jpg"
        alt="Dashboard background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/75 to-slate-950/85" />

      <div className="relative z-10 space-y-6">
        <div className="rounded-2xl border border-white/15 bg-slate-900/45 p-6 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-extrabold text-white md:text-3xl">{heading}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
            Manage company profile, publish internship opportunities, and track your hiring pipeline from one place.
          </p>
        </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${card.cardClass}`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glowClass}`} />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                  {card.title}
                </p>
                <p className="mt-2 text-4xl font-extrabold leading-none text-white">{card.value}</p>
              </div>
            </div>

            <p className="relative mt-4 text-xs text-slate-400">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/15 bg-slate-900/45 p-5 shadow-sm backdrop-blur-sm md:p-6">

        {publishedPostId && (
          <p className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800">
            Post published successfully.
          </p>
        )}

        {loadingPosts && (
          <p className="text-sm text-gray-500">Loading published posts...</p>
        )}

        {!loadingPosts && activePosts.length === 0 && (
          <p className="text-sm text-gray-600">No published posts yet. Publish posts from the posts page to see them here.</p>
        )}

        {!loadingPosts && activePosts.length > 0 && (
          <div className="space-y-2">
            {activePosts.map((post) => (
              <details
                key={post.id}
                open={post.id === publishedPostId}
                className={`rounded-xl border-2 border-black p-4 shadow-sm transition hover:shadow-md ${
                  post.id === publishedPostId
                    ? "bg-amber-50 ring-2 ring-amber-300/80"
                    : "bg-white/80"
                }`}
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-indigo-800">{post.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </summary>

                <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                  <p>
                    <span className="font-semibold text-gray-900">Location:</span>{" "}
                    {post.location || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Work Type:</span>{" "}
                    {post.workType || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Duration:</span>{" "}
                    {post.durationMonths ? `${post.durationMonths} months` : "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Stipend:</span>{" "}
                    {post.stipendAmount ?? "Not specified"}
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                  <p className="text-sm font-semibold text-gray-900">Description</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {post.description || "No description provided."}
                  </p>
                </div>

                {post.responsibilities && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                    <p className="text-sm font-semibold text-gray-900">Responsibilities</p>
                    <p className="mt-1 text-sm text-gray-700">{post.responsibilities}</p>
                  </div>
                )}

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Required Skills</p>
                    <div className="mt-2 flex min-h-8 flex-wrap gap-2">
                      {post.requiredSkills.length > 0 ? (
                        post.requiredSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                          >
                            {skill.skillName}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No required skills</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">Optional Skills</p>
                    <div className="mt-2 flex min-h-8 flex-wrap gap-2">
                      {post.optionalSkills.length > 0 ? (
                        post.optionalSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800"
                          >
                            {skill.skillName}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No optional skills</p>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}