import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login Successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.student,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
