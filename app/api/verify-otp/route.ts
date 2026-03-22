import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();

    // ✅ Get cookies
    const cookieStore = cookies();
    const savedOtp = cookieStore.get("otp")?.value;
    const email = cookieStore.get("otp_email")?.value;

    // ❌ No OTP / expired
    if (!savedOtp || !email) {
      return NextResponse.json(
        { message: "OTP expired. Please login again." },
        { status: 400 }
      );
    }

    // ❌ Wrong OTP
    if (savedOtp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ Get user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.student,
      },
    });

    // ✅ Clear OTP cookies
    response.cookies.delete("otp");
    response.cookies.delete("otp_email");

    // ✅ Set login session (simple way)
    response.cookies.set("userId", user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error: any) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}