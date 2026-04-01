"use client";

import { Card, Label, TextInput, Button, Checkbox } from "flowbite-react";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

type RegisterFormData = {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

type FormErrors = {
  companyName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
  common?: string;
};

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
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

    if (!form.companyName.trim()) {
      nextErrors.companyName = "Company name is required";
    }

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
    } else if (form.password.length !== 8) {
      nextErrors.password = "Password must be exactly 8 characters";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.agreeTerms) {
      nextErrors.agreeTerms = "You need to accept terms to continue";
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

      const res = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ common: data.error || "Registration failed" });
        return;
      }

      setSuccessMessage("Company registered successfully. Redirecting...");
      setForm({
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });

      setTimeout(() => {
        router.push("/auth/company/login");
      }, 1200);
    } catch (error) {
      setErrors({ common: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-[url('/photos/hero.jpg')] bg-cover bg-center bg-no-repeat bg-sky-900/70 bg-blend-overlay p-3 font-sans sm:p-4">
      <Card className="w-full max-w-md origin-center scale-[0.95] rounded-3xl border-none bg-white/95 p-2 shadow-2xl backdrop-blur-lg sm:scale-100">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Company Register</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Create your company account to start posting internships
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName" value="Company Name" className="font-semibold" />
            <TextInput
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Your company name"
              value={form.companyName}
              onChange={handleChange}
              color={errors.companyName ? "failure" : "gray"}
              sizing="md"
            />
            {errors.companyName && (
              <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                {errors.companyName}
              </p>
            )}
          </div>

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
              sizing="md"
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
              minLength={8}
              maxLength={8}
              color={errors.password ? "failure" : "gray"}
              sizing="md"
            />
            {errors.password && (
              <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" value="Confirm Password" className="font-semibold" />
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={8}
              maxLength={8}
              color={errors.confirmPassword ? "failure" : "gray"}
              sizing="md"
            />
            {errors.confirmPassword && (
              <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <Label
                htmlFor="agreeTerms"
                className="cursor-pointer font-medium text-slate-600"
              >
                I agree to the company terms and policies
              </Label>
            </div>
            {errors.agreeTerms && (
              <p className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs font-bold text-red-600">
                {errors.agreeTerms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl border-none bg-lime-500 py-1 text-base font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:bg-lime-600 active:scale-95"
          >
            {loading ? "Registering..." : "Create Account"}
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

        <div className="mt-4 border-t pt-4 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/company/login" className="font-bold text-sky-600 hover:underline">
              Login Now
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}