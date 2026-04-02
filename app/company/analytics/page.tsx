"use client";

import { Badge, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

type AnalyticsPost = {
  id: string;
  status: string;
  applicationsCount?: number;
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

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track post performance, engagement, and candidate activity from this area.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white/80 p-8 text-slate-600 shadow-sm backdrop-blur-sm">
          <Spinner size="md" />
          <span>Loading analytics...</span>
        </div>
      ) : (
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
      )}
    </section>
  );
}
