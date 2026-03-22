import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminApplications } from "@/server/admin/applications";
import { formatDate } from "@/lib/format";

type ApplicationRow = Awaited<
  ReturnType<typeof getAdminApplications>
>[number];

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications();

  if (!applications.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Applications"
          description="Monitor student applications, statuses, and ML scoring results."
        />
        <EmptyState
          title="No applications found"
          description="Applications will appear here after students apply for internships."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Monitor student applications, statuses, and ML scoring results."
      />

      <SimpleTable<ApplicationRow>
        columns={[
          {
            key: "student",
            title: "Student",
            render: (row) => (
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
            title: "Internship",
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
            key: "status",
            title: "Status",
            render: (row) => <StatusBadge value={row.status} />,
          },
          {
            key: "score",
            title: "ML Score",
            render: (row) =>
              row.mlScore?.overallScore !== null &&
              row.mlScore?.overallScore !== undefined
                ? row.mlScore.overallScore.toString()
                : "-",
          },
          {
            key: "rank",
            title: "Rank",
            render: (row) =>
              row.mlScore?.rankPosition !== null &&
              row.mlScore?.rankPosition !== undefined
                ? row.mlScore.rankPosition
                : "-",
          },
          {
            key: "recommended",
            title: "Recommended",
            render: (row) =>
              row.mlScore?.isRecommended ? (
                <StatusBadge value="ACTIVE" />
              ) : (
                <StatusBadge value="INACTIVE" />
              ),
          },
          {
            key: "appliedAt",
            title: "Applied",
            render: (row) => formatDate(row.appliedAt),
          },
        ]}
        rows={applications}
      />
    </div>
  );
}