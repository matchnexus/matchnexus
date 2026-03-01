import { Badge, Card } from "flowbite-react";
import Link from "next/link";

const demoJobs = [
  { id: "1", title: "Frontend Intern (Next.js)", company: "Acme Labs", location: "Remote", type: "Internship" },
  { id: "2", title: "Data Science Intern", company: "Zen Analytics", location: "Colombo", type: "Internship" },
  { id: "3", title: "Cloud Support Intern", company: "Nimbus Cloud", location: "Hybrid", type: "Internship" },
];

export default function JobsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        <p className="mt-1 text-gray-600">
          Public jobs listing (demo data). Later we will load from the database and show ML ranking.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {demoJobs.map((job) => (
          <Card key={job.id} className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
              </div>
              <Badge color="info">{job.type}</Badge>
            </div>

            <div className="mt-3 flex gap-3">
              <Link
                href={`/jobs/${job.id}`}
                className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
              >
                View details
              </Link>
              <span className="text-sm text-gray-400">•</span>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
              >
                Login to apply
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
