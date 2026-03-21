"use client";

import { Card, Label, TextInput, Button, Checkbox } from "flowbite-react";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Types
type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

   
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    // --- Email Validation ---
    if (!form.email) {
      newErrors.email = "Email is required";
    } else {
      // SLIIT IT Pattern: it + digits(8) + @my.sliit.lk
      const sliitPattern = /^(it|IT)[0-9]{8}@my\.sliit\.lk$/;

      if (!sliitPattern.test(form.email)) {
        newErrors.email = "Invalid SLIIT email. Use 'itXXXXXXXX@my.sliit.lk'";
      }
    }

    // --- Password Validation ---
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Min 6 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Login Successful:", form);
    router.push("/auth/verify");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-600 to-blue-800 px-4 font-sans">
      <Card className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-lg shadow-2xl border-none p-2">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back 
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Login with your SLIIT Student ID
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" value="Student Email" className="font-semibold" />
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="it21000000@my.sliit.lk"
              value={form.email}
              onChange={handleChange}
              color={errors.email ? "failure" : "gray"}
              sizing="lg"
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-100">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
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
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-100">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" name="remember" checked={form.remember} onChange={handleChange} />
              <Label htmlFor="remember" className="cursor-pointer font-medium text-slate-600">Remember me</Label>
            </div>
            <Link href="/auth/forgot-password" className="font-bold text-sky-600 hover:text-sky-700">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="rounded-xl bg-lime-500 py-1 text-lg font-black uppercase tracking-wider text-white hover:bg-lime-600 shadow-lg transition-transform active:scale-95 border-none"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-sky-600 hover:underline">
              Register Now
            </Link>
            
          </p>
          <Link href="/" className="mt-4 inline-block text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em]">
            — Back to Home —
          </Link>
        </div>
      </Card>
    </div>
  );
}