import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.internshipPost.findFirst({
      where: {
        id: params.id,
        status: "ACTIVE",
      },
      include: {
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch job" },
      { status: 500 }
    );
  }
}