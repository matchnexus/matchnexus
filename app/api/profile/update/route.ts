import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, ...updateData } = body;

   
    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID is required" }, 
        { status: 400 }
      );
    }

    
    const updatedStudent = await prisma.student.update({
      where: { 
        id: studentId 
      },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        address: updateData.address,
        
        dob: updateData.dob ? new Date(updateData.dob) : null,
        institute: updateData.institute,
        department: updateData.department,
        degreeType: updateData.degreeType, 
        grade: updateData.grade,
        githubLink: updateData.githubLink,
        linkedinLink: updateData.linkedinLink,
        personalPortfolio: updateData.personalPortfolio,
      },
    });

    return NextResponse.json({
      message: "Profile Updated Successfully",
      student: updatedStudent,
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    
   
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Student record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}