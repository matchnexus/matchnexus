"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const postId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibilities: "",
    location: "",
    workType: "",
    durationMonths: "",
    stipendAmount: "",
    applicationDeadline: "",
    requiredSkills: "",
    optionalSkills: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);

  const canSubmit =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.applicationDeadline;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoadingPost(true);
        const res = await fetch(`/api/company/posts/single?id=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          setIsError(true);
          setMessage(data.error || "Failed to load post");
          return;
        }

        const post = data.post;

        setFormData({
          title: post.title || "",
          description: post.description || "",
          responsibilities: post.responsibilities || "",
          location: post.location || "",
          workType: post.workType || "",
          durationMonths: post.durationMonths?.toString() || "",
          stipendAmount: post.stipendAmount?.toString() || "",
          applicationDeadline: post.applicationDeadline
            ? post.applicationDeadline.split("T")[0]
            : "",
          requiredSkills: post.requiredSkills
            .map((skill: { skillName: string }) => skill.skillName)
            .join(", "),
          optionalSkills: post.optionalSkills
            .map((skill: { skillName: string }) => skill.skillName)
            .join(", "),
        });
      } catch (error) {
        setIsError(true);
        setMessage("Something went wrong");
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      setIsError(false);

      const res = await fetch(`/api/company/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          responsibilities: formData.responsibilities,
          location: formData.location,
          workType: formData.workType || null,
          durationMonths: formData.durationMonths
            ? Number(formData.durationMonths)
            : null,
          stipendAmount: formData.stipendAmount
            ? Number(formData.stipendAmount)
            : null,
          applicationDeadline: formData.applicationDeadline,
          requiredSkills: formData.requiredSkills,
          optionalSkills: formData.optionalSkills,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to update post");
        return;
      }

      setIsError(false);
      setMessage("Post updated successfully. Redirecting...");
      setTimeout(() => {
        router.push(`/company/posts?updated=${postId}`);
      }, 500);
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:py-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          {loadingPost ? (
            <div className="space-y-3">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-20 animate-pulse rounded bg-slate-100" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600">Basic Details</h2>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Post Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Frontend Developer Intern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Describe the internship role, team, and expected outcomes"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="List key tasks and responsibilities"
                    rows={3}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600">Role Setup</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. Colombo"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Work Type</label>
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select work type</option>
                      <option value="REMOTE">Remote</option>
                      <option value="ONSITE">Onsite</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Duration (Months)</label>
                    <input
                      type="number"
                      min={1}
                      name="durationMonths"
                      value={formData.durationMonths}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. 6"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Stipend</label>
                    <input
                      type="number"
                      min={0}
                      name="stipendAmount"
                      value={formData.stipendAmount}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Application Deadline</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600">Skills</h2>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Required Skills</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="React, TypeScript, Git"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Optional Skills</label>
                  <input
                    type="text"
                    name="optionalSkills"
                    value={formData.optionalSkills}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Next.js, Tailwind, Node.js"
                  />
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/company/posts")}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? "Updating..." : "Update Post"}
                </button>
              </div>
            </form>
          )}
        </div>

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
      </div>
    </div>
  );
}