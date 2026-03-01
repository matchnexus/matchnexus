import { Badge, Card } from "flowbite-react";
import Link from "next/link";

type Props = { params: { id: string } };

export default function JobDetailsPage({ params }: Props) {
  // Demo-only. Later: fetch from DB by params.id
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Job Details</h1>
        <p className="mt-1 text-gray-600">
          Job ID: <span className="font-medium">{params.id}</span> (demo)
        </p>
      </div>

      <Card className="rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sample Internship Role</h2>
            <p className="text-sm text-gray-600">Company Name • Location</p>
          </div>
          <Badge color="info">Internship</Badge>
        </div>

        <div className="mt-4 space-y-2 text-gray-600">
          <p><span className="font-medium text-gray-900">Requirements:</span> Next.js, TypeScript, Git</p>
          <p><span className="font-medium text-gray-900">Description:</span> This is placeholder content.</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Login to apply
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Back to Jobs
          </Link>
        </div>
      </Card>
    </div>
  );
}
