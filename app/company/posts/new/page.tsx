"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DURATION_YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => String(index + 1));
const DURATION_MONTH_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index + 1));

export default function CreatePostPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibilities: "",
    location: "",
    workType: "",
    stipendAmount: "",
    applicationDeadline: "",
    requiredSkills: "",
    optionalSkills: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [durationUnit, setDurationUnit] = useState<"MONTHS" | "YEARS">("MONTHS");
  const [durationValue, setDurationValue] = useState("");
  const todayDate = getTodayDateString();
  const totalDurationMonths = durationValue
    ? durationUnit === "YEARS"
      ? Number(durationValue) * 12
      : Number(durationValue)
    : 0;

  const canSubmit =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.applicationDeadline;

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    setCompanyId(storedCompanyId);
  }, []);

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

    if (!companyId) {
      setIsError(true);
      setMessage("Company session not found. Please login again.");
      return;
    }

    if (formData.applicationDeadline < todayDate) {
      setIsError(true);
      setMessage("Application deadline cannot be in the past.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      const res = await fetch("/api/company/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          title: formData.title,
          description: formData.description,
          responsibilities: formData.responsibilities,
          location: formData.location,
          workType: formData.workType || null,
          durationMonths: totalDurationMonths > 0 ? totalDurationMonths : null,
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
        setMessage(data.error || "Failed to create post");
        return;
      }

      setIsError(false);
      setMessage("Internship post created successfully 🎉");

      setFormData({
        title: "",
        description: "",
        responsibilities: "",
        location: "",
        workType: "",
        stipendAmount: "",
        applicationDeadline: "",
        requiredSkills: "",
        optionalSkills: "",
      });
      setDurationUnit("MONTHS");
      setDurationValue("");

      setTimeout(() => {
        router.push("/company/posts");
      }, 500);
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 md:py-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
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
                  <label className="text-sm font-semibold text-slate-700">Duration</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={durationUnit}
                      onChange={(e) => {
                        setDurationUnit(e.target.value as "MONTHS" | "YEARS");
                        setDurationValue("");
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="MONTHS">Months</option>
                      <option value="YEARS">Years</option>
                    </select>

                    <select
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select value</option>
                      {(durationUnit === "YEARS"
                        ? DURATION_YEAR_OPTIONS
                        : DURATION_MONTH_OPTIONS
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option} {durationUnit === "YEARS" ? "Year" : "Month"}
                          {option === "1" ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-slate-500">
                    Total duration: {totalDurationMonths || 0} month(s)
                  </p>
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
                    min={todayDate}
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
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    responsibilities: "",
                    location: "",
                    workType: "",
                    stipendAmount: "",
                    applicationDeadline: "",
                    requiredSkills: "",
                    optionalSkills: "",
                  });
                  setDurationUnit("MONTHS");
                  setDurationValue("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Creating..." : "Create Internship Post"}
              </button>
            </div>
          </form>
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