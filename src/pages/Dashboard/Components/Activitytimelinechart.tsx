"use client";
import { useEffect, useRef } from "react";
import { ActivityTimeline } from "@/services/user/user.api";

interface ActivityTimelineChartProps {
  data: ActivityTimeline[];
}

export default function ActivityTimelineChart({ data }: ActivityTimelineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  const isDark =
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true;

  useEffect(() => {
    async function init() {
      const {
        Chart,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Filler,
        Tooltip,
        LineController,
      } = await import("chart.js");
      Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, LineController);

      if (!canvasRef.current) return;

      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }

      const labels = data.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      });
      const values = data.map((d) => d.activityCount);

      const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
      const labelColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Activity",
              data: values,
              borderColor: "#ED6214",
              backgroundColor: isDark ? "rgba(237,98,20,0.14)" : "rgba(237,98,20,0.1)",
              borderWidth: 1.5,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: "#ED6214",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: labelColor, font: { size: 11 }, maxTicksLimit: 6, autoSkip: true },
              grid: { color: gridColor },
              border: { display: false },
            },
            y: {
              ticks: { color: labelColor, font: { size: 11 } },
              grid: { color: gridColor },
              border: { display: false },
              min: 0,
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
  }, [data, isDark]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');`}</style>

      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-medium mb-1">
        Activity Timeline
      </p>
      <p className="text-slate-900 dark:text-white font-bold text-sm mb-4">
        Daily activity — last {data.length} days
      </p>

      <div className="flex-1" style={{ minHeight: 160 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}