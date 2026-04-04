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
  category?: string | null;
  workType?: string | null;
  location?: string | null;
  durationMonths?: number | null;
  stipendAmount?: string | number | null;
  description?: string | null;
  responsibilities?: string | null;
  keyRequirements?: string | null;
  techStack?: string | null;
  requiredSkills: DashboardSkill[];
  optionalSkills: DashboardSkill[];
};

const splitDescriptionSections = (rawDescription?: string | null) => {
  const description = rawDescription || "";
  const labels = ["Category", "Qualifications", "Experience", "Key Requirements", "Tech Stack"];

  const extractSection = (label: string) => {
    const marker = `\n\n${label}:\n`;
    const start = description.indexOf(marker);

    if (start < 0) return "";

    const contentStart = start + marker.length;
    let contentEnd = description.length;

    labels.forEach((nextLabel) => {
      const nextMarker = `\n\n${nextLabel}:\n`;
      const nextIndex = description.indexOf(nextMarker, contentStart);
      if (nextIndex >= 0 && nextIndex < contentEnd) {
        contentEnd = nextIndex;
      }
    });

    return description.slice(contentStart, contentEnd).trim();
  };

  const markerIndexes = labels
    .map((label) => description.indexOf(`\n\n${label}:\n`))
    .filter((index) => index >= 0);
  const firstMarkerIndex = markerIndexes.length > 0 ? Math.min(...markerIndexes) : -1;

  const coreDescription = (firstMarkerIndex >= 0
    ? description.slice(0, firstMarkerIndex)
    : description
  ).trim();

  return {
    coreDescription,
    qualifications: extractSection("Qualifications"),
    keyRequirements: extractSection("Key Requirements"),
    techStack: extractSection("Tech Stack"),
  };
};

const toLineItems = (value?: string | null) => {
  if (!value) return [];

  return value
    .split(/\r?\n|\*/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function CompanyDashboardPage() {
  const searchParams = useSearchParams();
  const publishedPostId = searchParams.get("published") || "";
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [missionStatement, setMissionStatement] = useState("");
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

  useEffect(() => {
    if (!companyId) return;

    const fetchMissionStatement = async () => {
      try {
        const res = await fetch(`/api/company/profile?companyId=${companyId}`);
        const data = await res.json();

        if (!res.ok) {
          setMissionStatement("");
          return;
        }

        setMissionStatement(data?.profile?.missionStatement?.trim?.() || "");
      } catch {
        setMissionStatement("");
      }
    };

    fetchMissionStatement();
  }, [companyId]);

  // Auto-rotate photos every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % companyPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [companyPhotos.length]);

  const activePosts = posts.filter((p) => p.status === "ACTIVE");

  return (
    <section className="min-h-screen space-y-6 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-4 md:p-6">
      <Card className="border-0 shadow-xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4 px-2 md:px-6">
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">{companyName || "Company"}</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
              Manage internship posts, track applications, and monitor your hiring performance in one place. Connect with top talent and build your dream team.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-6 md:py-10">
            <div className="relative h-80 w-full max-w-sm">
              <div className="absolute inset-0 rounded-full shadow-2xl" style={{
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,220,255,0.7))",
                filter: "blur(0.5px)",
                transform: "scaleX(1.1)",
              }} />

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

      <Card className="border-0 bg-white/85 shadow-lg backdrop-blur">
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
            (() => {
              const details = splitDescriptionSections(post.description);
              const displayedKeyRequirements = post.keyRequirements?.trim() || details.keyRequirements;
              const displayedTechStack = post.techStack?.trim() || details.techStack;
              const responsibilityItems = toLineItems(post.responsibilities);
              const keyRequirementItems = toLineItems(displayedKeyRequirements);
              const techStackItems = toLineItems(displayedTechStack);
              return (
            <Card key={post.id} className="border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-800">{post.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge color="blue">{post.applicationsCount || 0} Applications</Badge>
                  <Link
                    href={`/jobs/${post.id}`}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    Apply
                  </Link>
                </div>
              </div>

              {post.applicationDeadline && (
                <p className="mt-1 text-xs text-slate-500">
                  Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                {post.location && (
                  <div className="rounded-lg bg-slate-50 p-3">Location: {post.location}</div>
                )}
                {post.workType && (
                  <div className="rounded-lg bg-slate-50 p-3">Work Type: {post.workType}</div>
                )}
                {post.durationMonths && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    Duration: {post.durationMonths} months
                  </div>
                )}
              </div>

              {details.coreDescription && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800">Description</h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {details.coreDescription}
                  </p>
                </div>
              )}

              {post.responsibilities && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800">Responsibilities</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                    {responsibilityItems.map((item, index) => (
                      <li key={`responsibility-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details.qualifications && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800">Qualifications</h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {details.qualifications}
                  </p>
                </div>
              )}

              {displayedKeyRequirements && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800">Key Requirements</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                    {keyRequirementItems.map((item, index) => (
                      <li key={`requirement-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayedTechStack && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800">Tech Stack</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                    {techStackItems.map((item, index) => (
                      <li key={`tech-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
              );
            })()
          ))}
        </div>
      </Card>
    </section>
  );
}