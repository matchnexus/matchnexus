import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET /api/student/courses
// Returns published courses with enrollment status for the logged-in student
export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    // Get student id if logged in
    let studentId: string | null = null;
    if (userId) {
      const student = await prisma.student.findUnique({
        where: { userId },
        select: { id: true },
      });
      studentId = student?.id ?? null;
    }

    // Fetch all published courses (read-only, no writes)
    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        modules: {
          orderBy: { moduleOrder: "asc" },
          include: {
            lessons: { orderBy: { lessonOrder: "asc" } },
          },
        },
        enrollments: studentId
          ? { where: { studentId }, select: { enrollmentStatus: true, completedAt: true } }
          : false,
      },
    });

    // Shape the response — safe, no mutations
    const shaped = courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      duration: null, // not in schema directly
      priceAmount: c.priceAmount,
      isFree: c.isFree,
      status: c.status,
      moduleCount: c.modules.length,
      lessonCount: c.modules.reduce((s, m) => s + m.lessons.length, 0),
      enrollment: c.enrollments?.[0] ?? null,
    }));

    return NextResponse.json({ courses: shaped });
  } catch (error) {
    console.error("GET /api/student/courses error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
