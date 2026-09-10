import { SummaryCards } from "@/services/user/user.api";

export default function StatStrip({ data }: { data: SummaryCards }) {
  const stats = [
    { label: "Open", value: data.openBugs, colorVar: "--status-open" },
    { label: "In progress", value: data.inProgressBugs, colorVar: "--status-progress" },
    { label: "Closed", value: data.closedBugs, colorVar: "--status-closed" },
  ];

  return (
    <div className="flex items-center gap-6 px-5 py-3 border-b border-hairline bg-surface-1  text-sm">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(var(${s.colorVar}))` }} />
          <span className="text-ink font-bold">{s.value}</span>
          <span className="text-ink-muted">{s.label}</span>
        </div>
      ))}
      <span className="text-ink-muted ml-auto text-xs">{data.totalBugs} total</span>
    </div>
  );
}