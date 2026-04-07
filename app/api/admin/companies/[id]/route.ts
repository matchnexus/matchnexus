import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteAdminCompany } from "@/server/admin/companies";

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  const cookieStore = cookies();
  const isAdminSession = cookieStore.get("admin-login")?.value === "true";

  if (!isAdminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json({ message: "Company id is required" }, { status: 400 });
  }

  const result = await deleteAdminCompany(params.id);

  if (!result.deleted) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Company deleted" }, { status: 200 });
}
