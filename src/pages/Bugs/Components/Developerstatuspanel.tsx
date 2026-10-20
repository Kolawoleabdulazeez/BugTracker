import React, { useState } from "react";
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  Play,
} from "lucide-react";
import { useUpdateDeveloperStatus } from "../../../services/bugs/useBugs";

/* ────────────────────────────────────────────────────────────────────────────
 * Types & config
 * ──────────────────────────────────────────────────────────────────────────── */

export type DevStatus =
  | "none"
  | "notassigned"
  | "notstarted"
  | "ongoing"
  | "blocked"
  | "fixed"
  | "notabug";

const ALL_STATUSES: DevStatus[] = [
  "none",
  "notassigned",
  "notstarted",
  "ongoing",
  "blocked",
  "fixed",
  "notabug",
];

/** The API may return "NotStarted", "not_started", "Not Started"… — normalise all of them. */
export const normalizeDevStatus = (raw?: string | null): DevStatus => {
  const key = (raw ?? "").toLowerCase().replace(/[^a-z]/g, "") as DevStatus;
  return ALL_STATUSES.includes(key) ? key : "none";
};

type Tone = "slate" | "info" | "danger" | "success";

// Full class strings so Tailwind's JIT can see them (no string interpolation).
const TONES: Record<
  Tone,
  { soft: string; border: string; text: string; solid: string; line: string }
> = {
  slate: {
    soft: "bg-slate-500/10",
    border: "border-slate-400/40",
    text: "text-slate-600 dark:text-slate-300",
    solid: "bg-slate-500",
    line: "bg-slate-500",
  },
  info: {
    soft: "bg-info-500/10",
    border: "border-info-500/40",
    text: "text-info-500",
    solid: "bg-info-500",
    line: "bg-info-500",
  },
  danger: {
    soft: "bg-danger-500/10",
    border: "border-danger-500/40",
    text: "text-danger-500",
    solid: "bg-danger-500",
    line: "bg-danger-500",
  },
  success: {
    soft: "bg-success-500/10",
    border: "border-success-500/40",
    text: "text-success-500",
    solid: "bg-success-500",
    line: "bg-success-500",
  },
};

