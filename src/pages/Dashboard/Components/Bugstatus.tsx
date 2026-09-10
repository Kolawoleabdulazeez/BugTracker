"use client";
import { useEffect, useRef } from "react";
import { BugStatusDistribution } from "@/services/user/user.api";

interface BugStatusDonutProps {
  data: BugStatusDistribution;
}

const SEGMENTS = [
  { key: "open",       label: "Open",        color: "#C92438" }, // danger-500
  { key: "inProgress", label: "In Progress", color: "#ED6214" }, // orange-500
  { key: "closed",     label: "Closed",      color: "#239A3C" }, // success-500
  { key: "wontFix",    label: "Won't Fix",   color: "#757575" }, // secondary-400
  { key: "duplicate",  label: "Duplicate",   color: "#F4934C" }, // orange-400
] as const;

export default function BugStatusDonut({ data }: BugStatusDonutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  const total =
    data.open + data.inProgress + data.closed + data.wontFix + data.duplicate || 1;

  useEffect(() => {
    let Chart: typeof import("chart.js").Chart;

    async function init() {
      const { Chart: C, ArcElement, Tooltip, Legend, DoughnutController } =
        await import("chart.js");
      C.register(ArcElement, Tooltip, Legend, DoughnutController);
      Chart = C;

      if (!canvasRef.current) return;

      if (chartRef.current) {
        (chartRef.current as InstanceType<typeof C>).destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: SEGMENTS.map((s) => s.label),
          datasets: [
            {
              data: SEGMENTS.map((s) => data[s.key]),
              backgroundColor: SEGMENTS.map((s) => s.color),
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.parsed} bugs`,
              },
            },
          },
        },
      });
    }

    init();

    return () => {
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [data]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');`}</style>

      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-medium mb-1">
        Status Breakdown
      </p>
      <p className="text-slate-900 dark:text-white font-bold text-sm mb-4">Bug distribution</p>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
        {SEGMENTS.map(({ label, color, key }) => {
          const pct = Math.round((data[key] / total) * 100);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                {label} <span className="text-slate-700 dark:text-slate-300 font-medium">{pct}%</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative flex-1" style={{ minHeight: 160 }}>
        <canvas ref={canvasRef} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span style={{ fontFamily: "'DM Mono', monospace", color: "#ED6214", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>
            {total}
          </span>
          <span className="text-slate-500 text-xs mt-0.5">total bugs</span>
        </div>
      </div>
    </div>
  );
}