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

const EMPTY_PROFILE_FORM: CompanyProfileForm = {
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
};

const hasAnyProfileDetail = (profile: CompanyProfileForm) =>
  Object.values(profile).some((value) => value.trim().length > 0);

const buildProfileCacheKey = (companyId: string, companyEmail: string) =>
  `companyProfile:${companyId || companyEmail || "default"}`;

const COMPANY_SIZE_PATTERN = /^\d+\s*-\s*\d+$|^\d+\+$/;
const COMPANY_SIZE_MAX_LENGTH = 12;
const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001+",
];

export default function CompanyProfilePage() {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const [formData, setFormData] = useState<CompanyProfileForm>(EMPTY_PROFILE_FORM);

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

    const initialCacheKey = buildProfileCacheKey(storedCompanyId, storedCompanyEmail);
    const cachedProfileRaw = localStorage.getItem(initialCacheKey);

    if (cachedProfileRaw) {
      try {
        const cachedProfile = JSON.parse(cachedProfileRaw) as CompanyProfileForm;
        if (hasAnyProfileDetail(cachedProfile)) {
          setFormData(cachedProfile);
          setSavedProfile(cachedProfile);
          setIsEditMode(false);
        }
      } catch {
        localStorage.removeItem(initialCacheKey);
      }
    }

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

          if (hasAnyProfileDetail(profileFromApi)) {
            setSavedProfile(profileFromApi);
            setIsEditMode(false);
            const freshCacheKey = buildProfileCacheKey(
              data.company?.id || storedCompanyId,
              data.company?.corporateEmail || storedCompanyEmail
            );
            localStorage.setItem(freshCacheKey, JSON.stringify(profileFromApi));
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "companySize") {
      const sanitizedValue = e.target.value
        .replace(/[^0-9+\-\s]/g, "")
        .slice(0, COMPANY_SIZE_MAX_LENGTH);
      setFormData({
        ...formData,
        [e.target.name]: sanitizedValue,
      });
      return;
    }

    if (e.target.name === "foundedYear") {
      const sanitizedYear = e.target.value.replace(/\D/g, "").slice(0, 4);
      setFormData({
        ...formData,
        [e.target.name]: sanitizedYear,
      });
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFoundedYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length > 1) return;

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const normalizedCompanySize = formData.companySize.trim();
    const foundedYearRaw = formData.foundedYear.trim();
    const currentYear = new Date().getFullYear();

    if (!companyId) {
      setIsError(true);
      setMessage("Company ID not found. Please login again.");
      return;
    }

    if (normalizedCompanySize) {
      if (normalizedCompanySize.length > COMPANY_SIZE_MAX_LENGTH) {
        setIsError(true);
        setMessage(`Company Size must be ${COMPANY_SIZE_MAX_LENGTH} characters or fewer`);
        return;
      }

      if (!COMPANY_SIZE_PATTERN.test(normalizedCompanySize)) {
        setIsError(true);
        setMessage("Company Size must be in format 11-50 or 200+");
        return;
      }

      if (normalizedCompanySize.includes("-")) {
        const [minRaw, maxRaw] = normalizedCompanySize.split("-").map((part) => part.trim());
        const min = Number(minRaw);
        const max = Number(maxRaw);

        if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
          setIsError(true);
          setMessage("Company Size range is invalid. Example: 11-50");
          return;
        }
      }
    }

    if (foundedYearRaw) {
      const foundedYear = Number(foundedYearRaw);
      if (!/^\d{4}$/.test(foundedYearRaw) || foundedYear > currentYear) {
        setIsError(true);
        setMessage(`Founded Year cannot be greater than ${currentYear}`);
        return;
      }
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
          companySize: normalizedCompanySize,
          foundedYear: foundedYearRaw ? Number(foundedYearRaw) : null,
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
      const normalizedFormData = {
        ...formData,
        companySize: normalizedCompanySize,
        foundedYear: foundedYearRaw,
      };
      setFormData(normalizedFormData);
      setSavedProfile(normalizedFormData);
      setIsEditMode(false);
      localStorage.setItem(
        buildProfileCacheKey(companyId, companyEmail),
        JSON.stringify(normalizedFormData)
      );
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
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-indigo-800">Set Up Company Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in your company details below to complete your profile setup.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-indigo-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-slate-50/80 px-3 py-2 text-sm text-gray-700"
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
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select company size</option>
                    {COMPANY_SIZE_OPTIONS.map((sizeOption) => (
                      <option key={sizeOption} value={sizeOption}>
                        {sizeOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-indigo-700">Founded Year</label>
                  <input
                    type="text"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    onKeyDown={handleFoundedYearKeyDown}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
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
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Name</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(companyName)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Corporate Email</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(companyEmail)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Website URL</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.websiteUrl)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn URL</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.linkedinUrl)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Industry</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.industry)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Size</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.companySize)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Founded Year</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.foundedYear)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Headquarters Location</p>
                  <p className="mt-1 text-sm text-gray-800">{displayValue(profileToShow.headquartersLocation)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.description)}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mission Statement</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.missionStatement)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Work Culture</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{displayValue(profileToShow.workCulture)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3">
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