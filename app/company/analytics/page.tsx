"use client";

import { Badge, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

type AnalyticsPost = {
  id: string;
  status: string;
  applicationsCount?: number;
  category?: string | null;
};

export default function CompanyAnalyticsPage() {
  const [companyId, setCompanyId] = useState("");
  const [posts, setPosts] = useState<AnalyticsPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId") || "");
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/company/posts?companyId=${companyId}`);
        const data = await res.json();
        setPosts(res.ok ? data.posts || [] : []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

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
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ranked applicants are computed from the uploaded CV, profile skills, and post requirements.
        </p>
      </div>

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
    </section>
  );
}
