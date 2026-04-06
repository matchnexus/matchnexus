"use client";

import { useMemo, useState } from "react";
import type { Decimal } from "@prisma/client/runtime/library";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { formatDate } from "@/lib/format";
import {
  HiOutlineTable,
  HiOutlineViewGrid,
  HiSparkles,
  HiAcademicCap,
  HiBriefcase,
  HiOfficeBuilding,
  HiChartBar,
  HiStar,
  HiCheckCircle,
  HiLightningBolt,
} from "react-icons/hi";

type RecommendationRow = {
  id: string;
  context: string;
  score: number | Decimal;
  rank: number | null;
  reason: string | null;
  createdAt: Date | string;
  student: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
  post: {
    title: string;
    company: {
      companyName: string;
    };
  };
};

type ApplicationScoreRow = {
  id: string;
  overallScore: Decimal | number;
  requiredSkillsScore: Decimal | number;
  optionalSkillsScore: Decimal | number;
  educationScore: Decimal | number;
  experienceScore: Decimal | number;
  rankPosition: number | null;
  isRecommended: boolean;
  calculatedAt: Date | string;
  application: {
    student: {
      firstName: string;
      lastName: string;
      user: {
        email: string;
      };
    };
    post: {
      title: string;
      company: {
        companyName: string;
      };
    };
  };
};

type Props = {
  recommendations: RecommendationRow[];
  applicationScores: ApplicationScoreRow[];
};

function scoreToText(value: Decimal | number | null | undefined) {
  return value != null ? value.toString() : "—";
}

