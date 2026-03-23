import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SectionCard } from "@/components/admin/shared/SectionCard";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { getAdminDashboardStats } from "@/server/admin/dashboard";
import { formatDate } from "@/lib/format";
import {
  HiAcademicCap,
  HiOfficeBuilding,
  HiBadgeCheck,
  HiBriefcase,
  HiDocumentText,
  HiBookOpen,
  HiCreditCard,
  HiSparkles,
  HiMail,
  HiClock,
} from "react-icons/hi";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardStats();

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-1">
      <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-100">
        <PageHeader
          title="Dashboard"
          description="Platform overview for students, companies, verifications, posts, and payments."
        />
        <div className="mt-4 flex items-center gap-2 text-sm text-white/90">
          <HiSparkles className="h-5 w-5" />
          <span>Welcome to the MatchNexus admin overview panel</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-1 shadow-md shadow-emerald-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard label="Students" value={data.studentsCount} />
          <div className="px-5 pb-5 text-emerald-600">
            <HiAcademicCap className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white p-1 shadow-md shadow-sky-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard label="Companies" value={data.companiesCount} />
          <div className="px-5 pb-5 text-sky-600">
            <HiOfficeBuilding className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-1 shadow-md shadow-amber-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard
            label="Pending Verifications"
            value={data.pendingVerificationsCount}
          />
          <div className="px-5 pb-5 text-amber-500">
            <HiBadgeCheck className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-1 shadow-md shadow-violet-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard label="Active Posts" value={data.activePostsCount} />
          <div className="px-5 pb-5 text-violet-600">
            <HiBriefcase className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-1 shadow-md shadow-blue-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard label="Applications" value={data.applicationsCount} />
          <div className="px-5 pb-5 text-blue-600">
            <HiDocumentText className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-1 shadow-md shadow-pink-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard label="Courses" value={data.coursesCount} />
          <div className="px-5 pb-5 text-pink-600">
            <HiBookOpen className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-1 shadow-md shadow-green-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard
            label="Successful Payments"
            value={data.successfulPaymentsCount}
          />
          <div className="px-5 pb-5 text-green-600">
            <HiCreditCard className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-100/40">
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
                <HiOfficeBuilding className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Companies
                </h2>
                <p className="text-sm text-gray-500">
                  Newly joined companies and verification progress
                </p>
              </div>
            </div>
          </div>

          <SectionCard title="">
            <div className="space-y-4">
              {data.recentCompanies.length > 0 ? (
                data.recentCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="group flex items-start justify-between rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-900 group-hover:text-emerald-700">
                        {company.companyName}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <HiMail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{company.corporateEmail}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <HiClock className="h-4 w-4" />
                        <span>Joined {formatDate(company.createdAt)}</span>
                      </div>
                    </div>

                    <div className="ml-4 shrink-0">
                      <StatusBadge value={company.verificationStatus} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                  No recent companies found.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg shadow-violet-100/40">
          <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                <HiBriefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Internship Posts
                </h2>
                <p className="text-sm text-gray-500">
                  Latest internship opportunities published on the platform
                </p>
              </div>
            </div>
          </div>

          <SectionCard title="">
            <div className="space-y-4">
              {data.recentPosts.length > 0 ? (
                data.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group flex items-start justify-between rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-900 group-hover:text-violet-700">
                        {post.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <HiOfficeBuilding className="h-4 w-4 text-gray-400" />
                        <span className="truncate">
                          {post.company.companyName}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <HiClock className="h-4 w-4" />
                        <span>Created {formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    <div className="ml-4 shrink-0">
                      <StatusBadge value={post.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                  No recent internship posts found.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}