import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import {
  getAdminPayments,
  getAdminBoostedPosts,
} from "@/server/admin/payments";
import { AdminPaymentsView } from "@/components/admin/payments/AdminPaymentsView";

export default async function AdminPaymentsPage() {
  const [payments, boostedPosts] = await Promise.all([
    getAdminPayments(),
    getAdminBoostedPosts(),
  ]);

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

      <AdminPaymentsView payments={payments} boostedPosts={boostedPosts} />
    </div>
  );
}