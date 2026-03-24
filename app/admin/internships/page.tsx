import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { getAdminInternships } from "@/server/admin/internships";
import { AdminInternshipsView } from "@/components/admin/internships/AdminInternshipsView";

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

      <AdminInternshipsView internships={internships} />
    </div>
  );
}