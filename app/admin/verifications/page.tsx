import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { getAdminVerifications } from "@/server/admin/verifications";
import { AdminVerificationsView } from "@/components/admin/verifications/AdminVerificationsView";

export default async function AdminVerificationsPage() {
  const companies = await getAdminVerifications();

  if (!companies.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Verifications"
          description="Monitor pending company verification queue."
        />
        <EmptyState
          title="No pending verifications"
          description="All current company verifications are processed."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifications"
        description="Monitor pending company verification queue."
      />

      <AdminVerificationsView companies={companies} />
    </div>
  );
}