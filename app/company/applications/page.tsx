const requiredDetails = [
  "Student name",
  "Student email",
  "Internship post title",
  "Applied date",
  "Application status (NEW, SHORTLISTED, REJECTED)",
  "CV or portfolio link",
  "Skills match summary",
];

const optionalDetails = [
  "ML score",
  "Rank position",
  "Interview date and time",
  "Recruiter notes",
  "Expected stipend",
];

export default function CompanyApplicationsPage() {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">Applications</h1>
        <p className="mt-2 text-sm text-gray-600">
          This tab is now active. Add the details below to make application handling easy for company users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">Required Details</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {requiredDetails.map((item) => (
              <li key={item} className="rounded-md bg-slate-50/80 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">Optional Details</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {optionalDetails.map((item) => (
              <li key={item} className="rounded-md bg-slate-50/80 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Next step: connect this page to real application data from your API.
      </div>
    </section>
  );
}
