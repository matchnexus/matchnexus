import { Card } from "flowbite-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-6">
      {/* HERO */}
      <section className="relative min-h-[520px] w-full overflow-hidden">
        {/* Background image (place file at: /public/photos/hero.jpg) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/photos/hero.jpg')" }}
        />

        {/* Blue overlay like the screenshot */}
        {<div className="absolute inset-0 bg-sky-700/70" />}

        {/* Hero content */}
        <div className="relative mx-auto flex max-w-11xl flex-col items-center px-6 pt-40 text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Give your Career a Jumpstart
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/90 md:text-base">
            MatchNexus is a smart ML-powered internship platform connecting students and verified companies.
            Discover opportunities, build skills, and apply faster with intelligent matching.
          </p>

          {/* Search bar mock (like screenshot) */}
          <div className="mt-10 w-full max-w-5xl rounded-2xl bg-white p-3 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-400"
                placeholder="I'm looking for... (Eg: Job title, Position, Company)"
              />

              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none md:w-56">
                <option>Job Category</option>
                <option>Software Engineering</option>
                <option>Data Science</option>
                <option>UI/UX</option>
              </select>

              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none md:w-44">
                <option>Location</option>
                <option>Colombo</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>

              <Link
                href="/jobs"
                className="rounded-xl bg-lime-500 px-8 py-3 text-center text-sm font-extrabold text-white hover:bg-lime-400 md:w-48"
              >
                SEARCH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT BELOW HERO


hi





      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <h2 className="text-lg font-semibold">Verified Companies</h2>
            <p className="text-gray-600">
              Domain-locked registration helps reduce fake job postings and improves trust.
            </p>
          </Card>

          <Card className="rounded-2xl">
            <h2 className="text-lg font-semibold">Skill-Matched Feed</h2>
            <p className="text-gray-600">
              Students see roles aligned to their skills using ML matching and ranking.
            </p>
          </Card>

          <Card className="rounded-2xl">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-gray-600">
              Admins can verify companies, moderate jobs, and manage platform operations.
            </p>
          </Card>
        </div>
      </section> */}
    </div>
  );
}