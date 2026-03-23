import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import {
  getAdminRecommendationScores,
  getAdminApplicationScores,
} from "@/server/admin/matching";
import { AdminMatchingView } from "@/components/admin/matching/AdminMatchingView";

export default async function AdminMatchingPage() {
  const [recommendations, applicationScores] = await Promise.all([
    getAdminRecommendationScores(),
    getAdminApplicationScores(),
  ]);

  if (!recommendations.length && !applicationScores.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Matching"
          description="Review recommendation scores and ML ranking outputs."
        />
        <EmptyState
          title="No matching data found"
          description="Recommendation and ML scoring records will appear here after matching runs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matching"
        description="Review recommendation scores and ML ranking outputs."
      />

      <AdminMatchingView
        recommendations={recommendations}
        applicationScores={applicationScores}
      />
    </div>
  );
}