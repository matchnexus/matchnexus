"use client";

import { Alert, Badge, Card, Spinner } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [slideDirection, setSlideDirection] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");

  const companyPhotos = [
    "/photos/image2.jpg",
    "/photos/image5.jpg",
    "/photos/image3.jpg",
    "/photos/image4.jpg",
    "/photos/image6.jpg",
    "/photos/image7.jpg",
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

  // Auto-rotate photos with a longer cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection(1);
      setCurrentPhotoIndex((prev) => (prev + 1) % companyPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [companyPhotos.length]);

  const goToPhoto = (index: number) => {
    setSlideDirection(index > currentPhotoIndex ? 1 : -1);
    setCurrentPhotoIndex(index);
  };

  const handleSearchJobs = () => {
    setAppliedKeyword(searchKeyword.trim());
    setAppliedCategory(searchCategory.trim());
    setAppliedLocation(searchLocation.trim());
  };

  const clearSearchJobs = () => {
    setSearchKeyword("");
    setSearchCategory("");
    setSearchLocation("");
    setAppliedKeyword("");
    setAppliedCategory("");
    setAppliedLocation("");
  };

  const activePosts = posts.filter((p) => p.status === "ACTIVE");
  const filteredPosts = activePosts.filter((post) => {
    const normalizedTitle = post.title.toLowerCase();
    const normalizedCategory = (post.category || post.workType || "").toLowerCase();
    const normalizedLocation = (post.location || "").toLowerCase();
    const normalizedDescription = (post.description || "").toLowerCase();

    const matchesKeyword =
      !appliedKeyword ||
      normalizedTitle.includes(appliedKeyword.toLowerCase()) ||
      normalizedDescription.includes(appliedKeyword.toLowerCase()) ||
      (post.requiredSkills || []).some((skill) => skill.skillName.toLowerCase().includes(appliedKeyword.toLowerCase()));

    const matchesCategory =
      !appliedCategory ||
      normalizedCategory.includes(appliedCategory.toLowerCase());

    const matchesLocation =
      !appliedLocation ||
      normalizedLocation.includes(appliedLocation.toLowerCase());

    return matchesKeyword && matchesCategory && matchesLocation;
  });
  const hasAppliedSearch = Boolean(appliedKeyword || appliedCategory || appliedLocation);

  return (
    <section className="min-h-screen space-y-6 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl px-2 md:px-4">
        <div className="grid gap-2 rounded-2xl bg-white/90 p-2 shadow-2xl backdrop-blur md:grid-cols-[1.25fr_0.9fr_0.9fr_auto] md:gap-3 md:p-3">
          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500"
            placeholder="keywords, title, skills"
          />
          <select
            value={searchCategory}
            onChange={(event) => setSearchCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500"
          >
            <option value="">All categories</option>
            <option value="computing">IT</option>
            <option value="business">Business</option>
            <option value="engineering">Engineering</option>
          </select>
          <input
            value={searchLocation}
            onChange={(event) => setSearchLocation(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500"
            placeholder="location"
          />
          <button
            type="button"
            onClick={handleSearchJobs}
            className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
          >
            Search Jobs
          </button>
        </div>
      </div>

      <Card className="overflow-hidden border-0 p-0 shadow-2xl">
        <div className="relative isolate min-h-[560px] overflow-hidden rounded-3xl bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhotoIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, x: slideDirection > 0 ? 120 : -120, scale: 1.04 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: slideDirection > 0 ? -120 : 120, scale: 1.02 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={companyPhotos[currentPhotoIndex]}
                alt={`Company showcase ${currentPhotoIndex + 1}`}
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <motion.div
            aria-hidden="true"
            className="absolute -left-10 top-16 h-36 w-36 rounded-full bg-white/10 blur-2xl"
            animate={{ y: [0, -14, 0], x: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -right-8 bottom-16 h-44 w-44 rounded-full bg-cyan-400/15 blur-2xl"
            animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex min-h-[560px] flex-col justify-center px-6 py-10 md:px-12 lg:px-16">
            <div className="max-w-3xl text-white">
              <motion.h1
                className="max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-6xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                Welcome,
                <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-sky-200">
                  {companyName || "Company"}
                </span>
              </motion.h1>

              <motion.p
                className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 md:text-base"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
              >
                Manage internship posts, track applications, and monitor your hiring performance in one place.
                Connect with top talent and build your dream team.
              </motion.p>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {companyPhotos.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToPhoto(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentPhotoIndex ? "w-9 bg-white" : "w-2.5 bg-white/45 hover:bg-white/80"
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.92 }}
                />
              ))}
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

        {hasAppliedSearch && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
            <span className="font-bold uppercase tracking-wide text-cyan-700">Filtered results</span>
            {appliedKeyword && <Badge color="info" className="rounded-full px-3 py-1 text-[10px] font-black uppercase">{appliedKeyword}</Badge>}
            {appliedCategory && <Badge color="success" className="rounded-full px-3 py-1 text-[10px] font-black uppercase">{appliedCategory}</Badge>}
            {appliedLocation && <Badge color="warning" className="rounded-full px-3 py-1 text-[10px] font-black uppercase">{appliedLocation}</Badge>}
            <button
              type="button"
              onClick={clearSearchJobs}
              className="ml-auto rounded-full bg-cyan-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-cyan-700"
            >
              Clear
            </button>
          </div>
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

        {!loadingPosts && activePosts.length > 0 && filteredPosts.length === 0 && (
          <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50 py-10 text-center text-cyan-700">
            No jobs match the selected filters.
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const details = splitDescriptionSections(post.description);
            const displayedQualifications = details.qualifications;
            const displayedKeyRequirements = post.keyRequirements?.trim() || details.keyRequirements;
            const responsibilityItems = toLineItems(post.responsibilities);
            const keyRequirementItems = toLineItems(displayedKeyRequirements);
            const displayedTechStack = post.techStack?.trim() || details.techStack;
            const techStackItems = toLineItems(displayedTechStack);

            return (
              <div
                key={post.id}
                className="rounded-xl border-2 border-black bg-white/80 p-6 shadow-sm"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {post.applicationsCount || 0} applications
                      </span>
                    </div>
                  </div>

                </div>

                <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2 lg:grid-cols-4">
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
                    <span className="font-semibold text-gray-900">Category:</span>{" "}
                    {post.category || "Not specified"}
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                    {details.coreDescription || "Not specified"}
                  </p>
                </div>

                {responsibilityItems.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Responsibilities</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {responsibilityItems.map((item, index) => (
                        <li key={`responsibility-item-${post.id}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {displayedQualifications && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Qualifications</h4>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                      {displayedQualifications}
                    </p>
                  </div>
                )}

                {keyRequirementItems.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Key Requirements</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {keyRequirementItems.map((item, index) => (
                        <li key={`requirement-item-${post.id}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {techStackItems.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Tech Stack</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {techStackItems.map((item, index) => (
                        <li key={`tech-item-${post.id}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}