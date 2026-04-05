import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  recomputeAllMatchingData,
  recomputeApplicationScoresForPost,
  recomputeStudentFeedRecommendations,
} from "@/server/ml/matching";

type RecomputeMode = "all" | "post" | "student";

type RecomputePayload = {
  mode?: RecomputeMode;
  postId?: string;
  studentId?: string;
};

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const isAdminSession = cookieStore.get("admin-login")?.value === "true";

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as RecomputePayload;
  const mode = payload.mode ?? "all";
  const startedAt = Date.now();

  if (mode === "post") {
    if (!payload.postId) {
      return NextResponse.json(
        { message: "postId is required for mode=post" },
        { status: 400 }
      );
    }

    const result = await recomputeApplicationScoresForPost(payload.postId);

    return NextResponse.json({
      message: "Post matching recomputed",
      mode,
      postId: payload.postId,
      applicationsScored: result.applicationsScored,
      durationMs: Date.now() - startedAt,
    });
  }

  if (mode === "student") {
    if (!payload.studentId) {
      return NextResponse.json(
        { message: "studentId is required for mode=student" },
        { status: 400 }
      );
    }

    const result = await recomputeStudentFeedRecommendations(payload.studentId);

    return NextResponse.json({
      message: "Student recommendations recomputed",
      mode,
      studentId: payload.studentId,
      recommendationsScored: result.postsScored,
      durationMs: Date.now() - startedAt,
    });
  }

  const result = await recomputeAllMatchingData();

  return NextResponse.json({
    message: "All matching data recomputed",
    mode,
    ...result,
    durationMs: Date.now() - startedAt,
  });
}
