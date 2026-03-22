import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SectionCard } from "@/components/admin/shared/SectionCard";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import {
  getAdminRecommendationScores,
  getAdminApplicationScores,
} from "@/server/admin/matching";
import { formatDate } from "@/lib/format";

type RecommendationRow = Awaited<
  ReturnType<typeof getAdminRecommendationScores>
>[number];
type ApplicationMlRow = Awaited<
  ReturnType<typeof getAdminApplicationScores>
>[number];

export default async function AdminMatchingPage() {
  const [recommendations, applicationScores] = await Promise.all([
    getAdminRecommendationScores(),
    getAdminApplicationScores(),
  ]);

  if (!recommendations.length && !applicationScores.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Matching"
          description="Review recommendation scores and ML ranking outputs."
        />
        <EmptyState
          title="No matching data found"
          description="Recommendation and ML scoring records will appear here after matching runs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matching"
        description="Review recommendation scores and ML ranking outputs."
      />

      <SectionCard title="Recommendation Scores">
        {recommendations.length ? (
          <SimpleTable<RecommendationRow>
            columns={[
              {
                key: "student",
                title: "Student",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {row.student.firstName} {row.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {row.student.user.email}
                    </p>
                  </div>
                ),
              },
              {
                key: "post",
                title: "Post",
                render: (row) => (
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
                render: (row) => row.context,
              },
              {
                key: "score",
                title: "Score",
                render: (row) => row.score,
              },
              {
                key: "rank",
                title: "Rank",
                render: (row) => row.rank ?? "-",
              },
              {
                key: "reason",
                title: "Reason",
                render: (row) => row.reason ?? "-",
              },
              {
                key: "created",
                title: "Created",
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={recommendations}
          />
        ) : (
          <EmptyState
            title="No recommendation scores"
            description="Recommendation score records are not available yet."
          />
        )}
      </SectionCard>

      <SectionCard title="Application ML Scores">
        {applicationScores.length ? (
          <SimpleTable<ApplicationMlRow>
            columns={[
              {
                key: "student",
                title: "Student",
                render: (row) => (
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
                render: (row) => (
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
                render: (row) => row.overallScore.toString(),
              },
              {
                key: "required",
                title: "Required Skills",
                render: (row) => row.requiredSkillsScore.toString(),
              },
              {
                key: "optional",
                title: "Optional Skills",
                render: (row) => row.optionalSkillsScore.toString(),
              },
              {
                key: "education",
                title: "Education",
                render: (row) => row.educationScore.toString(),
              },
              {
                key: "experience",
                title: "Experience",
                render: (row) => row.experienceScore.toString(),
              },
              {
                key: "rank",
                title: "Rank",
                render: (row) => row.rankPosition,
              },
              {
                key: "recommended",
                title: "Recommended",
                render: (row) => (row.isRecommended ? "Yes" : "No"),
              },
              {
                key: "calculated",
                title: "Calculated",
                render: (row) => formatDate(row.calculatedAt),
              },
            ]}
            rows={applicationScores}
          />
        ) : (
          <EmptyState
            title="No application ML scores"
            description="Application ML score records are not available yet."
          />
        )}
      </SectionCard>
    </div>
  );
}