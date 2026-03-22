import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, studentId, dob, gender, address } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: "STUDENT",
          isVerified: false,
        },
      });

      await tx.student.create({
        data: {
          userId: user.id, 
          firstName: fullName.split(" ")[0] || "Student", 
          lastName: fullName.split(" ").slice(1).join(" ") || "User",
          studentId: studentId,
          address,
          dob: new Date(dob),
          institute: "SLIIT", // Default values
          department: "IT",
          degreeType: "UNDERGRADUATE",
        },
      });
    });

    return NextResponse.json(
      { message: "Registration Successful!" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { message: "Database error occurred" },
      { status: 500 },
    );
  }
}

