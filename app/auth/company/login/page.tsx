"use client";

import { Card, Label, TextInput, Button } from "flowbite-react";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { strongPasswordMessage, validateStrongPassword } from "@/lib/password-policy";

type LoginFormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
  common?: string;
};

export default function CompanyLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      common: "",
    }));

    setSuccessMessage("");
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.email) {
      nextErrors.email = "Corporate email is required";
    } else {
      const corporatePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!corporatePattern.test(form.email)) {
        nextErrors.email = "Enter a valid corporate email";
      }
    }

    const passwordError = validateStrongPassword(form.password);
    if (passwordError) {
      nextErrors.password = passwordError;
    }

    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSuccessMessage("");
    setErrors({});

    try {
      setLoading(true);

      const res = await fetch("/api/company/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ common: data.error || "Login failed" });
        return;
      }

      if (data?.company) {
        localStorage.setItem("companyLoginEmail", form.email);
        if (data.company.companyName) {
          localStorage.setItem("companyName", data.company.companyName);
        }
        if (data.company.id) {
          localStorage.setItem("companyId", data.company.id);
        }
        localStorage.setItem(
          "companyEmail",
          data.company.corporateEmail || form.email
        );
      }

      setSuccessMessage("Login successful. Redirecting...");
      setForm({
        email: "",
        password: "",
      });

      setTimeout(() => {
        router.push("/company/dashboard");
      }, 1000);
    } catch (error) {
      setErrors({ common: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/photos/hero.jpg')] bg-cover bg-center bg-no-repeat bg-sky-900/70 bg-blend-overlay px-4 font-sans">
      <Card className="w-full max-w-md rounded-3xl border-none bg-white/95 p-2 shadow-2xl backdrop-blur-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Company Login</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Sign in with your corporate credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" value="Corporate Email" className="font-semibold" />
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="company@domain.com"
                value={form.email}
                onChange={handleChange}
                color={errors.email ? "failure" : "gray"}
                sizing="lg"
              />
              {errors.email && (
                <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" value="Password" className="font-semibold" />
              <div className="relative">
                <TextInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={8}
                  color={errors.password ? "failure" : "gray"}
                  sizing="lg"
                  className="[&>input]:pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                      <path d="M9.9 5.1A10.7 10.7 0 0112 5c5.5 0 9.5 5.2 10 7-.2.7-1 2.2-2.3 3.6" />
                      <path d="M6.6 6.7C4.2 8.3 2.5 10.7 2 12c.5 1.7 4.5 7 10 7 1.8 0 3.4-.5 4.8-1.2" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs font-medium text-slate-500">{strongPasswordMessage}</p>
              {errors.password && (
                <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                  {errors.password}
                </p>
              )}
              <div className="flex justify-end">
                <Link
                  href="/auth/company/forgot-password"
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl border-none bg-lime-500 py-1 text-lg font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:bg-lime-600 active:scale-95"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

        {errors.common && (
          <p className="mt-4 rounded-lg border border-red-100 bg-red-50 p-2 text-center text-xs font-bold text-red-600">
            {errors.common}
          </p>
        )}

        {successMessage && (
          <p className="mt-4 rounded-lg border border-green-100 bg-green-50 p-2 text-center text-xs font-bold text-green-700">
            {successMessage}
          </p>
        )}

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/company/register" className="font-bold text-sky-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}