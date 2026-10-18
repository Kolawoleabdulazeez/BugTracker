import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Eye, Check, ChevronDown, Loader2, Play } from "lucide-react";
import { Chip } from "./Chip";
import { PriBadge } from "./PriBadge";
import { AnchoredPopover } from "./AnchoredPopover";
import { TestCaseSummary, TestCaseLifecycleStatus } from "@/utils/types";
import { getLifecycleConfig, LIFECYCLE_CONFIG } from "@/utils";

const STATUS_OPTIONS = (
  Object.keys(LIFECYCLE_CONFIG) as TestCaseLifecycleStatus[]
).map((value) => ({ value, ...LIFECYCLE_CONFIG[value] }));

interface TestRowProps {
  tc: TestCaseSummary;
  index: number;
  onDelete: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onRun?: () => void;
  onStatusChange?: (status: TestCaseLifecycleStatus) => void;
  isUpdatingStatus?: boolean;
}

interface IconActionProps {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const IconAction = ({ label, onClick, danger, disabled, children }: IconActionProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    disabled={disabled}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`flex items-center justify-center w-7 h-7 rounded-md border cursor-pointer transition-colors bg-slate-100 dark:bg-white/[0.05] border-slate-200 dark:border-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed ${
      danger
        ? "text-danger-600 dark:text-danger-400 hover:bg-danger-500/10"
        : "text-slate-500 dark:text-secondary-400 hover:bg-slate-200 dark:hover:bg-white/[0.1]"
    }`}
  >
    {children}
  </button>
);

export const TestRow = ({
  tc,
  index,
  onDelete,
  onView,
  onEdit,
  onRun,
  onStatusChange,
  isUpdatingStatus,
}: TestRowProps) => {
  const [hover, setHover] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const statusBtnRef = useRef<HTMLButtonElement>(null);

  const statusCfg = getLifecycleConfig(tc.status);
  const currentStatus = tc.status;
  const canRun = currentStatus === "active";

  useEffect(() => {
    if (!confirmingDelete) return;
    const t = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmingDelete]);

  const pinActions = statusOpen || confirmingDelete;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.04] transition-all duration-100 relative group ${
        isUpdatingStatus ? "opacity-60 pointer-events-none" : ""
      }`}
      style={{ background: hover ? "rgba(237, 98, 20, 0.03)" : "transparent" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-150"
        style={{ background: hover ? statusCfg.barHex : "transparent" }}
      />

      <span className="hidden sm:block text-[10px] font-semibold text-slate-400 dark:text-secondary-500 mt-1 min-w-[24px] flex-shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Status chip doubles as the status control */}
      <div className="flex-shrink-0 mt-0.5">
        <button
          ref={statusBtnRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={statusOpen}
          aria-label="Change status"
          onClick={() => setStatusOpen((o) => !o)}
          className="flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
        >
          <Chip status={tc.status} />
          {isUpdatingStatus ? (
            <Loader2
              size={11}
              className="animate-spin text-slate-400 dark:text-secondary-500"
            />
          ) : (
            <ChevronDown
              size={11}
              className={`text-slate-400 dark:text-secondary-500 transition-transform ${
                statusOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        <AnchoredPopover
          anchorRef={statusBtnRef}
          open={statusOpen}
          onClose={() => setStatusOpen(false)}
          align="start"
        >
          <div className="glass-panel rounded-lg py-1 min-w-[170px] shadow-2xl">
            <p className="m-0 px-3.5 pt-1.5 pb-1 text-[9px] tracking-[0.1em] font-bold text-slate-400 dark:text-secondary-500">
              SET STATUS
            </p>
            {STATUS_OPTIONS.map((opt) => {
              const isCurrent = currentStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isCurrent}
                  disabled={isCurrent}
                  onClick={() => {
                    onStatusChange?.(opt.value);
                    setStatusOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 bg-transparent border-none cursor-pointer text-xs text-slate-600 dark:text-secondary-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:cursor-default disabled:hover:bg-transparent"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isCurrent && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </AnchoredPopover>
      </div>

      {/* Content: clicking opens the detail modal */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onView?.()}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] text-slate-400 dark:text-secondary-500 tracking-[0.06em]">
            {tc.caseLabel}
          </span>
          <PriBadge priority={tc.priority} />
        </div>
        <p className="mt-1 mb-0.5 text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
          {tc.title}
        </p>
        <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500 leading-relaxed">
          {tc.stepCount} step{tc.stepCount !== 1 ? "s" : ""}
        </p>
        <div className="mt-1.5 flex gap-1 flex-wrap">
          {tc.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] text-orange-600 dark:text-orange-400 bg-orange-500/[0.07] border border-orange-500/[0.15] px-[7px] py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-3 mt-0.5">
        {tc.assignedTo && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-info-500/15 border border-info-500/30 flex items-center justify-center text-[8px] font-bold text-info-600 dark:text-info-400 flex-shrink-0">
              {tc.assignedTo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span className="hidden md:block text-[10px] text-slate-400 dark:text-secondary-500">
              {tc.assignedTo.name}
            </span>
          </div>
        )}

        {/* Always visible on touch, revealed on hover/focus on desktop */}
        <div
          className={`flex items-center gap-1 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 ${
            pinActions ? "md:!opacity-100" : ""
          }`}
        >
          <IconAction
            label={canRun ? "Log run" : "Set to active to log a run"}
            disabled={!canRun}
            onClick={() => onRun?.()}
          >
            <Play size={13} />
          </IconAction>
          <IconAction label="View" onClick={() => onView?.()}>
            <Eye size={13} />
          </IconAction>
          <IconAction label="Edit" onClick={() => onEdit?.()}>
            <Pencil size={13} />
          </IconAction>

          {confirmingDelete ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingDelete(false);
                onDelete();
              }}
              className="flex items-center gap-1 h-7 px-2 rounded-md border cursor-pointer text-[10px] font-bold text-white bg-danger-600 border-danger-600"
            >
              <Trash2 size={12} /> Confirm?
            </button>
          ) : (
            <IconAction
              label="Delete"
              danger
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 size={13} />
            </IconAction>
          )}
        </div>
      </div>
    </div>
  );
};