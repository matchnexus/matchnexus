"use client";

import { useEffect, useState } from "react";

type CompanyProfileForm = {
  websiteUrl: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  headquartersLocation: string;
  description: string;
  missionStatement: string;
  workCulture: string;
  benefits: string;
  linkedinUrl: string;
};

export default function CompanyProfilePage() {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const [formData, setFormData] = useState<CompanyProfileForm>({
    websiteUrl: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    headquartersLocation: "",
    description: "",
    missionStatement: "",
    workCulture: "",
    benefits: "",
    linkedinUrl: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [savedProfile, setSavedProfile] = useState<CompanyProfileForm | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    const storedCompanyName = localStorage.getItem("companyName") || "";
    const storedCompanyEmail =
      localStorage.getItem("companyEmail") || localStorage.getItem("companyLoginEmail") || "";

    setCompanyId(storedCompanyId);
    setCompanyName(storedCompanyName);
    setCompanyEmail(storedCompanyEmail);

    if (!storedCompanyId && !storedCompanyEmail) {
      setIsError(true);
      setMessage("Company session not found. Please login again.");
      return;
    }

    const loadProfile = async () => {
      try {
        const query = storedCompanyId
          ? `companyId=${storedCompanyId}`
          : `corporateEmail=${encodeURIComponent(storedCompanyEmail)}`;
        const res = await fetch(`/api/company/profile?${query}`);
        const data = await res.json();

        if (!res.ok) {
          setIsError(true);
          setMessage(data.error || "Failed to load profile");
          return;
        }

        if (data.company) {
          if (data.company.id) {
            setCompanyId(data.company.id);
            localStorage.setItem("companyId", data.company.id);
          }
          if (data.company.companyName) setCompanyName(data.company.companyName);
          if (data.company.corporateEmail) setCompanyEmail(data.company.corporateEmail);
        }

        if (data.profile) {
          const profileFromApi = {
            websiteUrl: data.profile.websiteUrl || "",
            industry: data.profile.industry || "",
            companySize: data.profile.companySize || "",
            foundedYear: data.profile.foundedYear ? String(data.profile.foundedYear) : "",
            headquartersLocation: data.profile.headquartersLocation || "",
            description: data.profile.description || "",
            missionStatement: data.profile.missionStatement || "",
            workCulture: data.profile.workCulture || "",
            benefits: data.profile.benefits || "",
            linkedinUrl: data.profile.linkedinUrl || "",
          };

          setFormData(profileFromApi);

          const hasAnyProfileDetail = Object.values(profileFromApi).some(
            (value) => value.trim().length > 0
          );

          if (hasAnyProfileDetail) {
            setSavedProfile(profileFromApi);
            setIsEditMode(false);
          }
        }
      } catch (error) {
        setIsError(true);
        setMessage("Failed to load profile details");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      setMessage("Company ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      const res = await fetch("/api/company/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          websiteUrl: formData.websiteUrl,
          industry: formData.industry,
          companySize: formData.companySize,
          foundedYear: formData.foundedYear
            ? Number(formData.foundedYear)
            : null,
          headquartersLocation: formData.headquartersLocation,
          description: formData.description,
          missionStatement: formData.missionStatement,
          workCulture: formData.workCulture,
          benefits: formData.benefits,
          linkedinUrl: formData.linkedinUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to save profile");
        return;
      }

      setIsError(false);
      setSavedProfile({ ...formData });
      setIsEditMode(false);
      setMessage(data.message || "Profile saved successfully");
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayValue = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : "Not provided";
  };

  const profileToShow = savedProfile || formData;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-800">Set Up Company Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in your company details below to complete your profile setup.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-indigo-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Website URL</label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Software, Finance..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Company Size</label>
                  <input
                    type="text"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="11-50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="2018"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-indigo-700">Headquarters Location</label>
                <input
                  type="text"
                  name="headquartersLocation"
                  value={formData.headquartersLocation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Colombo, Sri Lanka"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-indigo-700">Company Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="What does your company do?"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Mission Statement</label>
                  <textarea
                    name="missionStatement"
                    value={formData.missionStatement}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Your mission and long-term vision"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Work Culture</label>
                  <textarea
                    name="workCulture"
                    value={formData.workCulture}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Describe your team culture"
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-indigo-700">Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Health insurance, remote options, training support..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Saving Profile..." : "Save Company Profile"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(true);
                    setMessage("");
                  }}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Name</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(companyName)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Corporate Email</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(companyEmail)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Website URL</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.websiteUrl)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn URL</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.linkedinUrl)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Industry</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.industry)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Size</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.companySize)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Founded Year</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.foundedYear)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Headquarters Location</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.headquartersLocation)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.description)}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mission Statement</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.missionStatement)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Work Culture</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.workCulture)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Benefits</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.benefits)}</p>
              </div>
            </div>
          )}

          {message && (
            <p
              className={`mt-4 rounded-lg border px-3 py-2 text-center text-sm font-medium ${
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
    </div>
  );
}