import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  hasAdminSession,
  parseUuidParam,
  parseVerificationDecisionPayload,
} from "@/lib/admin/api-validation";
import { decideAdminCompanyVerification } from "@/server/admin/verifications";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(req: NextRequest, { params }: Params) {
  const cookieStore = cookies();
  const isAdminSession = hasAdminSession(cookieStore.get("admin-login")?.value);

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsedId = parseUuidParam(params.id, "Company id");
  if (!parsedId.success) {
    return NextResponse.json({ message: parsedId.message }, { status: 400 });
  }

  const payload = await req.json().catch(() => null);
  const parsedPayload = parseVerificationDecisionPayload(payload);
  if (!parsedPayload.success) {
    return NextResponse.json({ message: parsedPayload.message }, { status: 400 });
  }

  const result = await decideAdminCompanyVerification(
    parsedId.data,
    parsedPayload.data.action,
    parsedPayload.data.reason
  );

  return NextResponse.json(
    { message: result.message, nextStatus: result.ok ? result.nextStatus : undefined },
    { status: result.status }
  );
}
