import { Card } from "flowbite-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      {/* FULL background (same format as About) */}
      <div className="fixed inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/photos/4427.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pt-24 pb-12">
        <Card className="rounded-2xl bg-white/85 backdrop-blur-md">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Terms & Conditions
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Last updated: <span className="font-medium text-gray-900">2026-03-01</span>
          </p>

          <p className="mt-4 text-gray-700">
            Welcome to <span className="font-semibold text-gray-900">MatchNexus</span>. By using this web application,
            you agree to these Terms & Conditions. If you do not agree, please stop using the platform.
          </p>

          <Section title="1. Platform Purpose">
            <p className="text-gray-700">
              MatchNexus is an internship matching platform that helps students discover internship opportunities and
              helps companies publish openings and manage applications. Some features may be released in phases.
            </p>
          </Section>

          <Section title="2. Accounts & Eligibility">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>We may require email/domain verification for certain user types.</li>
            </ul>
          </Section>

          <Section title="3. User Responsibilities">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Do not submit false, misleading, abusive, or illegal content.</li>
              <li>Do not attempt unauthorized access to accounts, data, or systems.</li>
              <li>Do not upload viruses, malware, spam, or harmful content.</li>
              <li>Respect other users, companies, and administrators.</li>
            </ul>
          </Section>

          <Section title="4. Job Posts & Applications">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Companies are responsible for the accuracy and legality of job postings.</li>
              <li>Students are responsible for the correctness of their profile and application details.</li>
              <li>
                MatchNexus may remove or restrict content that violates rules or creates safety concerns.
              </li>
            </ul>
          </Section>

          <Section title="5. Verification & Moderation">
            <p className="text-gray-700">
              MatchNexus may apply verification (e.g., company domain verification) to reduce fake postings. The admin
              panel can suspend accounts or remove content when violations are detected.
            </p>
          </Section>

          <Section title="6. Payments & Promotions (If Applicable)">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Some services (e.g., promoted job listings) may require payment.</li>
              <li>Payments may be processed through third-party payment providers.</li>
              <li>Refund decisions (if any) depend on provider rules and platform policies.</li>
            </ul>
          </Section>

          <Section title="7. Privacy">
            <p className="text-gray-700">
              We handle user data according to our Privacy Policy. Please review{" "}
              <Link href="/privacy" className="font-semibold text-gray-900 underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="8. Disclaimers & Liability">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>We do not guarantee internship placement or hiring outcomes.</li>
              <li>Matching results are recommendations and may not be 100% accurate.</li>
              <li>MatchNexus is not responsible for disputes between students and companies.</li>
            </ul>
          </Section>

          <Section title="9. Changes to Terms">
            <p className="text-gray-700">
              We may update these Terms & Conditions. Continued use of MatchNexus after updates means you accept the
              revised terms.
            </p>
          </Section>

          <Section title="10. Contact">
            <p className="text-gray-700">
              If you have any questions, please contact us via{" "}
              <Link href="/contact" className="font-semibold text-gray-900 underline underline-offset-4">
                Contact Us
              </Link>
              .
            </p>
          </Section>
        </Card>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}