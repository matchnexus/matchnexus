"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { HiChartBar, HiAcademicCap, HiBriefcase, HiCheckCircle } from "react-icons/hi";

type ApplicantRow = {
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

type RankPost = {
  id: string;
  postTitle: string;
  companyName: string;
  applicants: ApplicantRow[];
=======
import { Badge, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

type AnalyticsPost = {
  id: string;
  status: string;
  applicationsCount?: number;
  category?: string | null;
>>>>>>> main
};

export default function CompanyAnalyticsPage() {
  const [companyId, setCompanyId] = useState("");
<<<<<<< HEAD
  const [rankings, setRankings] = useState<RankPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    setCompanyId(storedCompanyId);
=======
  const [posts, setPosts] = useState<AnalyticsPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId") || "");
>>>>>>> main
  }, []);

  useEffect(() => {
    if (!companyId) return;

<<<<<<< HEAD
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/company/analytics?companyId=${companyId}`);
        const data = await res.json();

        if (!res.ok) {
          setRankings([]);
          setMessage(data.error || "Failed to load analytics");
          return;
        }

        setRankings(data.rankings || []);
        setMessage((data.rankings || []).length ? null : "No ranked applicants yet.");
      } catch {
        setRankings([]);
        setMessage("Failed to load analytics");
=======
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/company/posts?companyId=${companyId}`);
        const data = await res.json();
        setPosts(res.ok ? data.posts || [] : []);
      } catch {
        setPosts([]);
>>>>>>> main
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    fetchAnalytics();
  }, [companyId]);

  const totalApplicants = rankings.reduce((count, post) => count + post.applicants.length, 0);
  const recommendedApplicants = rankings.reduce(
    (count, post) => count + post.applicants.filter((applicant) => applicant.isRecommended).length,
    0
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
=======
    fetchPosts();
  }, [companyId]);

  const totalPosts = posts.length;
  const totalApplications = posts.reduce((total, post) => total + (post.applicationsCount || 0), 0);
  const activePosts = posts.filter((post) => post.status === "ACTIVE").length;
  const closedPosts = posts.filter((post) => post.status === "CLOSED").length;
  const draftPosts = posts.filter((post) => post.status === "DRAFT").length;
  const categoryCounts = posts.reduce<Record<string, number>>((accumulator, post) => {
    const category = (post.category || "Uncategorized").trim() || "Uncategorized";
    accumulator[category] = (accumulator[category] || 0) + 1;
    return accumulator;
  }, {});
  const categoryStats = Object.entries(categoryCounts)
    .sort((firstCategory, secondCategory) => secondCategory[1] - firstCategory[1]);
  const maxCategoryCount = categoryStats.length ? Math.max(...categoryStats.map(([, count]) => count)) : 1;
  const activeRatio = totalPosts > 0 ? Math.round((activePosts / totalPosts) * 100) : 0;
  const closedRatio = totalPosts > 0 ? Math.round((closedPosts / totalPosts) * 100) : 0;
  const draftRatio = totalPosts > 0 ? Math.round((draftPosts / totalPosts) * 100) : 0;
  const activeStop = totalPosts > 0 ? (activePosts / totalPosts) * 100 : 0;
  const closedStop = totalPosts > 0 ? ((activePosts + closedPosts) / totalPosts) * 100 : 0;

  const statusStats = [
    { label: "Active", value: activePosts, barClass: "bg-emerald-500" },
    { label: "Closed", value: closedPosts, barClass: "bg-rose-500" },
    { label: "Draft", value: draftPosts, barClass: "bg-amber-500" },
  ];
  const maxStatusCount = Math.max(1, ...statusStats.map((stat) => stat.value));

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
>>>>>>> main
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ranked applicants are computed from the uploaded CV, profile skills, and post requirements.
        </p>
      </div>

