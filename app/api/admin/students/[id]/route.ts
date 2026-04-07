import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteAdminStudent } from "@/server/admin/students";

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
    return NextResponse.json({ message: "Student id is required" }, { status: 400 });
  }

  const result = await deleteAdminStudent(params.id);

  if (!result.deleted) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Student deleted" }, { status: 200 });
}
