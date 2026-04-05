"use client";

import { useEffect, useState } from "react";
import { HiChartBar, HiAcademicCap, HiBriefcase, HiCheckCircle } from "react-icons/hi";

type ApplicantRow = {
  applicationId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  overallScore: number;
  requiredSkillsScore: number;
  optionalSkillsScore: number;
  educationScore: number;
  experienceScore: number;
  rankPosition: number;
  isRecommended: boolean;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  reason: string;
  cvSkills: string[];
};

type RankPost = {
  id: string;
  postTitle: string;
  companyName: string;
  applicants: ApplicantRow[];
};

export default function CompanyAnalyticsPage() {
  const [companyId, setCompanyId] = useState("");
  const [rankings, setRankings] = useState<RankPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    setCompanyId(storedCompanyId);
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/company/analytics?companyId=${companyId}`);
        const data = await res.json();

        if (!res.ok) {
          setRankings([]);
          setMessage(data.error || "Failed to load analytics");
          return;
        }

        setRankings(data.rankings || []);
        setMessage((data.rankings || []).length ? null : "No ranked applicants yet.");
      } catch {
        setRankings([]);
        setMessage("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  const totalApplicants = rankings.reduce((count, post) => count + post.applicants.length, 0);
  const recommendedApplicants = rankings.reduce(
    (count, post) => count + post.applicants.filter((applicant) => applicant.isRecommended).length,
    0
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ranked applicants are computed from the uploaded CV, profile skills, and post requirements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Posts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{rankings.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Applications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalApplicants}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Recommended Candidates</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{recommendedApplicants}</p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          {message}
        </div>
      )}

      {loading && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading ranked applicants...</p>
        </div>
      )}

      <div className="space-y-6">
        {rankings.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-cyan-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600">
                  <HiBriefcase className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{post.postTitle}</h2>
                  <p className="text-sm text-gray-500">{post.companyName}</p>
                </div>
              </div>

              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {post.applicants.length} ranked applicants
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {post.applicants.map((applicant) => (
                  <div
                    key={applicant.applicationId}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md">
                          <HiAcademicCap className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {applicant.firstName} {applicant.lastName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">{applicant.email}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                        #{applicant.rankPosition}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-lg font-bold text-blue-700">{applicant.overallScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Overall</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">{applicant.isRecommended ? "Yes" : "No"}</p>
                        <p className="text-xs font-medium text-gray-500">Recommended</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.requiredSkillsScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Required</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.optionalSkillsScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Optional</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.educationScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Education</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-700">{applicant.experienceScore.toFixed(1)}</p>
                        <p className="text-xs font-medium text-gray-500">Experience</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <HiCheckCircle className="h-4 w-4 text-cyan-600" />
                        Match reason
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{applicant.reason}</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-800">CV skills detected</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {applicant.cvSkills.length ? (
                          applicant.cvSkills.map((skill) => (
                            <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No skills detected from CV</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
