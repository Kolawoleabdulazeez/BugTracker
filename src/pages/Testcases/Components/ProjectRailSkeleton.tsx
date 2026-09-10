export const ProjectRailSkeleton = () => (
  <div className="flex flex-col gap-1.5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="relative flex h-14 items-center gap-2.5 overflow-hidden rounded-[10px] border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04] px-3.5"
      >
        <div className="h-8 w-[3px] flex-shrink-0 rounded-sm bg-slate-200 dark:bg-white/[0.08]" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-[11px] rounded bg-slate-200 dark:bg-white/[0.08]" style={{ width: `${[68, 55, 75][i]}%` }} />
          <div className="h-[9px] rounded bg-slate-200 dark:bg-white/[0.08]" style={{ width: `${[40, 33, 45][i]}%` }} />
        </div>
 <div
  className="absolute inset-0 animate-shimmer"
  style={{
    background:
      "linear-gradient(90deg, transparent 0%, rgba(237,98,20,0.08) 50%, transparent 100%)",
    animationDelay: `${i * 0.15}s`,
  }}
/>
      </div>
    ))}
  </div>
);