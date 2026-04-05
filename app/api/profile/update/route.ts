import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse multipart/form-data ──────────────────────────────────────────
    const formData = await req.formData();

    const studentId = formData.get("studentId") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const address = formData.get("address") as string;
    const dob = formData.get("dob") as string | null;
    const institute = formData.get("institute") as string;
    const department = formData.get("department") as string;
    const degreeType = formData.get("degreeType") as string;
    const grade = formData.get("grade") as string | null;
    const github = formData.get("github") as string | null;
    const linkedin = formData.get("linkedin") as string | null;
    const skillsRaw = formData.get("skills") as string | null; // JSON array of skill names
    const cvFile = formData.get("cvFile") as File | null;
    const photoFile = formData.get("photoFile") as File | null;

    // ── Basic validation ───────────────────────────────────────────────────
    if (!studentId || !firstName || !institute || !department || !degreeType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ── Resolve the Student row that belongs to the logged-in user ─────────
    const existingStudent = await prisma.student.findUnique({
      where: { userId: userId },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // ── Run everything in a transaction ───────────────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update core Student fields ──────────────────────────────────────
      const updatedStudent = await tx.student.update({
        where: { userId: userId },
        data: {
          studentId,
          firstName,
          lastName,
          address: address || null,
          dob: dob ? new Date(dob) : null,
          institute,
          department,
          degreeType: degreeType as any, // cast to your DegreeType enum
          grade: grade || null,
          githubLink: github || null,
          linkedinLink: linkedin || null,
        },
      });

      // 2. Sync Skills ─────────────────────────────────────────────────────
      //    Strategy: delete all existing student_skills, then re-insert.
      //    This is the safest approach when the client sends the full list.
      if (skillsRaw !== null) {
        const skillNames: string[] = JSON.parse(skillsRaw);

        // Delete current skill associations
        await tx.studentSkill.deleteMany({
          where: { studentId: updatedStudent.id },
        });

        if (skillNames.length > 0) {
          // Look up Skill IDs by name (only skills that actually exist in DB)
          const skillRecords = await tx.skill.findMany({
            where: { name: { in: skillNames } },
            select: { id: true },
          });

          // Re-create associations
          await tx.studentSkill.createMany({
            data: skillRecords.map((skill) => ({
              studentId: updatedStudent.id,
              skillId: skill.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      let resumeRecord = null;

      if (cvFile && cvFile.size > 0) {
        const bytes = await cvFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${updatedStudent.id}_${Date.now()}_${cvFile.name}`;

        const { writeFile, mkdir } = await import("fs/promises");
        const { join } = await import("path");

        const uploadDir = join(process.cwd(), "public", "resumes");
        await mkdir(uploadDir, { recursive: true });

        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const publicPath = `/resumes/${fileName}`;

        resumeRecord = await tx.resume.create({
          data: {
            studentId: updatedStudent.id,
            filePath: publicPath,
          },
        });
      }
      // 4. Handle profile photo upload ─────────────────────────────────────────
      if (photoFile && photoFile.size > 0) {
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = photoFile.name.split(".").pop() || "jpg";
        const fileName = `${updatedStudent.id}_${Date.now()}.${ext}`;

        const { writeFile, mkdir } = await import("fs/promises");
        const { join } = await import("path");

        const uploadDir = join(process.cwd(), "public", "avatars");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, fileName), buffer);

        await tx.student.update({
          where: { id: updatedStudent.id },
          data: { profilePhotoUrl: `/avatars/${fileName}` },
        });
      }

      return {
        student: updatedStudent,
        resume: resumeRecord,
        photoSaved: !!(photoFile && photoFile.size > 0),
      };
    });

    return NextResponse.json(
      { message: "Profile updated successfully", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
