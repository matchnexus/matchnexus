import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminCompanies } from "@/server/admin/companies";
import { formatDate } from "@/lib/format";

type CompanyRow = Awaited<ReturnType<typeof getAdminCompanies>>[number];

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

      <SimpleTable<CompanyRow>
        columns={[
          {
            key: "company",
            title: "Company",
            render: (row) => (
              <div>
                <p className="font-semibold text-gray-900">{row.companyName}</p>
                <p className="text-xs text-gray-500">{row.corporateEmail}</p>
              </div>
            ),
          },
          {
            key: "domain",
            title: "Domain",
            render: (row) => row.emailDomain,
          },
          {
            key: "industry",
            title: "Industry",
            render: (row) => row.profile?.industry ?? "-",
          },
          {
            key: "posts",
            title: "Posts",
            render: (row) => row.posts.length,
          },
          {
            key: "payments",
            title: "Payments",
            render: (row) => row.payments.length,
          },
          {
            key: "verification",
            title: "Verification",
            render: (row) => <StatusBadge value={row.verificationStatus} />,
          },
          {
            key: "created",
            title: "Created",
            render: (row) => formatDate(row.createdAt),
          },
        ]}
        rows={companies}
      />
    </div>
  );
}