import Image from "next/image";
import { Card } from "flowbite-react";

const developers = [
  { name: "EKANAYAKA G.R.G.", id: "", photo: "/team/member-1.jpg" },
  { name: "B M T P MENDIS", id: "", photo: "/team/member-2.jpg" },
  { name: "CHANDRASIRI S H U G", id: "", photo: "/team/member_03.jpeg" },
  { name: "SOMARATHNA M V W", id: "", photo: "/team/member-4.jpg" },
];

export default function AboutPage() {
  return (
       <div className="relative min-h-screen">
      {/* FULL background (no gaps) */}
      <div className="fixed inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/photos/4427.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      
      <main className="relative mx-auto max-w-7xl px-6 pt-24 pb-12">
        <Card className="rounded-2xl bg-white/85 backdrop-blur-md">
          {/* WHAT IS MATCHNEXUS */}
           <h1 className="text-3xl font-extrabold text-gray-900">About MatchNexus</h1>

          <p className="mt-3 text-gray-700">
            <span className="font-semibold text-gray-900">MatchNexus</span> is a smart internship matching web platform.
            It helps <span className="font-semibold text-gray-900">students</span> find the right internships and helps{" "}
            <span className="font-semibold text-gray-900">companies</span> find the best candidates faster.
          </p>

          <p className="mt-3 text-gray-700">
            Instead of showing random job listings, MatchNexus focuses on{" "}
            <span className="font-semibold text-gray-900">skills-based matching</span>. Students create a profile (and later
            upload a CV), and the system recommends internships that best match their current skills. Companies can post
            internships and receive a more relevant shortlist rather than manually screening hundreds of applicants.
          </p>

          <p className="mt-3 text-gray-700">
            MatchNexus also focuses on trust and growth. Company sign-up can be controlled using{" "}
            <span className="font-semibold text-gray-900">domain-based verification</span>, and an{" "}
            <span className="font-semibold text-gray-900">admin panel</span> helps manage company approvals and job moderation.
            Additionally, the platform can support student development through a course hub and certifications, so users can bridge
            skill gaps and improve their matching results over time.
          </p>
          
          {/* KEY FEATURES (simple) */}
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <InfoBlock
              title="For Students"
              text="Build your profile, discover internships that match your skills, and apply faster."
            />
            <InfoBlock
              title="For Companies"
              text="Post internships, verify legitimacy, and reduce screening time with smarter shortlists."
            />
            <InfoBlock
              title="Admin & Trust"
              text="An admin panel supports company verification and job moderation to improve platform safety."
            />
          </div>

          {/* WHO DEVELOPED */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-gray-900">Developed By</h2>
            <p className="mt-2 text-gray-700">
              This web application was developed as a university project by the following team members.
            </p>

            
            <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
              <div className="relative h-56 w-full md:h-72">
               
                <Image
                  src="/team/group.jpeg"
                  alt="MatchNexus Team"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4 text-sm text-gray-600">
              <span className="font-medium text-gray-900">MatchNexus Team</span>
              </div>
            </div>

            {/* Developer cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {developers.map((d) => (
                <div key={d.id} className="overflow-hidden rounded-2xl border bg-white">
                  <div className="relative h-44 w-full">
                    <Image src={d.photo} alt={d.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-extrabold text-gray-900">{d.name}</div>
                   
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Card>
      </main>
    </div>
  );
}

// ddddddddddddddddddddddddddddddddddddddddddddddddddddddd

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm font-extrabold text-gray-900">{title}</div>
      <p className="mt-2 text-sm text-gray-700">{text}</p>
    </div>
  );
}