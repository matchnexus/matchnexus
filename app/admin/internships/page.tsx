import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminInternships } from "@/server/admin/internships";
import { formatDate } from "@/lib/format";

type InternshipRow = Awaited<ReturnType<typeof getAdminInternships>>[number];

export default async function AdminInternshipsPage() {
  const internships = await getAdminInternships();

  if (!internships.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Internships"
          description="Manage internship posts, requirements, and application activity."
        />
        <EmptyState
          title="No internship posts found"
          description="Internship posts will appear here after companies create them."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internships"
        description="Manage internship posts, requirements, and application activity."
      />

      <SimpleTable<InternshipRow>
        columns={[
          {
            key: "title",
            title: "Post",
            render: (row) => (
              <div>
                <p className="font-semibold text-gray-900">{row.title}</p>
                <p className="text-xs text-gray-500">
                  {row.company.companyName}
                </p>
              </div>
            ),
          },
          {
            key: "type",
            title: "Work Type",
            render: (row) => row.workType ?? "-",
          },
          {
            key: "requiredSkills",
            title: "Required Skills",
            render: (row) => row.requiredSkills.length,
          },
          {
            key: "optionalSkills",
            title: "Optional Skills",
            render: (row) => row.optionalSkills.length,
          },
          {
            key: "applications",
            title: "Applications",
            render: (row) => row.applications.length,
          },
          {
            key: "deadline",
            title: "Deadline",
            render: (row) => formatDate(row.applicationDeadline),
          },
          {
            key: "status",
            title: "Status",
            render: (row) => <StatusBadge value={row.status} />,
          },
          {
            key: "createdAt",
            title: "Created",
            render: (row) => formatDate(row.createdAt),
          },
        ]}
        rows={internships}
      />
    </div>
  );
}