import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteAdminCompany } from "@/server/admin/companies";
import { hasAdminSession, parseUuidParam } from "@/lib/admin/api-validation";

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  const cookieStore = cookies();
  const isAdminSession = hasAdminSession(cookieStore.get("admin-login")?.value);

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsedId = parseUuidParam(params.id, "Company id");
  if (!parsedId.success) {
    return NextResponse.json({ message: parsedId.message }, { status: 400 });
  }

  const result = await deleteAdminCompany(parsedId.data);

  if (!result.deleted) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Company deleted" }, { status: 200 });
}
