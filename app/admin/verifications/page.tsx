import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminVerifications } from "@/server/admin/verifications";
import { formatDate } from "@/lib/format";

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

      <SimpleTable
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
            key: "attempts",
            title: "Attempt Count",
            render: (row) => row.verification?.attemptCount ?? 0,
          },
          {
            key: "tokenExpiry",
            title: "Token Expires",
            render: (row) => formatDate(row.verification?.tokenExpiresAt),
          },
          {
            key: "website",
            title: "Website",
            render: (row) => row.profile?.websiteUrl ?? "-",
          },
          {
            key: "status",
            title: "Status",
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