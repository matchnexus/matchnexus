import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log(email);
  console.log(password);
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }

  // const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // await sendOTPEmail({ to: email, otp });
  const fullName = `${user.student?.firstName ?? ""}`.trim();

  const res = NextResponse.json({ message: "OTP sent", studentName: fullName });

  // res.cookies.set("otp", otp, { httpOnly: true, maxAge: 60 * 60 * 24 * 5, });
  res.cookies.set("userId", user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });

  res.cookies.set("email", email, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5,
  });

  res.cookies.set("password", password, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5,
  });

  return res;
}
