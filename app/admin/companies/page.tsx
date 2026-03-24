import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { getAdminCompanies } from "@/server/admin/companies";
import { AdminCompaniesView } from "@/components/admin/companies/AdminCompaniesView";

export default async function AdminCompaniesPage() {
  const companies = await getAdminCompanies();

  if (!companies.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Companies"
          description="Review company accounts, profiles, posts, and payments."
        />
        <EmptyState
          title="No companies found"
          description="Company records will appear here after registration."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Review company accounts, profiles, posts, and payments."
      />

      <AdminCompaniesView companies={companies} />
    </div>
  );
}