import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST() {
  try {
    const cookieStore = cookies();
    const email = cookieStore.get("otp_email")?.value;

    if (!email) {
      return NextResponse.json(
        { message: "Session expired. Please login again." },
        { status: 400 }
      );
    }

    // ✅ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Send email
    await sendOTPEmail({ to: email, otp });

    // ✅ Update cookies with new OTP
    const response = NextResponse.json({
      message: "OTP resent successfully",
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
    console.error("Resend OTP Error:", error);
    return NextResponse.json(
      { message: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}