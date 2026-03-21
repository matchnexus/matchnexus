"use client";

import { Card, Button } from "flowbite-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Submit OTP
  const handleVerify = () => {
    const code = otp.join("");

    if (code.length < 6) {
      alert("Please enter full OTP");
      return;
    }

    console.log("OTP Code:", code);

    // 👉 call backend API here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-600 to-blue-800 px-4">
      <Card className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-lg shadow-2xl text-center">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-900">Verify OTP 🔐</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Inputs */}
        <div className="mt-6 flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-12 rounded-xl border border-gray-300 text-center text-lg font-semibold focus:border-sky-500 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          className="mt-6 rounded-xl bg-lime-500 py-3 text-base font-semibold hover:bg-lime-400"
        >
          Verify
        </Button>

        {/* Resend */}
        <p className="mt-4 text-sm text-gray-600">
          Didn’t receive code?{" "}
          <button className="font-medium text-sky-600 hover:underline">
            Resend OTP
          </button>
        </p>

        {/* Footer */}
        <div className="mt-4 text-sm">
          <Link href="/" className="text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