type Meta = {
  label: string;
  hint: string;
  tone: Tone;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const META: Record<DevStatus, Meta> = {
  none: { label: "No status", hint: "Nothing reported yet", tone: "slate", icon: Circle },
  notassigned: { label: "Not assigned", hint: "Waiting for a developer", tone: "slate", icon: Circle },
  notstarted: { label: "Not started", hint: "Assigned, work hasn't begun", tone: "slate", icon: Circle },
  ongoing: { label: "Ongoing", hint: "You're working on it", tone: "info", icon: Play },
  blocked: { label: "Blocked", hint: "Waiting on something or someone", tone: "danger", icon: AlertTriangle },
  fixed: { label: "Fixed", hint: "Fix is done, ready for testing", tone: "success", icon: CheckCircle2 },
  notabug: { label: "Not a bug", hint: "Working as intended", tone: "slate", icon: Ban },
};

/** What a developer is allowed to pick. none / notassigned are system states. */
const SELECTABLE: DevStatus[] = ["notstarted", "ongoing", "blocked", "fixed", "notabug"];

/** Hard-to-undo outcomes get an explicit confirmation step. */
const NEEDS_CONFIRM = new Set<DevStatus>(["fixed", "notabug"]);

/** Main happy-path rail. Blocked and Not a bug are branches off it. */
const TRACK: DevStatus[] = ["notstarted", "ongoing", "fixed"];

/* ────────────────────────────────────────────────────────────────────────────
 * Progress rail
 * ──────────────────────────────────────────────────────────────────────────── */

const ProgressRail = ({ current }: { current: DevStatus }) => {
  const trackIndex = current === "blocked" ? 1 : TRACK.indexOf(current);
  const closedAsNotBug = current === "notabug";
  const fillPct = trackIndex < 0 ? 0 : (trackIndex / (TRACK.length - 1)) * 100;
  const fillTone: Tone =
    current === "blocked" ? "danger" : current === "fixed" ? "success" : "info";

  return (
    <div className="relative" aria-hidden="true">
      {/* base line + animated fill */}
      <div className="absolute left-8 right-8 top-4 h-0.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
      <div
        className={`absolute left-8 top-4 h-0.5 -translate-y-1/2 rounded-full transition-all duration-500 ease-out ${TONES[fillTone].line}`}
        style={{ width: `calc((100% - 4rem) * ${fillPct / 100})` }}
      />

      <div className="relative flex justify-between">
        {TRACK.map((step, i) => {
          const isActive = !closedAsNotBug && i === trackIndex;
          const isDone = !closedAsNotBug && (i < trackIndex || (current === "fixed" && i === trackIndex));
          const stepTone: Tone =
            isActive && current === "blocked" ? "danger" : step === "fixed" ? "success" : "info";
          const Icon = isActive && current === "blocked" ? AlertTriangle : META[step].icon;

          return (
            <div key={step} className="flex w-16 flex-col items-center gap-2">
              <div className="relative">
                {isActive && !isDone && (
                  <span
                    className={`absolute inset-0 animate-ping rounded-full opacity-30 motion-reduce:hidden ${TONES[stepTone].solid}`}
                  />
                )}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isDone
                      ? `${TONES[stepTone].solid} border-transparent text-white`
                      : isActive
                      ? `${TONES[stepTone].soft} ${TONES[stepTone].border} ${TONES[stepTone].text}`
                      : "border-slate-200 bg-white text-slate-300 dark:border-white/10 dark:bg-secondary-800 dark:text-white/20"
                  }`}
                >
                  {isDone ? <Check size={16} strokeWidth={3} /> : <Icon size={14} />}
                </div>
              </div>
              <span
                className={`text-center text-xs font-medium transition-colors ${
                  isActive || isDone
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-secondary-500"
                }`}
              >
                {META[step].label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
 * Main panel
 * ──────────────────────────────────────────────────────────────────────────── */

type Props = {
  bugId: string;
  projectId: string;
  /** Raw value from bug.developerStatus */
  status?: string | null;
  /** True only for the developer assigned to this bug. The API enforces this too. */
  canEdit?: boolean;
};

const DeveloperStatusPanel = ({ bugId, projectId, status, canEdit = true }: Props) => {
  const current = normalizeDevStatus(status);
  const currentMeta = META[current];
  const CurrentIcon = currentMeta.icon;

  const [pending, setPending] = useState<DevStatus | null>(null);
  const { mutate, isPending, variables } = useUpdateDeveloperStatus(projectId);

  const locked = !canEdit;
  const busy = isPending;

  const apply = (next: DevStatus) => {
    mutate({ bugId, developerStatus: next }, { onSettled: () => setPending(null) });
  };

  const handlePick = (next: DevStatus) => {
    if (locked || busy || next === current) return;
    if (NEEDS_CONFIRM.has(next)) {
      setPending((prev) => (prev === next ? null : next));
    } else {
      setPending(null);
      apply(next);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header: title + live status chip */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Developer status
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${TONES[currentMeta.tone].soft} ${TONES[currentMeta.tone].border} ${TONES[currentMeta.tone].text}`}
          aria-live="polite"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <CurrentIcon size={12} />}
          {currentMeta.label}
        </span>
      </div>

      <ProgressRail current={current} />

      {current === "notabug" && (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-white/5 dark:text-secondary-400">
          Closed as not a bug. Pick another status to reopen it.
        </p>
      )}

      {/* Options */}
      <div
        role="radiogroup"
        aria-label="Developer status"
        className={`grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 ${
          locked ? "opacity-60" : ""
        }`}
      >
        {SELECTABLE.map((opt) => {
          const meta = META[opt];
          const Icon = meta.icon;
          const selected = opt === current;
          const staged = opt === pending;
          const saving = busy && variables?.developerStatus === opt;

          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={locked || busy}
              onClick={() => handlePick(opt)}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed dark:focus-visible:ring-offset-transparent ${
                selected
                  ? `${TONES[meta.tone].soft} ${TONES[meta.tone].border}`
                  : staged
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                  selected ? `${TONES[meta.tone].solid} text-white` : `${TONES[meta.tone].soft} ${TONES[meta.tone].text}`
                }`}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-900 dark:text-white">
                  {meta.label}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-secondary-400">
                  {meta.hint}
                </span>
              </span>
              {selected && <Check size={16} className={TONES[meta.tone].text} />}
            </button>
          );
        })}
      </div>

      {/* Confirmation drawer (animates open with grid-rows) */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          pending ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {pending && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-3">
              <p className="text-sm text-slate-800 dark:text-white">
                Mark this bug as <span className="font-semibold">{META[pending].label.toLowerCase()}</span>?
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-secondary-400">
                {pending === "fixed"
                  ? "The tester will be able to verify your fix."
                  : "This tells the team the report doesn't need a code change."}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  disabled={busy}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => apply(pending)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {busy && <Loader2 size={12} className="animate-spin" />}
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {locked && (
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-white/5 dark:text-secondary-400">
          <Lock size={13} className="flex-shrink-0" />
          Only the assigned developer can change this status.
        </div>
      )}
    </div>
  );
};

export default DeveloperStatusPanel;