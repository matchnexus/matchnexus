"use client";

import { Badge, Button, Card } from "flowbite-react";
import {
  HiCreditCard,
  HiDocumentText,
  HiShieldCheck,
  HiCash,
} from "react-icons/hi";

const MOCK_TX = [
  {
    id: "tx-1024",
    date: "2025-03-12",
    label: "Course bundle — Spring track",
    amount: "LKR 4,500.00",
    status: "Paid" as const,
  },
  {
    id: "tx-1023",
    date: "2025-02-01",
    label: "Certificate verification fee",
    amount: "LKR 1,200.00",
    status: "Paid" as const,
  },
  {
    id: "tx-1018",
    date: "2025-01-15",
    label: "Platform access (student)",
    amount: "LKR 0.00",
    status: "Free" as const,
  },
];

const sidebarItems = [
  { id: "overview", label: "Overview", icon: HiCash },
  { id: "history", label: "History", icon: HiDocumentText },
  { id: "methods", label: "Payment methods", icon: HiCreditCard },
  { id: "security", label: "Security", icon: HiShieldCheck },
];

export default function StudentPaymentHub() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 lg:w-52 lg:flex-col lg:gap-3 lg:pb-0">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="flex min-w-[7.5rem] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/50 lg:min-w-0"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Icon className="h-5 w-5" />
            </span>
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
            Payments & billing
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review balances and receipts (preview — not connected yet).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-[1.75rem] border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
            <div className="space-y-2 p-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                Outstanding balance
              </p>
              <p className="text-3xl font-black tracking-tight">LKR 0.00</p>
              <p className="text-xs font-medium text-white/70">
                No charges due. Connect a gateway later to enable live totals.
              </p>
            </div>
          </Card>
          <Card className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
            <div className="space-y-4 p-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Quick actions
              </p>
              <Button
                className="w-full rounded-xl bg-[#87D01A] font-bold uppercase tracking-wide enabled:hover:bg-[#76B817]"
                disabled
              >
                Pay now
              </Button>
              <Button color="light" className="w-full rounded-xl font-bold" disabled>
                Download invoices
              </Button>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
              Recent activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_TX.map((row) => (
                  <tr key={row.id} className="font-semibold text-slate-700">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{row.date}</td>
                    <td className="px-6 py-4">{row.label}</td>
                    <td className="px-6 py-4">{row.amount}</td>
                    <td className="px-6 py-4">
                      <Badge
                        color={row.status === "Free" ? "gray" : "success"}
                        className="rounded-lg px-2 py-1 text-[10px] font-black uppercase"
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
