interface ProjectStatsHeaderProps {
  projectName?: string;
  isLoading: boolean;
  stats: { total: number; passed: number; failed: number; pending: number };
}

export const ProjectStatsHeader = ({ projectName, isLoading, stats }: ProjectStatsHeaderProps) => {
  if (isLoading || !projectName) {
    return <div className="glass-card rounded-2xl px-6 py-5 h-20 animate-pulse" />;
  }

  const items = [
    ["TOTAL", stats.total, "text-slate-500 dark:text-secondary-400"],
    ["PASSED", stats.passed, "text-success-600 dark:text-success-400"],
    ["FAILED", stats.failed, "text-danger-600 dark:text-danger-400"],
    ["PENDING", stats.pending, "text-orange-600 dark:text-orange-400"],
  ] as const;

  return (
    <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-6 flex-wrap">
      <div className="flex-1 min-w-0">
        <p className="m-0 mb-0.5 text-[10px] text-slate-500 dark:text-secondary-500 tracking-[0.1em]">ACTIVE PROJECT</p>
        <p className="m-0 text-lg font-bold text-slate-900 dark:text-slate-200 truncate">{projectName}</p>
      </div>
      <div className="flex gap-4 flex-wrap">
        {items.map(([label, value, color]) => (
          <div key={label} className="text-center">
            <p className={`m-0 mb-0.5 text-lg font-medium ${color}`}>{value}</p>
            <p className="m-0 text-[8px] text-slate-500 dark:text-secondary-500 tracking-[0.1em]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};