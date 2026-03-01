import { Card } from "flowbite-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Card className="rounded-2xl">
      <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
      <p className="mt-2 text-gray-600">
        This is a placeholder. Next step: implement authentication (Student/Company/Admin roles).
      </p>

      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
        For now, users who are not logged in can only view public pages.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="text-sm font-medium text-gray-900 underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    </Card>
  );
}
