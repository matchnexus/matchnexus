"use client";

import { Alert, Badge, Card, Spinner } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const companyPhotos = [
    "/photos/image1.jpg",
    "/photos/image2.jpg",
    "/photos/image3.jpg",
    "/photos/image4.jpg",
  ];

  useEffect(() => {
    setCompanyName(localStorage.getItem("companyName") || "");
    setCompanyId(localStorage.getItem("companyId") || "");
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch(`/api/company/posts?companyId=${companyId}`);
        const data = await res.json();

        setPosts(res.ok ? data.posts || [] : []);
      } catch {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [companyId]);

  // Auto-rotate photos every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % companyPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [companyPhotos.length]);

  const heading = companyName ? `Welcome, ${companyName}` : "Welcome";

  const activePosts = posts.filter((p) => p.status === "ACTIVE");
  const totalPosts = posts.length;
  const totalApplications = posts.reduce(
    (t, p) => t + (p.applicationsCount || 0),
    0
  );

  return (
    <section className="min-h-screen space-y-6 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-4 md:p-6">
      <Card className="border-0 shadow-xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-4 px-2 md:px-6">
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Welcome,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                {companyName || "Company"}
              </span>
            </h1>
            
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
              Manage internship posts, track applications, and monitor your hiring performance in one place. Connect with top talent and build your dream team.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/company/posts/new"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
              >
                Create Post
              </Link>
              <Link
                href="/company/posts"
                className="rounded-xl border-2 border-blue-600 px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
              >
                View Posts
              </Link>
            </div>
          </div>

          {/* Right Side - Photo Carousel with Organic Shape */}
          <div className="relative flex items-center justify-center py-6 md:py-10">
            <div className="relative h-80 w-full max-w-sm">
              {/* Organic blob background */}
              <div className="absolute inset-0 rounded-full shadow-2xl" style={{
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,220,255,0.7))",
                filter: "blur(0.5px)",
                transform: "scaleX(1.1)",
              }} />
              
              {/* Photo container with carousel */}
              <div className="relative h-full w-full overflow-hidden rounded-full shadow-xl">
                <Image
                  src={companyPhotos[currentPhotoIndex]}
                  alt={`Company showcase ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {companyPhotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentPhotoIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "Total Posts", value: totalPosts, badge: "info" as const },
          { title: "Applications", value: totalApplications, badge: "success" as const },
          { title: "Active Posts", value: activePosts.length, badge: "failure" as const },
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

      <Card className="border-0 bg-white/85 shadow-lg backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Published Posts</h2>
          <Badge color="indigo">{activePosts.length} Active</Badge>
        </div>

        {publishedPostId && (
          <Alert color="success" className="mb-4">
            Post published successfully.
          </Alert>
        )}

        {loadingPosts && (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-600">
            <Spinner size="md" />
            <span>Loading posts...</span>
          </div>
        )}

        {!loadingPosts && activePosts.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-slate-500">
            No active posts yet.
          </div>
        )}

        <div className="space-y-4">
          {activePosts.map((post) => (
            <Card key={post.id} className="border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-800">{post.title}</h3>
                <Badge color="blue">{post.applicationsCount || 0} Applications</Badge>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-3">Location: {post.location || "N/A"}</div>
                <div className="rounded-lg bg-slate-50 p-3">Work Type: {post.workType || "N/A"}</div>
                <div className="rounded-lg bg-slate-50 p-3">Duration: {post.durationMonths || "N/A"} months</div>
                <div className="rounded-lg bg-slate-50 p-3">Stipend: {post.stipendAmount || "N/A"}</div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">{post.description || "No description"}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.requiredSkills.map((s) => (
                  <Badge key={s.id} color="info">
                    {s.skillName}
                  </Badge>
                ))}
                {post.optionalSkills.map((s) => (
                  <Badge key={s.id} color="purple">
                    {s.skillName}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </section>
  );
}