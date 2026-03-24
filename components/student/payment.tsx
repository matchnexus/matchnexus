"use client";

import { Badge, Button, Card } from "flowbite-react";
import { useMemo, useState } from "react";
import {
  HiCreditCard,
  HiDocumentText,
  HiCash,
  HiCheckCircle,
  HiDownload,
  HiX,
  HiLockClosed,
} from "react-icons/hi";
import toast from "react-hot-toast";

const MOCK_TX = [
  { id: "tx-1024", date: "2025-03-12", label: "Course bundle — Spring track", amount: "LKR 4,500.00", raw: 4500, status: "Paid" as const },
  { id: "tx-1023", date: "2025-02-01", label: "Certificate verification fee", amount: "LKR 1,200.00", raw: 1200, status: "Paid" as const },
  { id: "tx-1018", date: "2025-01-15", label: "Platform access (student)", amount: "LKR 0.00", raw: 0, status: "Free" as const },
];

const sidebarItems = [
  { id: "overview", label: "Overview", icon: HiCash },
  { id: "history", label: "History", icon: HiDocumentText },
  { id: "methods", label: "Payment methods", icon: HiCreditCard },
] as const;

type PaymentTab = (typeof sidebarItems)[number]["id"];

// ── helpers ──────────────────────────────────────────────────────────────────

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

// ── Pay Now Modal ─────────────────────────────────────────────────────────────

function PayNowModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "", amount: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Cardholder name is required.";
    const rawCard = form.card.replace(/\s/g, "");
    if (rawCard.length !== 16) e.card = "Enter a valid 16-digit card number.";
    const [mm, yy] = form.expiry.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt("20" + yy, 10);
    const now = new Date();
    if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1))
      e.expiry = "Enter a valid expiry date (MM/YY).";
    if (form.cvv.replace(/\D/g, "").length < 3) e.cvv = "CVV must be 3–4 digits.";
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = "Enter a valid amount greater than 0.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-y-auto max-h-[95vh]">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <HiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Payment Successful</h3>
            <p className="text-sm text-gray-500">LKR {parseFloat(form.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })} has been processed.</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-gray-900 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiLockClosed className="h-4 w-4 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">Secure Payment</h3>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition">
                <HiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (LKR) *</label>
                <input
                  type="number" min="1" value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  placeholder="e.g. 4500"
                  className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${errors.amount ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
              </div>

              {/* Cardholder */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name *</label>
                <input
                  value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Name on card"
                  className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${errors.name ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Card number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number *</label>
                <input
                  value={form.card}
                  onChange={(e) => set("card", formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-blue-400 ${errors.card ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.card && <p className="mt-1 text-xs text-red-500">{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry *</label>
                  <input
                    value={form.expiry}
                    onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${errors.expiry ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">CVV *</label>
                  <input
                    value={form.cvv}
                    onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    type="password"
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 ${errors.cvv ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button type="button" onClick={onClose}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-blue-700 hover:to-cyan-600 transition disabled:opacity-60">
                  {loading ? "Processing…" : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Download invoices ─────────────────────────────────────────────────────────

function renderInvoiceCanvas(): HTMLCanvasElement {
  const W = 794, H = 600;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // header bar
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#1d4ed8");
  grad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 80);

  // logo text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText("MatchNexus", 40, 50);
  ctx.font = "13px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText("Invoice Summary", 40, 68);

  // date top-right
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Generated: ${new Date().toLocaleDateString("en-LK")}`, W - 40, 50);
  ctx.textAlign = "left";

  // table header
  const cols = [40, 140, 230, 530, 650];
  const headers = ["Ref", "Date", "Description", "Amount", "Status"];
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 100, W, 32);
  ctx.fillStyle = "#475569";
  ctx.font = "bold 11px Arial";
  headers.forEach((h, i) => ctx.fillText(h.toUpperCase(), cols[i], 121));

  // rows
  MOCK_TX.forEach((tx, idx) => {
    const y = 155 + idx * 48;
    ctx.fillStyle = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
    ctx.fillRect(0, y - 18, W, 48);

    ctx.fillStyle = "#64748b";
    ctx.font = "11px monospace";
    ctx.fillText(tx.id, cols[0], y);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#64748b";
    ctx.fillText(tx.date, cols[1], y);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px Arial";
    ctx.fillText(tx.label, cols[2], y);

    ctx.fillStyle = "#1e293b";
    ctx.fillText(tx.amount, cols[3], y);

    // status badge
    ctx.fillStyle = tx.status === "Paid" ? "#dbeafe" : "#f1f5f9";
    ctx.beginPath();
    ctx.roundRect(cols[4], y - 13, 52, 20, 6);
    ctx.fill();
    ctx.fillStyle = tx.status === "Paid" ? "#1d4ed8" : "#64748b";
    ctx.font = "bold 10px Arial";
    ctx.fillText(tx.status.toUpperCase(), cols[4] + 8, y + 1);
  });

  // divider
  const divY = 155 + MOCK_TX.length * 48 + 10;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, divY); ctx.lineTo(W - 40, divY); ctx.stroke();

  // total
  const total = MOCK_TX.filter((t) => t.status === "Paid").reduce((s, t) => s + t.raw, 0);
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Total Paid: LKR ${total.toLocaleString("en-LK")}.00`, W - 40, divY + 28);
  ctx.textAlign = "left";

  // footer
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Arial";
  ctx.fillText("MatchNexus Platform · This is a system-generated invoice.", 40, H - 20);

  return canvas;
}

function buildPdf(canvas: HTMLCanvasElement): Blob {
  const imgData = canvas.toDataURL("image/jpeg", 0.95).split(",")[1];
  const W = 794, H = 600;

  const pdf = [
    "%PDF-1.4",
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Contents 4 0 R/Resources<</XObject<</I1 5 0 R>>>>>>endobj`,
  ];

  const imgBytes = atob(imgData);
  const imgLen = imgBytes.length;

  const streamContent = `q ${W} 0 0 ${H} 0 0 cm /I1 Do Q`;
  pdf.push(`4 0 obj<</Length ${streamContent.length}>>\nstream\n${streamContent}\nendstream\nendobj`);
  pdf.push(`5 0 obj<</Type/XObject/Subtype/Image/Width ${W}/Height ${H}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${imgLen}>>\nstream`);

  // build binary
  const header = pdf.join("\n") + "\n";
  const footer = `\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\ntrailer<</Size 6/Root 1 0 R>>\n%%EOF`;

  const headerBytes = new TextEncoder().encode(header);
  const footerBytes = new TextEncoder().encode(footer);
  const raw = new Uint8Array(imgBytes.length);
  for (let i = 0; i < imgBytes.length; i++) raw[i] = imgBytes.charCodeAt(i);

  const combined = new Uint8Array(headerBytes.length + raw.length + footerBytes.length);
  combined.set(headerBytes, 0);
  combined.set(raw, headerBytes.length);
  combined.set(footerBytes, headerBytes.length + raw.length);

  return new Blob([combined], { type: "application/pdf" });
}

function downloadInvoices(format: "pdf" | "jpeg" | "jpg") {
  const canvas = renderInvoiceCanvas();

  if (format === "pdf") {
    const blob = buildPdf(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "matchnexus-invoices.pdf"; a.click();
    URL.revokeObjectURL(url);
  } else {
    const url = canvas.toDataURL("image/jpeg", 0.95);
    const a = document.createElement("a");
    a.href = url; a.download = `matchnexus-invoices.${format}`; a.click();
  }
  toast.success(`Invoice downloaded as .${format}`);
}

// ── Download format picker ────────────────────────────────────────────────────

function InvoiceDownloadMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
      >
        <HiDownload className="h-4 w-4" /> Download invoices
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-100 bg-white shadow-lg overflow-hidden">
            {(["pdf", "jpeg", "jpg"] as const).map((fmt) => (
              <button key={fmt} onClick={() => { downloadInvoices(fmt); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition uppercase">
                .{fmt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StudentPaymentHub() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("overview");
  const [showPayModal, setShowPayModal] = useState(false);

  const pageContent = useMemo(() => {
    switch (activeTab) {
      case "history":   return { title: "Payment history",   description: "View your recent transactions and invoice records." };
      case "methods":   return { title: "Payment methods",   description: "Manage available payment options for your account." };
      default:          return { title: "Payments & billing", description: "Review balances, invoices, and account payment details." };
    }
  }, [activeTab]);

  return (
    <>
      {showPayModal && <PayNowModal onClose={() => setShowPayModal(false)} />}

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 lg:w-56 lg:flex-col lg:gap-3 lg:pb-0">
          {sidebarItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} type="button" onClick={() => setActiveTab(id)}
                className={`flex min-w-[7.5rem] items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold shadow-sm transition lg:min-w-0 ${
                  isActive
                    ? "border border-blue-200 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60"
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="hidden lg:inline">{label}</span>
              </button>
            );
          })}
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">{pageContent.title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{pageContent.description}</p>
          </div>

          {activeTab === "overview" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-[1.75rem] border-none bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-lg">
                  <div className="space-y-3 p-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Outstanding balance</p>
                    <p className="text-3xl font-black tracking-tight">LKR 0.00</p>
                    <p className="text-sm font-medium text-white/80">No charges due at the moment. Your account is currently clear.</p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wide">
                        <HiCheckCircle className="h-4 w-4" /> Account in good standing
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
                  <div className="space-y-4 p-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick actions</p>
                    <Button onClick={() => setShowPayModal(true)}
                      className="w-full rounded-xl border-0 bg-gradient-to-r from-blue-600 to-cyan-500 font-bold uppercase tracking-wide shadow-md hover:from-blue-700 hover:to-cyan-600">
                      Pay now
                    </Button>
                    <InvoiceDownloadMenu />
                  </div>
                </Card>
              </div>

              <Card className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
                <div className="grid gap-4 p-2 md:grid-cols-3">
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Total paid</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">LKR 5,700</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Invoices</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">03</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Payment status</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">Active</p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === "history" && (
            <Card className="overflow-hidden rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Recent activity</h3>
                <InvoiceDownloadMenu />
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
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{row.id}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{row.date}</td>
                        <td className="px-6 py-4">{row.label}</td>
                        <td className="px-6 py-4">{row.amount}</td>
                        <td className="px-6 py-4">
                          <Badge color={row.status === "Free" ? "gray" : "info"}
                            className="rounded-lg px-2 py-1 text-[10px] font-black uppercase">
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "methods" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
                <div className="space-y-3 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <HiCreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Card payments</h3>
                  <p className="text-sm text-slate-500">Visa and MasterCard can be connected here for course payments.</p>
                  <Button color="light" onClick={() => setShowPayModal(true)} className="rounded-xl font-bold">
                    Pay with card
                  </Button>
                </div>
              </Card>

              <Card className="rounded-[1.75rem] border-none bg-white shadow-sm ring-1 ring-slate-100">
                <div className="space-y-3 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                    <HiCash className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Bank transfers</h3>
                  <p className="text-sm text-slate-500">Add bank payment instructions or manual verification flow here.</p>
                  <Button color="light" onClick={() => toast.success("Bank transfer section can be connected next.")} className="rounded-xl font-bold">
                    View details
                  </Button>
                </div>
              </Card>
            </div>
          )}


        </div>
      </div>
    </>
  );
}
