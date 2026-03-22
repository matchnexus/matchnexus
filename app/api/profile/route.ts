import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server"; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("studentId");

   
    if (!id) {
      return NextResponse.json(
        { message: "Student ID Required" }, 
        { status: 400 }
      );
    }

   
    const profile = await prisma.student.findUnique({
      where: {
        studentId: id, 
      },
      include: {
        skills: {
          include: { 
            skill: true 
          } 
        }
      }
    });

    
    if (!profile) {
      return NextResponse.json(
        { message: "Student profile not found" }, 
        { status: 404 }
      );
    }

    // 4. සාර්ථක නම් දත්ත ලබා දෙනවා
    return NextResponse.json(profile);

  } catch (error: any) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message }, 
      { status: 500 }
    );
  }
}