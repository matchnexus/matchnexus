import { NextResponse } from "next/server";
import { getCompanyApplicantRankings } from "@/server/ml/recommendations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const rankings = await getCompanyApplicantRankings(companyId);

    return NextResponse.json({ rankings }, { status: 200 });
  } catch (error) {
    console.error("Company analytics error:", error);
    return NextResponse.json(
      { error: "Failed to load company analytics" },
      { status: 500 }
    );
  }
}
