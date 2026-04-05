"use client";

import { useMemo, useState, useEffect } from "react";
import {
  HiCreditCard, HiDocumentText, HiCash, HiCheckCircle,
  HiDownload, HiX, HiLockClosed,
} from "react-icons/hi";
import toast from "react-hot-toast";

type TxStatus = "Paid" | "Pending" | "Free" | "Failed";
type TxItem = { id: string; date: string; label: string; amount: string; raw: number; status: TxStatus };

const MOCK_TX: TxItem[] = [
  { id: "tx-1024", date: "2025-03-12", label: "Course bundle — Spring track", amount: "LKR 4,500.00", raw: 4500, status: "Paid" },
  { id: "tx-1023", date: "2025-02-01", label: "Certificate verification fee", amount: "LKR 1,200.00", raw: 1200, status: "Paid" },
  { id: "tx-1018", date: "2025-01-15", label: "Platform access (student)", amount: "LKR 0.00", raw: 0, status: "Free" },
];

const sidebarItems: { id: PaymentTab; label: string; icon: React.ElementType }[] = [
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

  const validateField = (k: string, val: string): string => {
    if (k === "name" && !val.trim()) return "Cardholder name is required.";
    if (k === "card" && val.replace(/\s/g, "").length !== 16) return "Enter a valid 16-digit card number.";
    if (k === "expiry") {
      const [mm, yy] = val.split("/");
      const month = parseInt(mm, 10);
      const year = parseInt("20" + yy, 10);
      const now = new Date();
      if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1))
        return "Enter a valid expiry date (MM/YY).";
    }
    if (k === "cvv" && val.replace(/\D/g, "").length < 3) return "CVV must be 3–4 digits.";
    if (k === "amount") {
      const amt = parseFloat(val);
      if (!val || isNaN(amt) || amt <= 0) return "Enter a valid amount greater than 0.";
    }
    return "";
  };

  const blur = (k: string) => {
    const err = validateField(k, form[k as keyof typeof form]);
    setErrors((e) => ({ ...e, [k]: err }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    (Object.keys(form) as (keyof typeof form)[]).forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) e[k] = err;
    });
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Payment processed successfully."); setDone(true); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 shadow-2xl overflow-y-auto max-h-[95vh]">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <HiCheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Successful</h3>
            <p className="text-sm text-white/50">LKR {parseFloat(form.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })} has been processed.</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiLockClosed className="h-4 w-4 text-green-400" />
                <h3 className="text-lg font-bold text-white">Secure Payment</h3>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10 transition">
                <HiX className="h-5 w-5 text-white/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Amount (LKR) *</label>
                <input type="number" min="1" value={form.amount} onChange={(e) => set("amount", e.target.value)} onBlur={() => blur("amount")} placeholder="e.g. 4500" autoComplete="off"
                  className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.amount ? "border-red-500" : "border-white/10"}`} />
                {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Cardholder Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} placeholder="Name on card" autoComplete="off"
                  className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.name ? "border-red-500" : "border-white/10"}`} />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Card Number *</label>
                <input value={form.card} onChange={(e) => set("card", formatCardNumber(e.target.value))} onBlur={() => blur("card")} placeholder="0000 0000 0000 0000" autoComplete="off"
                  className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.card ? "border-red-500" : "border-white/10"}`} />
                {errors.card && <p className="mt-1 text-xs text-red-400">{errors.card}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1">Expiry *</label>
                  <input value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} onBlur={() => blur("expiry")} placeholder="MM/YY" autoComplete="off"
                    className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.expiry ? "border-red-500" : "border-white/10"}`} />
                  {errors.expiry && <p className="mt-1 text-xs text-red-400">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1">CVV *</label>
                  <input value={form.cvv} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={() => blur("cvv")} placeholder="•••" type="text" inputMode="numeric" autoComplete="off"
                    style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
                    className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.cvv ? "border-red-500" : "border-white/10"}`} />
                  {errors.cvv && <p className="mt-1 text-xs text-red-400">{errors.cvv}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/60 hover:bg-white/5 transition">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-blue-500 hover:to-cyan-400 transition disabled:opacity-60">
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

function renderInvoiceCanvas(txList: TxItem[] = MOCK_TX): HTMLCanvasElement {
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
  txList.forEach((tx, idx) => {
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
  const divY = 155 + txList.length * 48 + 10;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, divY); ctx.lineTo(W - 40, divY); ctx.stroke();

  // total
  const total = txList.filter((t) => t.status === "Paid").reduce((s, t) => s + t.raw, 0);
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

function downloadInvoices(format: "pdf" | "jpeg" | "jpg", txList: TxItem[]) {
  const canvas = renderInvoiceCanvas(txList);

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

// ── Single invoice canvas ─────────────────────────────────────────────────────

function renderSingleInvoiceCanvas(tx: TxItem): HTMLCanvasElement {
  const W = 794, H = 420;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // header
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#1d4ed8"); grad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 80);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial";
  ctx.fillText("MatchNexus", 40, 48);
  ctx.font = "12px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText("Invoice Receipt", 40, 66);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "11px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Generated: ${new Date().toLocaleDateString("en-LK")}`, W - 40, 48);
  ctx.fillText(`Ref: ${tx.id}`, W - 40, 66);
  ctx.textAlign = "left";

  // invoice box
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath(); (ctx as any).roundRect(40, 110, W - 80, 200, 12); ctx.fill();
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
  ctx.beginPath(); (ctx as any).roundRect(40, 110, W - 80, 200, 12); ctx.stroke();

  const rows: [string, string][] = [
    ["Reference", tx.id],
    ["Date", tx.date],
    ["Description", tx.label],
    ["Amount", tx.amount],
    ["Status", tx.status],
  ];

  rows.forEach(([key, val], i) => {
    const y = 148 + i * 34;
    ctx.fillStyle = "#64748b"; ctx.font = "11px Arial";
    ctx.fillText(key.toUpperCase(), 64, y);
    ctx.fillStyle = "#0f172a"; ctx.font = "bold 13px Arial";
    ctx.fillText(val, 260, y);
  });

  // status badge
  const badgeX = 260, badgeY = 148 + 4 * 34;
  ctx.fillStyle = tx.status === "Paid" ? "#dbeafe" : "#f1f5f9";
  ctx.beginPath(); (ctx as any).roundRect(badgeX - 4, badgeY - 14, 60, 20, 6); ctx.fill();
  ctx.fillStyle = tx.status === "Paid" ? "#1d4ed8" : "#64748b";
  ctx.font = "bold 10px Arial";
  ctx.fillText(tx.status.toUpperCase(), badgeX + 4, badgeY);

  // footer
  ctx.fillStyle = "#94a3b8"; ctx.font = "11px Arial";
  ctx.fillText("MatchNexus Platform · This is a system-generated invoice.", 40, H - 20);

  return canvas;
}

