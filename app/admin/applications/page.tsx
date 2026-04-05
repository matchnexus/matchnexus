import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { getAdminApplications } from "@/server/admin/applications";
import { AdminApplicationsView } from "@/components/admin/applications/AdminApplicationsView";


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

      <AdminApplicationsView applications={applications} />
    </div>
  );
}