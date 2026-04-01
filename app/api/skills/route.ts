import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(skills);
}
