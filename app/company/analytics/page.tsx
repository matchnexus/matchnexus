export default function CompanyAnalyticsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track post performance, engagement, and candidate activity from this area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Posts</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">-</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Applications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">-</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Profile Views</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">-</p>
        </div>
      </div>
    </section>
  );
}
