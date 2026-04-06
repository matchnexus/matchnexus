"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StudentCoursesHub from "@/components/student/courses";
import StudentPaymentHub from "@/components/student/payment";
import {
  HiAcademicCap,
  HiCreditCard,
  HiSparkles,
  HiLightningBolt,
  HiTrendingUp,
  HiBookOpen,
  HiLockClosed,
  HiX,
} from "react-icons/hi";

const MANAGE_PIN = "admin2024";

type HubTab = "courses" | "payment";

const tabs: { id: HubTab; label: string; icon: typeof HiAcademicCap }[] = [
  { id: "courses", label: "Course Hub", icon: HiAcademicCap },
  { id: "payment", label: "Payments", icon: HiCreditCard },
];

export default function StudentHubPage() {
  const [tab, setTab] = useState<HubTab>("courses");
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const router = useRouter();

  // Hidden shortcut: Ctrl+Shift+M
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "M") {
        e.preventDefault();
        setShowPinPrompt(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handlePinSubmit = useCallback(() => {
    if (pin === MANAGE_PIN) {
      setShowPinPrompt(false);
      setPin("");
      setPinError(false);
      router.push("/manage");
    } else {
      setPinError(true);
      setPin("");
    }
  }, [pin, router]);

  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)" }}>

      {/* Hidden admin PIN prompt — Ctrl+Shift+M */}
      {showPinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-slate-800/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiLockClosed className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-bold text-white">Admin Access</span>
              </div>
              <button onClick={() => { setShowPinPrompt(false); setPin(""); setPinError(false); }}
                className="rounded-lg p-1 hover:bg-white/10 transition">
                <HiX className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <input
              type="password"
              value={pin}
              autoFocus
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="Enter PIN"
              className={`w-full rounded-xl border bg-slate-700 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400 ${pinError ? "border-red-500" : "border-white/10"}`}
            />
            {pinError && <p className="mt-1.5 text-xs text-red-400">Incorrect PIN.</p>}
            <button onClick={handlePinSubmit}
              className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition">
              Go to Panel
            </button>
          </div>
        </div>
      )}

      {/* ── Full-bleed hero with blurred photo background ── */}
      <div className="relative min-h-[420px] w-full overflow-hidden md:min-h-[480px]">

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/photos/hero.jpg')" }}
        />

        {/* Lighter blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-800/40 to-blue-50/80" />

        {/* Glow accents — lighter */}
        <div className="pointer-events-none absolute top-10 right-1/4 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

        {/* Hero content */}
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-6 pb-12 pt-16 md:px-10 md:pb-16 md:pt-20">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/90 backdrop-blur-md">
              <HiSparkles className="h-3.5 w-3.5 text-yellow-300" />
              Student Dashboard
            </div>
            <a href="/manage"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur-md hover:bg-white/25 transition">
              ⚙ Admin
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Welcome back 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-3 max-w-lg text-base text-white/65 md:text-lg"
          >
            Track your learning, manage payments, and keep building your career — all in one place.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {[
              { icon: HiBookOpen, label: "Active Courses", value: "2", color: "from-blue-500/30 to-cyan-500/30 border-blue-400/30" },
              { icon: HiLightningBolt, label: "Completed", value: "1", color: "from-yellow-500/30 to-orange-500/30 border-yellow-400/30" },
              { icon: HiTrendingUp, label: "Avg Progress", value: "43%", color: "from-green-500/30 to-emerald-500/30 border-green-400/30" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-2xl border bg-gradient-to-br ${color} px-4 py-3 backdrop-blur-md`}
              >
                <Icon className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</p>
                  <p className="text-xl font-black text-white">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tab switcher — glass pill style */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
            className="mt-8 inline-flex gap-1.5 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-md"
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-white text-blue-700 shadow-lg"
                      : "text-white/70 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ zIndex: -1 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "courses" && <StudentCoursesHub />}
            {tab === "payment" && <StudentPaymentHub />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
