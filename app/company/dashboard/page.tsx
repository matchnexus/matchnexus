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
  const [publishedPosts, setPublishedPosts] = useState<DashboardPost[]>([]);
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
          setPublishedPosts([]);
          return;
        }

        const posts = (data.posts || []) as DashboardPost[];
        const activePosts = posts.filter((post) => post.status === "ACTIVE");
        setPublishedPosts(activePosts);
      } catch {
        setPublishedPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [companyId]);

  const heading = companyName ? `Welcome, ${companyName}` : "Welcome";

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative h-52 w-full md:h-64">
          <Image
            src="/photos/hero.jpg"
            alt="Office background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
            <h1 className="text-2xl font-extrabold md:text-3xl">{heading}</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
              Manage company profile, publish internship opportunities, and track your hiring pipeline from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

        {publishedPostId && (
          <p className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800">
            Post published successfully.
          </p>
        )}

        {loadingPosts && (
          <p className="text-sm text-gray-500">Loading published posts...</p>
        )}

        {!loadingPosts && publishedPosts.length === 0 && (
          <p className="text-sm text-gray-600">No published posts yet. Publish posts from the posts page to see them here.</p>
        )}

        {!loadingPosts && publishedPosts.length > 0 && (
          <div className="space-y-2">
            {publishedPosts.map((post) => (
              <details
                key={post.id}
                open={post.id === publishedPostId}
                className={`rounded-xl border p-4 ${
                  post.id === publishedPostId
                    ? "border-amber-300 bg-amber-50"
                    : "border-slate-300 bg-slate-50"
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

                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-gray-900">Description</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {post.description || "No description provided."}
                  </p>
                </div>

                {post.responsibilities && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
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
    </section>
  );
}