import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStudentJobRecommendations } from "@/server/ml/recommendations";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await getStudentJobRecommendations(userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Student recommendations error:", error);
    return NextResponse.json(
      { message: "Failed to load recommendations" },
      { status: 500 }
    );
  }
}
