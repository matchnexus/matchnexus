import { Card } from "flowbite-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      {/* FULL background (same format as About/Terms) */}
      <div className="fixed inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/photos/4427.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pt-24 pb-12">
        <Card className="rounded-2xl bg-white/85 backdrop-blur-md">
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>

          <p className="mt-2 text-sm text-gray-600">
            Last updated: <span className="font-medium text-gray-900">2026-03-01</span>
          </p>

          <p className="mt-4 text-gray-700">
            This Privacy Policy explains how <span className="font-semibold text-gray-900">MatchNexus</span> collects,
            uses, and protects your information when you use our platform. If you do not agree with this policy, please
            do not use the service.
          </p>

          <Section title="1. Information We Collect">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">Account information:</span> name, email, role (student/company/admin).
              </li>
              <li>
                <span className="font-semibold text-gray-900">Profile information:</span> skills, education, interests, and optional CV/resume data.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Application data:</span> internships you apply to and relevant application details.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Usage data:</span> pages visited, clicks, basic analytics (to improve user experience).
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>To create and manage user accounts.</li>
              <li>To provide internship recommendations and matching features.</li>
              <li>To process applications and show them to relevant companies.</li>
              <li>To improve platform performance, usability, and security.</li>
              <li>To communicate updates, support replies, and important notices.</li>
            </ul>
          </Section>

          <Section title="3. CV / Resume Processing">
            <p className="text-gray-700">
              If you upload a CV/resume, MatchNexus may process it to extract skills and other relevant information for
              matching and ranking. You control what you upload, and you can update or remove your profile data later
              (depending on platform features).
            </p>
          </Section>

          <Section title="4. Sharing of Information">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">With companies:</span> When you apply, relevant profile/application details may be shared
                with the company that posted the internship.
              </li>
              <li>
                <span className="font-semibold text-gray-900">With service providers:</span> We may use trusted third-party services (e.g., email, payments)
                to operate MatchNexus.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Legal reasons:</span> We may disclose information if required by law or to protect users and the platform.
              </li>
            </ul>
          </Section>

          <Section title="5. Cookies & Analytics">
            <p className="text-gray-700">
              We may use cookies or similar technologies to remember preferences and understand usage trends. You can
              control cookies through your browser settings. Some features may not work correctly if cookies are disabled.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p className="text-gray-700">
              We take reasonable steps to protect your data. However, no method of online transmission or storage is
              100% secure, so we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p className="text-gray-700">
              We keep your data only as long as needed to provide platform services and meet legal/operational
              requirements. If features allow, you may request data deletion or account removal.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>You can update your account and profile information.</li>
              <li>You can request correction of inaccurate data.</li>
              <li>You can request deletion of your data (subject to platform and legal constraints).</li>
            </ul>
          </Section>

          <Section title="9. Changes to This Policy">
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Continued use of MatchNexus after changes means you
              accept the updated policy.
            </p>
          </Section>

          <Section title="10. Contact">
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us via{" "}
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