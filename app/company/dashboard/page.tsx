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
      cardClass: "border-rose-300 bg-rose-50",
      glowClass: "from-rose-300/45 via-rose-200/25 to-transparent",
    },
    {
      title: "Total Applications",
      value: loadingPosts ? "..." : String(totalApplications),
      subtitle: `Avg. ${
        loadingPosts ? "..." : averageApplicationsPerPost
      } applications per post.`,
      cardClass: "border-blue-300 bg-blue-50",
      glowClass: "from-blue-300/45 via-sky-200/25 to-transparent",
    },
    {
      title: "Active Posts",
      value: loadingPosts ? "..." : String(activePosts.length),
      subtitle: "Currently visible posts open for candidates.",
      cardClass: "border-emerald-300 bg-emerald-50",
      glowClass: "from-emerald-300/45 via-emerald-200/25 to-transparent",
    },
  ];

  return (
    <section className="space-y-8 px-2 md:px-4">
      <div className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-md transition hover:shadow-lg">
        <div className="relative h-56 w-full md:h-72">
          <Image
            src="/photos/cccc.jpg"
            alt="Office background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/65 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
            <h1 className="text-2xl font-extrabold md:text-4xl">{heading}</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
              Manage company profile, publish internship opportunities, and
              track your hiring pipeline from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl border p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl ${card.cardClass}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glowClass}`}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {card.title}
                </p>
                <p className="mt-3 text-4xl font-extrabold leading-none text-slate-900">
                  {card.value}
                </p>
              </div>
            </div>

            <p className="relative mt-4 text-sm text-slate-600">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-md md:p-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Published Posts</h2>
          <p className="mt-1 text-sm text-slate-500">
            View active internship posts and their important details.
          </p>
        </div>

        {publishedPostId && (
          <p className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">
            Post published successfully.
          </p>
        )}

        {loadingPosts && (
          <p className="text-sm text-gray-500">Loading published posts...</p>
        )}

        {!loadingPosts && activePosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-600">
              No published posts yet. Publish posts from the posts page to see
              them here.
            </p>
          </div>
        )}

        {!loadingPosts && activePosts.length > 0 && (
          <div className="space-y-4">
            {activePosts.map((post) => (
              <div
                key={post.id}
                className={`rounded-2xl border p-5 shadow-md transition hover:border-blue-300 hover:shadow-xl ${
                  post.id === publishedPostId
                    ? "border-amber-300 bg-amber-50 ring-2 ring-amber-200"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Deadline:{" "}
                      {new Date(post.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="mt-1">{post.location || "Not specified"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">Work Type</p>
                    <p className="mt-1">{post.workType || "Not specified"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="mt-1">
                      {post.durationMonths
                        ? `${post.durationMonths} months`
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">Stipend</p>
                    <p className="mt-1">
                      {post.stipendAmount ?? "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Description
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {post.description || "No description provided."}
                  </p>
                </div>

                {post.responsibilities && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Responsibilities
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {post.responsibilities}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Required Skills
                    </p>
                    <div className="mt-3 flex min-h-8 flex-wrap gap-2">
                      {post.requiredSkills.length > 0 ? (
                        post.requiredSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            {skill.skillName}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">
                          No required skills
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Optional Skills
                    </p>
                    <div className="mt-3 flex min-h-8 flex-wrap gap-2">
                      {post.optionalSkills.length > 0 ? (
                        post.optionalSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
                          >
                            {skill.skillName}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">
                          No optional skills
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}