import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET /api/student/courses/[id]
// Returns a single course with modules, lessons, and lesson progress for the student
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    let studentId: string | null = null;
    if (userId) {
      const student = await prisma.student.findUnique({
        where: { userId },
        select: { id: true },
      });
      studentId = student?.id ?? null;
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          orderBy: { moduleOrder: "asc" },
          include: {
            lessons: {
              orderBy: { lessonOrder: "asc" },
              include: studentId
                ? { progress: { where: { studentId }, select: { isCompleted: true, progressPercent: true } } }
                : { progress: false },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Shape modules with completion info — read-only
    const modules = course.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      order: mod.moduleOrder,
      lessons: mod.lessons.map((les) => ({
        id: les.id,
        title: les.title,
        contentType: les.contentType,
        contentUrl: les.contentUrl,
        order: les.lessonOrder,
        isCompleted: les.progress?.[0]?.isCompleted ?? false,
        progressPercent: les.progress?.[0]?.progressPercent ?? 0,
      })),
      done: mod.lessons.length > 0 && mod.lessons.every((l) => l.progress?.[0]?.isCompleted),
    }));

    const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
    const completedLessons = modules.reduce((s, m) => s + m.lessons.filter((l) => l.isCompleted).length, 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        isFree: course.isFree,
        priceAmount: course.priceAmount,
        modules,
        progress,
        completedLessons,
        totalLessons,
      },
    });
  } catch (error) {
    console.error("GET /api/student/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
