import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Send email
    await sendOTPEmail({ to: email, otp });

    // ✅ Store OTP in cookie (temporary)
    const response = NextResponse.json({
      message: "OTP sent to email",
    });

    response.cookies.set("otp", otp, {
      httpOnly: true,
      maxAge: 60 * 5, // 5 minutes
    });

    response.cookies.set("otp_email", email, {
      httpOnly: true,
      maxAge: 60 * 5,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}