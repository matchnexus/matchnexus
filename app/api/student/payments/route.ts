import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET /api/student/payments
// Returns payment history for the logged-in student — read-only
export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ payments: [] });
    }

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ payments: [] });
    }

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, productType: true } },
      },
    });

    const shaped = payments.map((p) => ({
      id: p.id,
      label: p.product.name,
      amount: `${p.currency} ${Number(p.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
      raw: Number(p.amount),
      date: p.createdAt.toISOString().slice(0, 10),
      status: p.status === "SUCCEEDED" ? "Paid" : p.status === "PENDING" ? "Pending" : "Failed",
    }));

    return NextResponse.json({ payments: shaped });
  } catch (error) {
    console.error("GET /api/student/payments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