<<<<<<< HEAD
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Posts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{rankings.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Applications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalApplicants}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Recommended Candidates</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{recommendedApplicants}</p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          {message}
        </div>
      )}

      {loading && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading ranked applicants...</p>
        </div>
      )}

      <div className="space-y-6">
        {rankings.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-cyan-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600">
                  <HiBriefcase className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{post.postTitle}</h2>
                  <p className="text-sm text-gray-500">{post.companyName}</p>
                </div>
              </div>

              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {post.applicants.length} ranked applicants
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {post.applicants.map((applicant) => (
                  <div
                    key={applicant.applicationId}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md">
                          <HiAcademicCap className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {applicant.firstName} {applicant.lastName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">{applicant.email}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                        #{applicant.rankPosition}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-lg font-bold text-blue-700">{applicant.overallScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Overall</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">{applicant.isRecommended ? "Yes" : "No"}</p>
                        <p className="text-xs font-medium text-gray-500">Recommended</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.requiredSkillsScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Required</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.optionalSkillsScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Optional</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.educationScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Education</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.experienceScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Experience</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <HiCheckCircle className="h-4 w-4 text-cyan-600" />
                        Match reason
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{applicant.reason}</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-800">CV skills detected</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {applicant.cvSkills.length ? (
                          applicant.cvSkills.map((skill) => (
                            <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No skills detected from CV</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
=======
      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/80 p-8 text-slate-600 shadow-sm backdrop-blur-sm">
          <Spinner size="md" />
          <span>Loading analytics...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Total Posts", value: totalPosts, badge: "info" as const },
              { title: "Applications", value: totalApplications, badge: "success" as const },
              { title: "Active Posts", value: activePosts, badge: "failure" as const },
            ].map((item) => (
              <Card key={item.title} className="border-0 bg-white/80 shadow-md backdrop-blur">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-slate-600">{item.title}</p>
                  <Badge color={item.badge}>{item.title}</Badge>
                </div>
                <h2 className="mt-2 text-4xl font-black text-slate-800">{item.value}</h2>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-0 bg-white/80 shadow-md backdrop-blur lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Post Status Graph</h2>
                <Badge color="purple">Bars</Badge>
              </div>

              <div className="mt-5 space-y-4">
                {statusStats.map((status) => {
                  const widthPercent = Math.max(8, Math.round((status.value / maxStatusCount) * 100));

                  return (
                    <div key={status.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{status.label}</span>
                        <span className="font-bold text-slate-500">{status.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div
                          className={`h-3 rounded-full ${status.barClass}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-0 bg-white/80 shadow-md backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Post Status Ratio</h2>
                <Badge color="success">Donut</Badge>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center">
                <div
                  className="relative grid h-36 w-36 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#10b981 0% ${activeStop}%, #f43f5e ${activeStop}% ${closedStop}%, #f59e0b ${closedStop}% 100%)`,
                  }}
                >
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center shadow-inner">
                    <p className="text-2xl font-black text-slate-800">{totalPosts}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-600">Total posts distribution by status</p>

                <div className="mt-4 w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                    <span className="font-semibold text-emerald-700">Active</span>
                    <span className="font-black text-emerald-700">{activePosts} ({activeRatio}%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                    <span className="font-semibold text-rose-700">Closed</span>
                    <span className="font-black text-rose-700">{closedPosts} ({closedRatio}%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                    <span className="font-semibold text-amber-700">Draft</span>
                    <span className="font-black text-amber-700">{draftPosts} ({draftRatio}%)</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-0 bg-white/80 shadow-md backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Category-wise Jobs Count</h2>
              <Badge color="indigo">{categoryStats.length} categories</Badge>
            </div>

            {categoryStats.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No categories found yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {categoryStats.map(([categoryName, jobCount]) => (
                  <div key={categoryName}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <p className="font-semibold text-slate-700">{categoryName}</p>
                      <p className="font-bold text-blue-700">{jobCount}</p>
                    </div>
                    <div className="h-3 rounded-full bg-blue-50">
                      <div
                        className="h-3 rounded-full bg-blue-500"
                        style={{ width: `${Math.max(10, Math.round((jobCount / maxCategoryCount) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
>>>>>>> main
    </section>
  );
}
