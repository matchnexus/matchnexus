"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Skill = {
  id: string;
  skillName: string;
  proficiencyLevel: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  responsibilities?: string | null;
  keyRequirements?: string | null;
  techStack?: string | null;
  location?: string | null;
  workType?: string | null;
  durationMonths?: number | null;
  stipendAmount?: string | number | null;
  applicationDeadline: string;
  status: string;
  requiredSkills: Skill[];
  optionalSkills: Skill[];
};

const splitDescriptionSections = (rawDescription: string) => {
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

const formatCategoryLabel = (value?: string | null) => {
  const normalized = (value || "").trim().toUpperCase();

  if (normalized === "IT" || normalized === "COMPUTING") return "IT";
  if (normalized === "BUSINESS") return "Business";
  if (normalized === "ENGINEERING") return "Engineering";

  return value || "Not specified";
};

export default function CompanyPostsPage() {
  const searchParams = useSearchParams();
  const updatedPostId = searchParams.get("updated") || "";
  const [companyId, setCompanyId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchPosts = async () => {
    setMessage("");

    if (!companyId) {
      setIsError(true);
      setMessage("Company session not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      const res = await fetch(`/api/company/posts?companyId=${companyId}`);
      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to fetch posts");
        return;
      }

      setPosts(data.posts || []);
      if (updatedPostId && (data.posts || []).some((post: Post) => post.id === updatedPostId)) {
        setMessage("Post updated successfully");
      } else if (!data.posts || data.posts.length === 0) {
        setIsError(false);
        setMessage("No internship posts found for this company");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    setCompanyId(storedCompanyId);
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetchPosts();
  }, [companyId, updatedPostId]);

  const handleDelete = async (postId: string) => {
    const post = posts.find((item) => item.id === postId);
    const confirmed = window.confirm(
      `Are you sure you want to delete ${post?.title || "this post"}?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/company/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      setIsError(false);
      setMessage("Post deleted successfully");
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong while deleting");
    }
  };

  const handleStatusChange = async (postId: string, status: "ACTIVE" | "CLOSED") => {
    try {
      setStatusUpdatingId(postId);
      setIsError(false);
      setMessage("");

      const res = await fetch(`/api/company/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to update post status");
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status } : post
        )
      );

        setMessage(data.message || "Post status updated");
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong while updating status");
    } finally {
      setStatusUpdatingId("");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const { coreDescription, qualifications, keyRequirements, techStack } = splitDescriptionSections(
        post.description
      );
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coreDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keyRequirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
        techStack.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 md:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-600">
            {loading
              ? "Loading posts..."
              : `Showing ${filteredPosts.length} of ${posts.length} posts`}
          </p>
          <Link
            href="/company/posts/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Publish Post
          </Link>
        </div>

        {!loading && posts.length > 0 && (
          <div className="grid gap-3 rounded-xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:grid-cols-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Published</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        {message && (
          <p
            className={`rounded-lg border px-4 py-3 text-center text-sm font-medium ${
              isError
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </p>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <div className="h-6 w-1/3 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-full rounded bg-gray-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
                <div className="mt-6 h-8 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && !isError && (
          <div className="rounded-xl border border-blue-100 bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-900">No posts yet</h2>
            <p className="mt-2 text-sm text-gray-600">Create your first internship post to start receiving applications.</p>
            <Link
              href="/company/posts/new"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Internship Post
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="rounded-xl border border-blue-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-bold text-gray-900">No matching posts</h2>
            <p className="mt-2 text-sm text-gray-600">Try a different keyword or change the status filter.</p>
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="space-y-4">
          {filteredPosts.map((post) => (
            (() => {
              const details = splitDescriptionSections(post.description);
              const displayedKeyRequirements = post.keyRequirements?.trim() || details.keyRequirements;
              const displayedTechStack = post.techStack?.trim() || details.techStack;
              const responsibilityItems = toLineItems(post.responsibilities);
              const keyRequirementItems = toLineItems(displayedKeyRequirements);
              const techStackItems = toLineItems(displayedTechStack);
              return (
            <div
              key={post.id}
              className={`rounded-xl border-2 border-black p-6 shadow-sm transition ${
                updatedPostId && post.id === updatedPostId
                  ? "bg-green-50 ring-2 ring-green-400/70"
                  : "bg-white/80"
              }`}
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Deadline: {new Date(post.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(post.id, "ACTIVE")}
                    disabled={statusUpdatingId === post.id || post.status === "ACTIVE"}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    Publish
                  </button>

                  <button
                    onClick={() => handleStatusChange(post.id, "CLOSED")}
                    disabled={statusUpdatingId === post.id || post.status === "CLOSED"}
                    className="rounded-lg bg-slate-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Close
                  </button>

                  <Link
                    href={`/company/posts/${post.id}`}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
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
                  {formatCategoryLabel(post.category)}
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {details.coreDescription || "Not specified"}
                </p>
              </div>

              {post.responsibilities && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Responsibilities</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {responsibilityItems.map((item, index) => (
                      <li key={`responsibility-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details.qualifications && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Qualifications</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                    {details.qualifications}
                  </p>
                </div>
              )}

              {displayedKeyRequirements && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Key Requirements</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {keyRequirementItems.map((item, index) => (
                      <li key={`requirement-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayedTechStack && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Tech Stack</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {techStackItems.map((item, index) => (
                      <li key={`tech-item-${post.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
              );
            })()
          ))}
          </div>
        )}
      </div>
    </div>
  );
}