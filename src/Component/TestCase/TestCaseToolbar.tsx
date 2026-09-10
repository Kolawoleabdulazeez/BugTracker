import { PRIORITY_CONFIG, PRIORITY_FILTERS, STATUS_CONFIG, STATUS_FILTERS } from "@/utils";
import { Priority, TestStatus } from "@/utils/types";
import { Search } from "lucide-react";

interface TestCaseToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: TestStatus | null;
  onFilterStatusChange: (v: TestStatus | null) => void;
  filterPriority: Priority | null;
  onFilterPriorityChange: (v: Priority | null) => void;
}

export const TestCaseToolbar = ({
  search, onSearchChange,
  filterStatus, onFilterStatusChange,
  filterPriority, onFilterPriorityChange,
}: TestCaseToolbarProps) => {
  const statusClass = (s: TestStatus | null) => {
    const active = filterStatus === s;
    if (!active) return "bg-transparent border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-secondary-500";
    if (s === null) return "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400";
    const c = STATUS_CONFIG[s];
    return `${c.chipBg} ${c.chipBorder} ${c.chipText}`;
  };

  const priorityClass = (p: Priority | null) => {
    const active = filterPriority === p;
    if (!active) return "bg-transparent border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-secondary-500";
    if (p === null) return "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400";
    const c = PRIORITY_CONFIG[p];
    return `${c.bg} ${c.border} ${c.text}`;
  };

  return (
    <div className="glass-card rounded-xl px-4 py-3.5 flex flex-col gap-2.5">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500 pointer-events-none" />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by title or ID…"
          className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] rounded-lg text-xs text-slate-700 dark:text-secondary-300 outline-none placeholder:text-slate-400 dark:placeholder:text-secondary-600 focus:border-orange-500/50"
        />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {STATUS_FILTERS.map(s => (
          <button
            key={s ?? "all"}
            onClick={() => onFilterStatusChange(s)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-[7px] border cursor-pointer text-[9px] font-bold tracking-[0.07em] uppercase transition-all duration-100 ${statusClass(s)}`}
          >
            {s === null ? "ALL" : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {PRIORITY_FILTERS.map(p => (
          <button
            key={p ?? "all"}
            onClick={() => onFilterPriorityChange(p)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-[7px] border cursor-pointer text-[9px] font-bold tracking-[0.07em] uppercase transition-all duration-100 ${priorityClass(p)}`}
          >
            {p === null ? "ALL" : PRIORITY_CONFIG[p].label}
          </button>
        ))}
      </div>
    </div>
  );
};