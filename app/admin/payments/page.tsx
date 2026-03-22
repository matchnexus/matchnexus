import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SectionCard } from "@/components/admin/shared/SectionCard";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { SimpleTable } from "@/components/admin/tables/SimpleTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import {
  getAdminPayments,
  getAdminBoostedPosts,
} from "@/server/admin/payments";
import { formatDate, formatCurrency } from "@/lib/format";

export default async function AdminPaymentsPage() {
  const [payments, boostedPosts] = await Promise.all([
    getAdminPayments(),
    getAdminBoostedPosts(),
  ]);

  type PaymentRow = (typeof payments)[number];
  type BoostedPostRow = (typeof boostedPosts)[number];

  if (!payments.length && !boostedPosts.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Payments"
          description="Track payments, products, and boosted internship posts."
        />
        <EmptyState
          title="No payment data found"
          description="Payment and boosted post records will appear here after transactions."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track payments, products, and boosted internship posts."
      />

      <SectionCard title="Payments">
        {payments.length ? (
          <SimpleTable<PaymentRow>
            columns={[
              {
                key: "payer",
                title: "Payer",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {row.company?.companyName ??
                        (row.student
                          ? `${row.student.firstName} ${row.student.lastName}`
                          : "-")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {row.company?.corporateEmail ??
                        row.student?.user?.email ??
                        "-"}
                    </p>
                  </div>
                ),
              },
              {
                key: "product",
                title: "Product",
                render: (row) => row.product?.name ?? "-",
              },
              {
                key: "provider",
                title: "Provider",
                render: (row) => row.provider ?? "-",
              },
              {
                key: "amount",
                title: "Amount",
                render: (row) => formatCurrency(row.amount.toString()),
              },
              {
                key: "status",
                title: "Status",
                render: (row) => <StatusBadge value={row.status} />,
              },
              {
                key: "events",
                title: "Events",
                render: (row) => row.events.length,
              },
              {
                key: "created",
                title: "Created",
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={payments}
          />
        ) : (
          <EmptyState
            title="No payments"
            description="Payment records are not available yet."
          />
        )}
      </SectionCard>

      <SectionCard title="Boosted Posts">
        {boostedPosts.length ? (
          <SimpleTable<BoostedPostRow>
            columns={[
              {
                key: "post",
                title: "Post",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {row.post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {row.post.company.companyName}
                    </p>
                  </div>
                ),
              },
              {
                key: "package",
                title: "Package",
                render: (row) => row.package?.name ?? "-",
              },
              {
                key: "startAt",
                title: "Starts",
                render: (row) => formatDate(row.startAt),
              },
              {
                key: "endAt",
                title: "Ends",
                render: (row) => formatDate(row.endAt),
              },
              {
                key: "status",
                title: "Status",
                render: (row) => <StatusBadge value={row.status} />,
              },
              {
                key: "created",
                title: "Created",
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={boostedPosts}
          />
        ) : (
          <EmptyState
            title="No boosted posts"
            description="Boosted internship posts are not available yet."
          />
        )}
      </SectionCard>
    </div>
  );
}