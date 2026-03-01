import { Card } from "flowbite-react";

export default function AdminPage() {
  return (
    <Card className="rounded-2xl">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
      <p className="mt-2 text-gray-600">
        Placeholder admin page. Later we will protect this route and add:
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-600">
        <li>Company verification (domain approvals)</li>
        <li>Job moderation (approve/reject/disable)</li>
        <li>User management (roles, suspend)</li>
        <li>Ads & payments monitoring</li>
      </ul>
    </Card>
  );
}