function downloadSingleInvoice(tx: TxItem, format: "pdf" | "jpeg" | "jpg") {
  const canvas = renderSingleInvoiceCanvas(tx);
  const filename = `invoice-${tx.id}`;

  if (format === "pdf") {
    const blob = buildPdf(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.pdf`; a.click();
    URL.revokeObjectURL(url);
  } else {
    const url = canvas.toDataURL("image/jpeg", 0.95);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.${format}`; a.click();
  }
  toast.success(`${tx.id} downloaded as .${format}`);
}

function SingleInvoiceMenu({ tx }: { tx: TxItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Download invoice"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
      >
        <HiDownload className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-32 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden">
            {(["pdf", "jpeg", "jpg"] as const).map((fmt) => (
              <button key={fmt} onClick={() => { downloadSingleInvoice(tx, fmt); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-slate-900 transition uppercase">
                .{fmt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Bulk download menu ────────────────────────────────────────────────────────

function InvoiceDownloadMenu({ txList }: { txList: TxItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white/70 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-slate-800 transition">
        <HiDownload className="h-4 w-4" /> Download all invoices
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden">
            {(["pdf", "jpeg", "jpg"] as const).map((fmt) => (
              <button key={fmt} onClick={() => { downloadInvoices(fmt, txList); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-slate-900 transition uppercase">
                .{fmt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Add card modal ────────────────────────────────────────────────────────────

function AddCardModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validateField = (k: string, val: string): string => {
    if (k === "name" && !val.trim()) return "Name is required.";
    if (k === "card" && val.replace(/\s/g, "").length !== 16) return "Enter a valid 16-digit card number.";
    if (k === "expiry") {
      const [mm, yy] = val.split("/");
      const now = new Date();
      const month = parseInt(mm, 10); const year = parseInt("20" + yy, 10);
      if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1))
        return "Enter a valid expiry (MM/YY).";
    }
    if (k === "cvv" && val.replace(/\D/g, "").length < 3) return "CVV must be 3–4 digits.";
    return "";
  };

  const blur = (k: string) => {
    const err = validateField(k, form[k as keyof typeof form]);
    setErrors((e) => ({ ...e, [k]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    (Object.keys(form) as (keyof typeof form)[]).forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) errs[k] = err;
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    toast.success(`Card ending in ${form.card.replace(/\s/g, "").slice(-4)} added successfully.`);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 shadow-2xl overflow-y-auto max-h-[95vh]">
        {done ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-green-500/20 p-4"><HiCheckCircle className="h-10 w-10 text-green-400" /></div>
            <h3 className="text-lg font-bold text-white">Card Added</h3>
            <p className="text-sm text-white/50">Your card ending in {form.card.slice(-4)} has been saved.</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add New Card</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10"><HiX className="h-5 w-5 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Cardholder Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name on card" autoComplete="off" onBlur={() => blur("name")}
                  className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.name ? "border-red-500" : "border-white/10"}`} />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Card Number *</label>
                <input value={form.card} onChange={(e) => set("card", formatCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" autoComplete="off" onBlur={() => blur("card")}
                  className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.card ? "border-red-500" : "border-white/10"}`} />
                {errors.card && <p className="mt-1 text-xs text-red-400">{errors.card}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1">Expiry *</label>
                  <input value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} placeholder="MM/YY" autoComplete="off" onBlur={() => blur("expiry")}
                    className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.expiry ? "border-red-500" : "border-white/10"}`} />
                  {errors.expiry && <p className="mt-1 text-xs text-red-400">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1">CVV *</label>
                  <input value={form.cvv} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" type="text" inputMode="numeric" autoComplete="off"
                    style={{ WebkitTextSecurity: "disc" } as React.CSSProperties} onBlur={() => blur("cvv")}
                    className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/30 ${errors.cvv ? "border-red-500" : "border-white/10"}`} />
                  {errors.cvv && <p className="mt-1 text-xs text-red-400">{errors.cvv}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold uppercase text-white/60 hover:bg-white/5 transition">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-blue-500 transition">Add Card</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentPaymentHub() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("overview");
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: "c1", last4: "4242", brand: "Visa", expiry: "12/26" },
  ]);
  const [transactions, setTransactions] = useState<TxItem[]>(MOCK_TX);

  // Fetch real payments, fall back to mock if unavailable
  useEffect(() => {
    fetch("/api/student/payments")
      .then((r) => r.json())
      .then((data) => {
        if (data.payments && data.payments.length > 0) {
          setTransactions(data.payments);
        }
      })
      .catch(() => {
        // Keep mock data on error
      });
  }, []);

  const pageContent = useMemo(() => {
    switch (activeTab) {
      case "history":  return { title: "Payment History",   description: "View your recent transactions and download individual invoices." };
      case "methods":  return { title: "Payment Methods",   description: "Manage your saved cards and bank transfer details." };
      default:         return { title: "Payments & Billing", description: "Review balances, invoices, and account payment details." };
    }
  }, [activeTab]);

  return (
    <>
      {showPayModal && <PayNowModal onClose={() => setShowPayModal(false)} />}
      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />}

<<<<<<< HEAD
      <div className="space-y-5 rounded-3xl border border-blue-200/60 bg-white/70 p-5 shadow-lg backdrop-blur-md lg:p-6">
=======
      <div className="space-y-5 rounded-3xl border border-blue-200/60 p-5 shadow-lg backdrop-blur-md lg:p-6" style={{ background: "rgba(219,234,254,0.45)" }}>
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
        {/* Tab bar — icon card style matching courses */}
        <div className="flex gap-2">
          {sidebarItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} type="button" onClick={() => setActiveTab(id)}
                className={`group flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-br from-blue-500/25 to-cyan-500/15 border border-blue-400/35 text-slate-800 shadow-lg shadow-blue-500/10"
<<<<<<< HEAD
                    : "border border-blue-200 bg-white/80 text-slate-500 hover:bg-blue-50 hover:text-slate-800"
=======
                    : "border border-blue-200/60 bg-white/50 text-slate-600 hover:bg-white/70 hover:text-slate-800"
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
                }`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  active ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30" : "bg-white/10 text-slate-400 group-hover:bg-blue-50"
                }`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">{pageContent.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{pageContent.description}</p>
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-500/20">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Outstanding balance</p>
                <p className="mt-2 text-3xl font-black tracking-tight">LKR 0.00</p>
                <p className="mt-2 text-sm text-white/70">No charges due. Your account is clear.</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wide">
                  <HiCheckCircle className="h-4 w-4" /> Account in good standing
                </span>
              </div>
<<<<<<< HEAD
              <div className="rounded-2xl border border-blue-100 bg-white/70 p-6 space-y-3">
=======
              <div className="rounded-2xl border border-blue-200/50 p-6 space-y-3" style={{ background: "rgba(255,255,255,0.55)" }}>
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick actions</p>
                <button onClick={() => setShowPayModal(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md hover:from-blue-500 hover:to-cyan-400 transition">
                  Pay Now
                </button>
                <InvoiceDownloadMenu txList={transactions} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Total paid", value: "LKR 5,700", color: "from-blue-100 to-cyan-50 border-blue-200 text-blue-700" },
                { label: "Invoices", value: "03", color: "from-cyan-100 to-teal-50 border-cyan-200 text-cyan-700" },
                { label: "Payment status", value: "Active", color: "from-green-100 to-emerald-50 border-green-200 text-green-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-2xl border bg-gradient-to-br ${color} p-5`}>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── History ── */}
        {activeTab === "history" && (
<<<<<<< HEAD
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/70">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Recent activity</h3>
=======
          <div className="overflow-hidden rounded-2xl border border-blue-200/50 shadow-sm" style={{ background: "rgba(255,255,255,0.75)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100" style={{ background: "rgba(219,234,254,0.5)" }}>
              <h3 className="text-sm font-black uppercase tracking-wide text-gray-800">Recent activity</h3>
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
              <InvoiceDownloadMenu txList={transactions} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-sm">
<<<<<<< HEAD
                <thead className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-blue-50/60">
=======
                <thead className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-blue-100" style={{ background: "rgba(219,234,254,0.4)" }}>
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
                  <tr>
                    {["Reference", "Date", "Description", "Amount", "Status", "Invoice"].map((h) => (
                      <th key={h} className="px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
<<<<<<< HEAD
                <tbody className="divide-y divide-blue-50">
                  {transactions.map((row) => (
                    <tr key={row.id} className="text-slate-700 hover:bg-blue-50/40 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{row.id}</td>
                      <td className="px-6 py-4 text-xs">{row.date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{row.label}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase ${
                          row.status === "Free" ? "border-slate-500/30 bg-slate-500/20 text-slate-400" : "border-blue-400/30 bg-blue-500/15 text-blue-300"
=======
                <tbody className="divide-y divide-blue-50/60">
                  {transactions.map((row, idx) => (
                    <tr key={row.id} className="text-slate-700 transition"
                      style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(219,234,254,0.5)" }}>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{row.id}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{row.date}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{row.label}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          row.status === "Free"
                            ? "border-slate-200 bg-slate-100 text-slate-600"
                            : row.status === "Paid"
                            ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                            : "border-amber-200 bg-amber-100 text-amber-700"
>>>>>>> cc99c214bab67cb9fb7291429e7bb732576f63e9
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4"><SingleInvoiceMenu tx={row} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Methods ── */}
        {activeTab === "methods" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-100 bg-white/70 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <HiCreditCard className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Saved Cards</h3>
                </div>
                <button onClick={() => setShowAddCard(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition">
                  + Add Card
                </button>
              </div>
              <div className="divide-y divide-blue-50">
                {savedCards.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-slate-500">No cards saved yet.</p>
                ) : savedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-blue-100 border border-blue-200 text-xs font-black text-blue-700">
                        {card.brand}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">•••• •••• •••• {card.last4}</p>
                        <p className="text-xs text-slate-500">Expires {card.expiry}</p>
                      </div>
                    </div>
                    <button onClick={() => setSavedCards((prev) => prev.filter((c) => c.id !== card.id))}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition">
                      <HiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/70 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-100">
                <HiCash className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Bank Transfer Details</h3>
              </div>
              <div className="space-y-2 px-6 py-5">
                {[
                  ["Bank", "Bank of Ceylon"],
                  ["Account Name", "MatchNexus (Pvt) Ltd"],
                  ["Account Number", "0123456789"],
                  ["Branch", "Colombo Main"],
                  ["Swift Code", "BCEYLKLX"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
                    <span className="text-sm font-bold text-slate-800">{value}</span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-slate-500">Use your student ID as the payment reference. Allow 1–2 business days for processing.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}




