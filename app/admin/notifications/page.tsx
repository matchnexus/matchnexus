import { PageHeader } from "@/components/admin/shared/PageHeader";
import { AdminNotificationsView } from "@/components/admin/notifications/AdminNotificationsView";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Create validation-checked notices for students and review recent announcements."
      />

      <AdminNotificationsView />
    </div>
  );
}
