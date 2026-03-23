import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { otp } = await req.json();

  const cookieStore = cookies();

  const savedOtp = cookieStore.get("otp")?.value;
  const email = cookieStore.get("email")?.value;
  const password = cookieStore.get("password")?.value;

  if (!savedOtp || !email) {
    return NextResponse.json({ message: "Expired" }, { status: 400 });
  }

  if (savedOtp !== otp) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  return NextResponse.json({
    message: "OTP verified. Now login using NextAuth",
    email,
    password
  });
}