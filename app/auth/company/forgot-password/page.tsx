import Link from "next/link";

export default function CompanyForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/photos/hero.jpg')] bg-cover bg-center bg-no-repeat bg-sky-900/70 bg-blend-overlay px-4 font-sans">
      <div className="w-full max-w-md rounded-3xl border-none bg-white/95 p-8 shadow-2xl backdrop-blur-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Password reset flow will be connected here.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
          If you want, I can add the full reset password flow next with email verification.
        </div>

        <div className="mt-8 text-center">
          <Link href="/auth/company/login" className="font-bold text-sky-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}