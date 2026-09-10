"use client";
import { TopContributor } from "@/services/user/user.api";

interface TopContributorsProps {
  data: TopContributor[];
}

const BAR_COLORS = ["#ED6214", "#239A3C", "#3B6FE0", "#C92438", "#F4934C"];

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function TopContributors({ data }: TopContributorsProps) {
  const sorted = [...data].sort((a, b) => b.activityCount - a.activityCount);
  const max = sorted[0]?.activityCount || 1;

  return (
    <div className="glass-card rounded-2xl p-5 lg:min-h-[400px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500&display=swap');`}</style>

      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-medium mb-1">
        Leaderboard
      </p>
      <p className="text-slate-900 dark:text-white font-bold text-sm mb-5">Top contributors</p>

      <div className="flex flex-col gap-3">
        {sorted.map((contributor, i) => {
          const pct = Math.round((contributor.activityCount / max) * 100);
          const color = BAR_COLORS[i % BAR_COLORS.length];

          return (
            <div key={contributor.actorName} className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: i === 0 ? "#ED6214" : "#757575",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  width: 16,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>

              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  background: `${color}22`,
                  border: `1px solid ${color}44`,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color,
                }}
              >
                {getInitials(contributor.actorName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-900 dark:text-white text-xs font-medium truncate" style={{ maxWidth: "70%" }}>
                    {contributor.actorName}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color, fontSize: "0.7rem", fontWeight: 700 }}>
                    {contributor.activityCount}
                  </span>
                </div>

                <div className="rounded-full overflow-hidden h-[5px] bg-black/5 dark:bg-white/[0.07]">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}