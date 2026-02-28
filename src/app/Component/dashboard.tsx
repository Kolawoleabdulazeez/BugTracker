"use client";
import { useEffect, useState } from "react";

const metrics = [
  { value: 48, label: "Total Tickets", sub: "All time",        color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  { value: 29, label: "Closed",        sub: "Resolved issues", color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  { value: 19, label: "Open",          sub: "Needs attention", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  { value: 7,  label: "In Progress",   sub: "Being worked on", color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
];

function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 80);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

export default function Dashboard() {
  const fixedPct = 59;
  const circumference = 2 * Math.PI * 38;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2744 100%)",
        minHeight: "220px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500&display=swap');`}</style>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-0 p-5 lg:p-6">

        {/* ── Left: fix-rate ring ── */}
        <div className="flex items-center gap-5 lg:pr-8 lg:border-r border-white/10 mb-5 lg:mb-0 lg:mr-8 flex-shrink-0">
          <div className="relative" style={{ width: 90, height: 90 }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="45" cy="45" r="38"
                fill="none"
                stroke="#34d399"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - fixedPct / 100)}
                transform="rotate(-90 45 45)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#34d399", fontSize: "1.2rem", fontWeight: 700 }}>
                {fixedPct}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm">Tickets Fixed</p>
            <p className="text-slate-400 text-xs mt-0.5">Sprint · Q1 2025</p>
            <div className="mt-2 w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${fixedPct}%` }} />
            </div>
          </div>
        </div>

        {/* ── Right: metrics + bar ── */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-medium">Project Insight</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metrics.map(({ value, label, sub, color, bg }) => (
              <div
                key={label}
                className="rounded-xl px-4 py-3 flex flex-col gap-0.5"
                style={{ background: bg, border: `1px solid ${color}30` }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", color, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>
                  <AnimatedNumber target={value} />
                </span>
                <span className="text-white text-sm font-medium mt-1">{label}</span>
                <span className="text-slate-500 text-xs">{sub}</span>
              </div>
            ))}
          </div>

          {/* Status distribution bar */}
          <div className="mt-4">
            <div className="flex rounded-full overflow-hidden h-1.5">
              <div style={{ width: "60%", background: "#34d399" }} title="Closed" />
              <div style={{ width: "2px", background: "#0f172a" }} />
              <div style={{ width: "25%", background: "#f87171" }} title="Open" />
              <div style={{ width: "2px", background: "#0f172a" }} />
              <div style={{ width: "15%", background: "#fbbf24" }} title="In Progress" />
            </div>
            <div className="flex gap-4 mt-2">
              {[
                { label: "Closed",      color: "#34d399" },
                { label: "Open",        color: "#f87171" },
                { label: "In Progress", color: "#fbbf24" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}