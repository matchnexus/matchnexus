import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await sendOTPEmail({ to: email, otp });

  const res = NextResponse.json({ message: "OTP sent" });

  res.cookies.set("otp", otp, { httpOnly: true, maxAge: 300 });
  res.cookies.set("email", email, { httpOnly: true, maxAge: 300 });
  res.cookies.set("password", password, { httpOnly: true, maxAge: 300 });

  return res;
}
