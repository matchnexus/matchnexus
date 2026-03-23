"use client";

import Link from "next/link";

export default function FooterMain() {
  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* Background image (put in /public/photos/footer-bg.jpg) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/photos/hero.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/85" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 text-white">
        {/* TOP GRID */}
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <div className="text-4xl font-extrabold">MatchNexus</div>
            <h3 className="mt-6 text-2xl font-bold">Newsletters</h3>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Subscribe to our newsletter and receive updates on the best matching internships.
            </p>

            <form
              className="mt-6 flex w-full max-w-2xl overflow-hidden rounded-2xl bg-white"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="w-full px-5 py-4 text-sm text-gray-900 outline-none"
                placeholder="Enter your email..."
                type="email"
                required
              />
              <button
                className="bg-lime-500 px-10 py-4 text-sm font-extrabold text-white hover:bg-lime-400"
                type="submit"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xl font-bold">Job Seeker</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li><Link className="hover:text-white" href="/auth/login">Login</Link></li>
              <li><Link className="hover:text-white" href="/jobs">Jobs</Link></li>
              <li><Link className="hover:text-white" href="/student/hub">Student hub</Link></li>

              <li><Link className="hover:text-white" href="/premium">Try Premium</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xl font-bold">Recruiters</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li><Link className="hover:text-white" href="/company/login">Login</Link></li>
              <li><Link className="hover:text-white" href="/faq">FAQ</Link></li>
              <li><Link className="hover:text-white" href="/testimonials">Testimonials</Link></li>
              <li><Link className="hover:text-white" href="/features">Features</Link></li>
            </ul>

            <h4 className="mt-10 text-xl font-bold">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
              <li><Link className="hover:text-white" href="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:text-white" href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* CONTACT ROW */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm text-white/85 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            <span className="inline-flex items-center gap-2">
              <IconLocation />
              Colombo, Sri Lanka
            </span>
            <span className="inline-flex items-center gap-2">
              <IconPhone />
              +94 11 123 4567
            </span>
            <span className="inline-flex items-center gap-2">
              <IconMail />
              info@matchnexus.lk
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="#" aria-label="LinkedIn"><IconLinkedIn /></a>
            <a className="hover:text-white" href="#" aria-label="Facebook"><IconFacebook /></a>
            <a className="hover:text-white" href="#" aria-label="Instagram"><IconInstagram /></a>
            <a className="hover:text-white" href="#" aria-label="YouTube"><IconYouTube /></a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-center text-xs text-white/70">
          © {new Date().getFullYear()} MatchNexus. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

/* --- Simple inline icons (no extra libs) --- */
function IconLocation() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h16v16H4V4z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 6l8 7 8-7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 102.5 6a2.5 2.5 0 002.48-2.5zM3 8.98h4v12H3v-12zM9 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v7.32h-4v-6.5c0-1.55-.03-3.55-2.17-3.55-2.17 0-2.5 1.7-2.5 3.44v6.61H9v-12z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12H18l-.5 3h-2.9v7A10 10 0 0022 12z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.2-.9a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a3 3 0 00-2.1-2.1C17.8 4.6 12 4.6 12 4.6s-5.8 0-7.5.5A3 3 0 002.4 7.2 31.7 31.7 0 002.1 12c0 1.6.1 3.2.3 4.8a3 3 0 002.1 2.1c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a3 3 0 002.1-2.1c.2-1.6.3-3.2.3-4.8 0-1.6-.1-3.2-.3-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}