export function AdminMatchingView({
  recommendations,
  applicationScores,
}: Props) {
  const [recommendationView, setRecommendationView] = useState<"table" | "card">("table");
  const [mlView, setMlView] = useState<"table" | "card">("table");
  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const [runMessage, setRunMessage] = useState<string | null>(null);

  async function handleRunMatching() {
    setIsRunningMatch(true);
    setRunMessage(null);

    try {
      const response = await fetch("/api/admin/matching/recompute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: "all" }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            message?: string;
            postsProcessed?: number;
            studentsProcessed?: number;
            applicationScoresComputed?: number;
            recommendationScoresComputed?: number;
            durationMs?: number;
          }
        | null;

      if (!response.ok) {
        setRunMessage(payload?.message ?? "Failed to run matching.");
        return;
      }

      const summary =
        `Matching complete. Posts: ${payload?.postsProcessed ?? 0}, ` +
        `Students: ${payload?.studentsProcessed ?? 0}, ` +
        `Application scores: ${payload?.applicationScoresComputed ?? 0}, ` +
        `Recommendations: ${payload?.recommendationScoresComputed ?? 0}` +
        (payload?.durationMs ? ` in ${payload.durationMs}ms.` : ".");

      setRunMessage(summary);
      window.location.reload();
    } catch {
      setRunMessage("Matching run failed due to a network or server error.");
    } finally {
      setIsRunningMatch(false);
    }
  }

  const recommendationColumns = useMemo(
    () => [
      {
        key: "student",
        title: "Student",
        render: (row: RecommendationRow) => (
          <div>
            <p className="font-semibold text-gray-900">
              {row.student.firstName} {row.student.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.student.user.email}</p>
          </div>
        ),
      },
      {
        key: "post",
        title: "Post",
        render: (row: RecommendationRow) => (
          <div>
            <p className="font-medium text-gray-900">{row.post.title}</p>
            <p className="text-xs text-gray-500">
              {row.post.company.companyName}
            </p>
          </div>
        ),
      },
      {
        key: "context",
        title: "Context",
        render: (row: RecommendationRow) => row.context,
      },
      {
        key: "score",
        title: "Score",
        render: (row: RecommendationRow) => scoreToText(row.score),
      },
      {
        key: "rank",
        title: "Rank",
        render: (row: RecommendationRow) => row.rank ?? "—",
      },
      {
        key: "reason",
        title: "Reason",
        render: (row: RecommendationRow) => row.reason ?? "—",
      },
      {
        key: "created",
        title: "Created",
        render: (row: RecommendationRow) => formatDate(row.createdAt),
      },
    ],
    []
  );

  const applicationColumns = useMemo(
    () => [
      {
        key: "student",
        title: "Student",
        render: (row: ApplicationScoreRow) => (
          <div>
            <p className="font-semibold text-gray-900">
              {row.application.student.firstName}{" "}
              {row.application.student.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {row.application.student.user.email}
            </p>
          </div>
        ),
      },
      {
        key: "post",
        title: "Post",
        render: (row: ApplicationScoreRow) => (
          <div>
            <p className="font-medium text-gray-900">
              {row.application.post.title}
            </p>
            <p className="text-xs text-gray-500">
              {row.application.post.company.companyName}
            </p>
          </div>
        ),
      },
      {
        key: "overall",
        title: "Overall Score",
        render: (row: ApplicationScoreRow) => scoreToText(row.overallScore),
      },
      {
        key: "required",
        title: "Required Skills",
        render: (row: ApplicationScoreRow) =>
          scoreToText(row.requiredSkillsScore),
      },
      {
        key: "optional",
        title: "Optional Skills",
        render: (row: ApplicationScoreRow) =>
          scoreToText(row.optionalSkillsScore),
      },
      {
        key: "education",
        title: "Education",
        render: (row: ApplicationScoreRow) =>
          scoreToText(row.educationScore),
      },
      {
        key: "experience",
        title: "Experience",
        render: (row: ApplicationScoreRow) =>
          scoreToText(row.experienceScore),
      },
      {
        key: "rank",
        title: "Rank",
        render: (row: ApplicationScoreRow) => row.rankPosition ?? "—",
      },
      {
        key: "recommended",
        title: "Recommended",
        render: (row: ApplicationScoreRow) =>
          row.isRecommended ? "Yes" : "No",
      },
      {
        key: "calculated",
        title: "Calculated",
        render: (row: ApplicationScoreRow) => formatDate(row.calculatedAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Matching Engine</h2>
            <p className="text-sm text-gray-500">
              Recompute recommendation and application ML scores using the latest data.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunMatching}
            disabled={isRunningMatch}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunningMatch ? "Running..." : "Run Matching Now"}
          </button>
        </div>

        {runMessage ? (
          <p className="mt-3 text-sm text-gray-700">{runMessage}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <HiSparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recommendation Scores</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommendations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <HiChartBar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Application ML Scores</p>
              <p className="text-2xl font-bold text-gray-900">
                {applicationScores.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
              <HiLightningBolt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Matching Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommendations.length + applicationScores.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <HiSparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recommendation Scores
              </h2>
              <p className="text-sm text-gray-500">
                Ranking suggestions generated before application scoring
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setRecommendationView("table")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                recommendationView === "table"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineTable className="h-5 w-5" />
              Table
            </button>

            <button
              type="button"
              onClick={() => setRecommendationView("card")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                recommendationView === "card"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineViewGrid className="h-5 w-5" />
              Cards
            </button>
          </div>
        </div>

        <div className="p-5">
          {recommendations.length ? (
            recommendationView === "table" ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <SimpleTable columns={recommendationColumns} rows={recommendations} />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {recommendations.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                          <HiAcademicCap className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {row.student.firstName} {row.student.lastName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {row.student.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        #{row.rank ?? "—"}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiBriefcase className="h-4 w-4 text-emerald-600" />
                        <span className="truncate">{row.post.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiOfficeBuilding className="h-4 w-4 text-emerald-600" />
                        <span className="truncate">
                          {row.post.company.companyName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-lg font-bold text-blue-700">
                          {scoreToText(row.score)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Score</p>
                      </div>
                      <div className="rounded-2xl bg-violet-50 p-3 text-center">
                        <p className="text-lg font-bold text-violet-700">
                          {row.context}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Context</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-700">Reason</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {row.reason ?? "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No recommendation scores"
              description="Recommendation score records are not available yet."
            />
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <HiChartBar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Application ML Scores
              </h2>
              <p className="text-sm text-gray-500">
                Detailed ML outputs for submitted applications
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMlView("table")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                mlView === "table"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineTable className="h-5 w-5" />
              Table
            </button>

            <button
              type="button"
              onClick={() => setMlView("card")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                mlView === "card"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <HiOutlineViewGrid className="h-5 w-5" />
              Cards
            </button>
          </div>
        </div>

        <div className="p-5">
          {applicationScores.length ? (
            mlView === "table" ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <SimpleTable columns={applicationColumns} rows={applicationScores} />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {applicationScores.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
                          <HiAcademicCap className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {row.application.student.firstName}{" "}
                            {row.application.student.lastName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {row.application.student.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        #{row.rankPosition ?? "—"}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiBriefcase className="h-4 w-4 text-blue-600" />
                        <span className="truncate">{row.application.post.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiOfficeBuilding className="h-4 w-4 text-blue-600" />
                        <span className="truncate">
                          {row.application.post.company.companyName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-center">
                        <p className="text-lg font-bold text-blue-700">
                          {scoreToText(row.overallScore)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Overall</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">
                          {row.isRecommended ? "Yes" : "No"}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          Recommended
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {scoreToText(row.requiredSkillsScore)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Required</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {scoreToText(row.optionalSkillsScore)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Optional</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {scoreToText(row.educationScore)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Education</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {scoreToText(row.experienceScore)}
                        </p>
                        <p className="text-xs font-medium text-gray-500">Experience</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="h-4 w-4 text-gray-500" />
                        <span>Calculated</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatDate(row.calculatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No application ML scores"
              description="Application ML score records are not available yet."
            />
          )}
        </div>
      </section>
    </div>
  );
}