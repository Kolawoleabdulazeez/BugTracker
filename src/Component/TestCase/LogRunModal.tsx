import { useState } from "react";
import { Play, X, Plus, Trash2, Loader2 } from "lucide-react";
import { CreateTestRunParam } from "@/services/testcases/testcases.api";
import { BUG_PRIORITIES, BUG_SEVERITIES, BugPriority, BugSeverity, RUN_RESULT_STYLE, RUN_RESULTS, RunResult } from "@/utils";


const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-slate-800 dark:text-[#e2e8f0] outline-none placeholder:text-slate-400 dark:placeholder:text-[#334155] focus:border-orange-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls =
  "mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]";

interface StepRow {
  stepNumber: string;
  result: RunResult;
  actualOutcome: string;
}

type BugMode = "none" | "link" | "create";

interface LogRunModalProps {
  testCaseLabel: string;
  testCaseTitle: string;
  onClose: () => void;
  onSave: (payload: CreateTestRunParam) => void;
  isSaving?: boolean;
}

const emptyStep = (): StepRow => ({ stepNumber: "", result: "passed", actualOutcome: "" });

export const LogRunModal = ({
  testCaseLabel,
  testCaseTitle,
  onClose,
  onSave,
  isSaving = false,
}: LogRunModalProps) => {
  const [result, setResult] = useState<RunResult>("passed");
  const [environment, setEnvironment] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [steps, setSteps] = useState<StepRow[]>([]);

  const [bugMode, setBugMode] = useState<BugMode>("none");
  const [linkedBugId, setLinkedBugId] = useState("");
  const [bugTitle, setBugTitle] = useState("");
  const [bugSeverity, setBugSeverity] = useState<BugSeverity>("medium");
  const [bugPriority, setBugPriority] = useState<BugPriority>("medium");

  const isFailed = result === "failed";
  const activeBugMode: BugMode = isFailed ? bugMode : "none";

  const canSave =
    !isSaving &&
    (activeBugMode !== "link" || linkedBugId.trim().length > 0) &&
    (activeBugMode !== "create" || bugTitle.trim().length > 0);

  const updateStep = (i: number, patch: Partial<StepRow>) =>
    setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const chooseBugMode = (mode: BugMode) => {
    setBugMode(mode);
    if (mode === "create" && !bugTitle) {
      setBugTitle(`${testCaseLabel} failed: ${testCaseTitle}`);
    }
  };

  const handleSave = () => {
    if (!canSave) return;

    const payload: CreateTestRunParam = { result };

    if (environment.trim()) payload.environment = environment.trim();
    if (appVersion.trim()) payload.appVersion = appVersion.trim();
    if (notes.trim()) payload.notes = notes.trim();
    if (duration.trim() !== "" && !Number.isNaN(Number(duration))) {
      payload.duration = Number(duration);
    }

    const stepResults = steps
      .filter(s => s.stepNumber.trim() !== "" && !Number.isNaN(Number(s.stepNumber)))
      .map(s => ({
        stepNumber: Number(s.stepNumber),
        result: s.result,
        actualOutcome: s.actualOutcome.trim(),
      }));
    if (stepResults.length) payload.stepResults = stepResults;

    // Never send linkedBugId and autoCreateBug together
    if (activeBugMode === "link") {
      payload.linkedBugId = linkedBugId.trim();
    } else if (activeBugMode === "create") {
      payload.autoCreateBug = true;
      payload.autoCreateBugTitle = bugTitle.trim();
      payload.autoCreateBugSeverity = bugSeverity;
      payload.autoCreateBugPriority = bugPriority;
    }

    onSave(payload);
  };

  return (
    <div
      onClick={e => !isSaving && e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md"
    >
      <div className="w-full max-w-[600px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 dark:border-white/[0.08] dark:bg-secondary-900/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.35)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] px-6 py-[18px]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[9px] border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04]">
              <Play size={15} className="text-slate-400 dark:text-[#64748b]" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-900 dark:text-[#e2e8f0]">Log Test Run</p>
              <p className="truncate text-[10px] text-slate-400 dark:text-[#475569]">
                {testCaseLabel} · {testCaseTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex cursor-pointer items-center rounded-[7px] border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.04] p-[5px_7px] text-slate-400 dark:text-[#475569] transition-colors hover:text-slate-600 dark:hover:text-[#94a3b8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={14} />
          </button>
        </div>

        <fieldset disabled={isSaving} className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-6 py-6">
          <div>
            <label className={labelCls}>RESULT *</label>
            <div className="flex gap-1.5">
              {RUN_RESULTS.map(r => {
                const active = result === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setResult(r)}
                    className={`flex-1 cursor-pointer rounded-lg border py-2 text-[9px] font-bold tracking-[0.08em] uppercase transition-all duration-[120ms] disabled:opacity-50 ${
                      active
                        ? RUN_RESULT_STYLE[r].chip
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-[#334155]"
                    }`}
                  >
                    {RUN_RESULT_STYLE[r].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className={labelCls}>ENVIRONMENT</label>
              <input value={environment} onChange={e => setEnvironment(e.target.value)} placeholder="e.g. staging" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>APP VERSION</label>
              <input value={appVersion} onChange={e => setAppVersion(e.target.value)} placeholder="e.g. 2.4.1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>DURATION (SECONDS)</label>
              <input type="number" min={0} value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 90" className={inputCls} />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">STEP RESULTS</label>
              <button
                type="button"
                onClick={() => setSteps(prev => [...prev, emptyStep()])}
                className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 cursor-pointer bg-transparent border-none"
              >
                <Plus size={11} /> add step result
              </button>
            </div>
            {steps.length === 0 ? (
              <p className="m-0 text-[11px] text-slate-400 dark:text-[#475569]">
                Optional. Add a row for each step you want to record.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-16 flex-shrink-0">
                      <input
                        type="number"
                        min={0}
                        value={s.stepNumber}
                        onChange={e => updateStep(i, { stepNumber: e.target.value })}
                        placeholder="Step #"
                        className={inputCls}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <select
                        value={s.result}
                        onChange={e => updateStep(i, { result: e.target.value as RunResult })}
                        className={inputCls}
                      >
                        {RUN_RESULTS.map(r => (
                          <option key={r} value={r}>{RUN_RESULT_STYLE[r].label}</option>
                        ))}
                      </select>
                      <input
                        value={s.actualOutcome}
                        onChange={e => updateStep(i, { actualOutcome: e.target.value })}
                        placeholder="Actual outcome"
                        className={inputCls}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSteps(prev => prev.filter((_, idx) => idx !== i))}
                      className="mt-2.5 cursor-pointer bg-transparent border-none text-slate-400 dark:text-slate-600 hover:text-danger-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>NOTES</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything worth recording about this run…" className={`${inputCls} resize-none`} />
          </div>

          {isFailed && (
            <div className="rounded-xl border border-danger-500/20 bg-danger-500/[0.04] p-3.5 flex flex-col gap-3">
              <label className="block text-[9px] font-bold tracking-[0.1em] text-danger-600 dark:text-danger-400">BUG</label>
              <div className="flex gap-1.5">
                {([
                  ["none", "No bug"],
                  ["link", "Link existing"],
                  ["create", "Create new"],
                ] as const).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => chooseBugMode(mode)}
                    className={`flex-1 cursor-pointer rounded-lg border py-2 text-[10px] font-bold transition-all duration-[120ms] ${
                      bugMode === mode
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "border-slate-200 dark:border-white/[0.06] bg-transparent text-slate-500 dark:text-[#475569]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {bugMode === "link" && (
                <input value={linkedBugId} onChange={e => setLinkedBugId(e.target.value)} placeholder="Existing bug ID" className={inputCls} />
              )}

              {bugMode === "create" && (
                <div className="flex flex-col gap-2">
                  <input value={bugTitle} onChange={e => setBugTitle(e.target.value)} placeholder="Bug title" className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>SEVERITY</label>
                      <select value={bugSeverity} onChange={e => setBugSeverity(e.target.value as BugSeverity)} className={inputCls}>
                        {BUG_SEVERITIES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>PRIORITY</label>
                      <select value={bugPriority} onChange={e => setBugPriority(e.target.value as BugPriority)} className={inputCls}>
                        {BUG_PRIORITIES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </fieldset>

        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 cursor-pointer rounded-[10px] border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] py-3 text-xs font-semibold text-slate-500 dark:text-[#475569] transition-colors hover:text-slate-700 dark:hover:text-[#94a3b8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-[2] flex items-center justify-center gap-2 rounded-[10px] border py-3 text-[13px] font-bold transition-all duration-150 ${
              canSave
                ? "cursor-pointer border-orange-500/40 bg-orange-500 text-white hover:bg-orange-600"
                : "cursor-not-allowed border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.01] text-slate-300 dark:text-[#1e293b]"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Logging…
              </>
            ) : (
              "Log Run"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};