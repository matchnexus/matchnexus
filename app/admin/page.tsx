import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SectionCard } from "@/components/admin/shared/SectionCard";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminDashboardStats } from "@/server/admin/dashboard";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Platform overview for students, companies, verifications, posts, and payments."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Students" value={data.studentsCount} />
        <StatsCard label="Companies" value={data.companiesCount} />
        <StatsCard
          label="Pending Verifications"
          value={data.pendingVerificationsCount}
        />
        <StatsCard label="Active Posts" value={data.activePostsCount} />
        <StatsCard label="Applications" value={data.applicationsCount} />
        <StatsCard label="Courses" value={data.coursesCount} />
        <StatsCard
          label="Successful Payments"
          value={data.successfulPaymentsCount}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recent Companies">
          <div className="space-y-4">
            {data.recentCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-start justify-between rounded-xl border border-gray-100 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {company.companyName}
                  </p>
                  <p className="text-sm text-gray-600">{company.corporateEmail}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Joined {formatDate(company.createdAt)}
                  </p>
                </div>
                <StatusBadge value={company.verificationStatus} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Internship Posts">
          <div className="space-y-4">
            {data.recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between rounded-xl border border-gray-100 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{post.title}</p>
                  <p className="text-sm text-gray-600">
                    {post.company.companyName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Created {formatDate(post.createdAt)}
                  </p>
                </div>
                <StatusBadge value={post.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}