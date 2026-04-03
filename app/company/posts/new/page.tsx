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

const parsePoints = (value: string) => {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : [""];
};

const serializePoints = (points: string[]) =>
  points
    .map((point) => point.trim())
    .filter(Boolean)
    .join("\n");

const DURATION_YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => String(index + 1));
const DURATION_MONTH_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index + 1));

export default function CreatePostPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    workType: "",
    applicationDeadline: "",
  });
  const [responsibilityPoints, setResponsibilityPoints] = useState<string[]>(parsePoints(""));
  const [keyRequirementPoints, setKeyRequirementPoints] = useState<string[]>(parsePoints(""));
  const [techStackPoints, setTechStackPoints] = useState<string[]>(parsePoints(""));

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

  const handlePointChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addPoint = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const removePoint = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => {
      if (prev.length === 1) {
        return [""];
      }

      return prev.filter((_, itemIndex) => itemIndex !== index);
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

    if (formData.applicationDeadline && formData.applicationDeadline < todayDate) {
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
          category: formData.category,
          description: formData.description,
          keyRequirements: serializePoints(keyRequirementPoints),
          techStack: serializePoints(techStackPoints),
          responsibilities: serializePoints(responsibilityPoints),
          location: formData.location,
          workType: formData.workType || null,
          durationMonths: totalDurationMonths > 0 ? totalDurationMonths : null,
          applicationDeadline: formData.applicationDeadline,
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
        category: "",
        description: "",
        location: "",
        workType: "",
        applicationDeadline: "",
      });
      setResponsibilityPoints(parsePoints(""));
      setKeyRequirementPoints(parsePoints(""));
      setTechStackPoints(parsePoints(""));
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category</option>
                  <option value="IT">IT</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                </select>
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Responsibilities</label>
                <div className="space-y-2">
                  {responsibilityPoints.map((point, index) => (
                    <div key={`responsibility-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) =>
                          handlePointChange(setResponsibilityPoints, index, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder={`Responsibility ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePoint(setResponsibilityPoints, index)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addPoint(setResponsibilityPoints)}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    + Add Responsibility
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Key Requirements</label>
                <div className="space-y-2">
                  {keyRequirementPoints.map((point, index) => (
                    <div key={`requirement-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) =>
                          handlePointChange(setKeyRequirementPoints, index, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder={`Requirement ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePoint(setKeyRequirementPoints, index)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addPoint(setKeyRequirementPoints)}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    + Add Requirement
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tech Stack</label>
                <div className="space-y-2">
                  {techStackPoints.map((point, index) => (
                    <div key={`tech-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(setTechStackPoints, index, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder={`Tech ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePoint(setTechStackPoints, index)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addPoint(setTechStackPoints)}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    + Add Tech
                  </button>
                </div>
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

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    min={todayDate}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    category: "",
                    description: "",
                    location: "",
                    workType: "",
                    applicationDeadline: "",
                  });
                  setResponsibilityPoints(parsePoints(""));
                  setKeyRequirementPoints(parsePoints(""));
                  setTechStackPoints(parsePoints(""));
                  setDurationUnit("MONTHS");
                  setDurationValue("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={loading}
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