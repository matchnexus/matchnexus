"use client";

import { Card, Label, TextInput, Button, Checkbox } from "flowbite-react";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
  common?: string;
};

export default function CompanyLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
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

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Min 6 characters required";
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
        remember: false,
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
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                color={errors.password ? "failure" : "gray"}
                sizing="lg"
              />
              {errors.password && (
                <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer font-medium text-slate-600"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/auth/company/register"
                className="font-bold text-sky-600 hover:text-sky-700"
              >
                Need account?
              </Link>
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