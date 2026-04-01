import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const res = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear admin session cookies
    res.cookies.set("admin-login", "", { maxAge: 0 });
    res.cookies.set("admin-email", "", { maxAge: 0 });

    return res;
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
