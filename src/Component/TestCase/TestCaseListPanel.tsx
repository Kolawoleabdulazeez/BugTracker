import { Layers3, Zap, Plus, ShieldAlert } from "lucide-react";
import { TestRow } from "./TestRow";
import { TestCaseSummary } from "@/utils/types";
import { TestCaseEmptyState } from "./TestCaseEmptyState";

interface TestCaseListPanelProps {
  cases: TestCaseSummary[];
  filtered: TestCaseSummary[];
  projectName?: string;
  onAI: () => void;
  onManual: () => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

export const TestCaseListPanel = ({ cases, filtered, projectName, onAI, onManual, onDelete, onOpen }: TestCaseListPanelProps) => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.04] flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <Layers3 size={13} className="text-slate-400 dark:text-secondary-500" />
        <span className="text-[9px] text-slate-500 dark:text-secondary-500 tracking-[0.1em]">
          {filtered.length} TEST{filtered.length !== 1 ? "S" : ""}{projectName ? ` · ${projectName.toUpperCase()}` : ""}
        </span>
      </div>
      <div className="flex gap-2">
        <button onClick={onAI} className="flex items-center gap-1 px-2.5 py-1 bg-amber-400/10 dark:bg-amber-400/[0.06] border border-amber-400/25 rounded-[7px] cursor-pointer text-[9px] text-amber-600 dark:text-amber-400 font-bold">
          <Zap size={10} /> AI GEN
        </button>
        <button onClick={onManual} className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] rounded-[7px] cursor-pointer text-[9px] text-slate-500 dark:text-secondary-400 font-bold">
          <Plus size={10} /> ADD
        </button>
      </div>
    </div>

    {cases.length === 0 ? (
      <TestCaseEmptyState onAI={onAI} onManual={onManual} />
    ) : filtered.length === 0 ? (
      <div className="flex flex-col items-center px-10 py-16 text-center">
        <ShieldAlert size={24} className="text-slate-300 dark:text-secondary-700 mb-3" />
        <p className="m-0 text-[13px] text-slate-500 dark:text-secondary-500 font-semibold">No matching test cases</p>
        <p className="mt-1 m-0 text-[11px] text-slate-400 dark:text-secondary-700">try adjusting filters</p>
      </div>
    ) : (
      filtered.map((tc, i) => (
        <TestRow
          key={tc.id}
          tc={tc}
          index={i}
          onDelete={() => onDelete(tc.id)}
          onView={() => onOpen(tc.id)}
          onEdit={() => onOpen(tc.id)}
        />
      ))
    )}
  </div>
);