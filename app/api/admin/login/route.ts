import { NextResponse } from "next/server";
import { validateAdminCredentials } from "@/server/admin/auth";
import { signIn } from "next-auth/react";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate admin credentials
    const { valid, admin } = await validateAdminCredentials(email, password);

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create response and set session cookie
    const res = NextResponse.json(
      { message: "Admin login successful", admin },
      { status: 200 }
    );

    // Set cookie to indicate admin session (Next.js will handle JWT via NextAuth)
    res.cookies.set("admin-login", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("admin-email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
