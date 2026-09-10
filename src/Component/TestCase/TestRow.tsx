import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { Chip } from "./Chip";
import { PriBadge } from "./PriBadge";
import { TestCaseSummary } from "@/utils/types";
import { STATUS_CONFIG } from "@/utils";

const ROW_ACTIONS = [
  { key: "view", icon: <Eye size={12} />, label: "View", danger: false },
  { key: "edit", icon: <Pencil size={12} />, label: "Edit", danger: false },
  { key: "delete", icon: <Trash2 size={12} />, label: "Delete", danger: true },
] as const;

interface TestRowProps {
  tc: TestCaseSummary;
  index: number;
  onDelete: () => void;
  onView?: () => void;
  onEdit?: () => void;
}

export const TestRow = ({ tc, index, onDelete, onView, onEdit }: TestRowProps) => {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = (key: (typeof ROW_ACTIONS)[number]["key"]) => {
    if (key === "delete") onDelete();
    if (key === "view") onView?.();
    if (key === "edit") onEdit?.();
    setMenuOpen(false);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMenuOpen(false); }}
      className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.04] transition-colors duration-100 relative group"
      style={{ background: hover ? "rgba(237, 98, 20, 0.03)" : "transparent" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-150"
        style={{ background: hover ? STATUS_CONFIG[tc.status].barHex : "transparent" }}
      />

      <span className="hidden sm:block text-[10px] font-semibold text-slate-400 dark:text-secondary-500 mt-1 min-w-[24px] flex-shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex-shrink-0 mt-0.5">
        <Chip status={tc.status} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] text-slate-400 dark:text-secondary-500 tracking-[0.06em]">{tc.caseLabel}</span>
          <PriBadge priority={tc.priority} />
        </div>
        <p className="mt-1 mb-0.5 text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-snug">{tc.title}</p>
        <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500 leading-relaxed">
          {tc.stepCount} step{tc.stepCount !== 1 ? "s" : ""}
        </p>
        <div className="mt-1.5 flex gap-1 flex-wrap">
          {tc.tags.map(t => (
            <span key={t} className="text-[9px] text-orange-600 dark:text-orange-400 bg-orange-500/[0.07] border border-orange-500/[0.15] px-[7px] py-0.5 rounded-full">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
        {tc.assignedTo && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-info-500/15 border border-info-500/30 flex items-center justify-center text-[8px] font-bold text-info-600 dark:text-info-400 flex-shrink-0">
              {tc.assignedTo.name.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="hidden md:block text-[10px] text-slate-400 dark:text-secondary-500">{tc.assignedTo.name}</span>
          </div>
        )}

        <div className={`relative transition-opacity duration-150 ${hover ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] rounded-md p-1 cursor-pointer text-slate-500 dark:text-secondary-500 flex items-center"
          >
            <MoreVertical size={13} />
          </button>
          {menuOpen && (
            <div className="glass-panel absolute right-0 top-8 z-30 rounded-lg py-1 min-w-[140px] shadow-2xl">
              {ROW_ACTIONS.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleAction(item.key)}
                  className={`w-full flex items-center gap-2 px-3.5 py-2 bg-transparent border-none cursor-pointer text-xs ${item.danger ? "text-danger-600 dark:text-danger-400" : "text-slate-500 dark:text-secondary-400"}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};