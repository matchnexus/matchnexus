"use client";

import Image from "next/image";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";

const inputTheme = {
  field: {
    input: {
      base:
        "block w-full rounded-xl bg-gray-100 text-sm text-gray-900 placeholder:text-gray-500 outline-none border-0 focus:ring-0 focus:border-transparent",
      sizes: {
        lg: "px-5 py-4",
      },
    },
  },
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/photos/4427.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <main className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md shadow-xl">
          <div className="grid lg:grid-cols-2">
            {/* LEFT */}
            <div className="bg-sky-700/10 p-8">
              <div className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/contact_us/5157530.jpg"
                  alt="Need help"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <InfoItem
                  title="Mailing Address"
                  value={"Colombo, Sri Lanka\n(Your address here)"}
                  icon={<IconLocation />}
                />
                <InfoItem title="Phone" value={"+94 11 123 4567"} icon={<IconPhone />} />
                <InfoItem title="Email" value={"info@matchnexus.lk"} icon={<IconMail />} />
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white p-10 lg:p-12">
              <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>

              {sent ? (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  Message sent (demo).
                </div>
              ) : null}

              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                {/* Name */}
                <div>
                  <Label htmlFor="name" value="Name *" className="sr-only" />
                  <TextInput
                    id="name"
                    placeholder="Name *"
                    required
                    sizing="lg"
                    className="w-full"
                    theme={inputTheme}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" value="Email *" className="sr-only" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="Email *"
                    required
                    sizing="lg"
                    className="w-full"
                    theme={inputTheme}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" value="Phone Number *" className="sr-only" />
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    sizing="lg"
                    className="w-full"
                    theme={inputTheme}
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" value="Message *" className="sr-only" />
                  <Textarea
                    id="message"
                    placeholder="Message *"
                    rows={10}
                    required
                    className="w-full rounded-xl bg-gray-100 px-5 py-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none border-0 focus:ring-0 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="rounded-xl bg-lime-500 px-16 py-3 text-base font-extrabold hover:bg-lime-400"
                  >
                    SUBMIT
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* keep your InfoItem + icons same */
function InfoItem({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-gray-900">{icon}</div>
      <div>
        <div className="text-sm font-extrabold text-gray-900">{title}</div>
        <div className="whitespace-pre-line text-sm text-gray-700">{value}</div>
      </div>
    </div>
  );
}

function IconLocation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 13a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.6 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0122 16.9z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}