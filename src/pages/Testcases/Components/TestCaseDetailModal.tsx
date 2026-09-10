import { useEffect, useState } from "react";
import { X, Pencil, Loader2, Plus, Trash2 } from "lucide-react";
import { useGetTestcaseById, useUpdateTestcase } from "@/services/testcases/useTestcases";
import { Priority, Step } from "@/utils/types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/utils";
import { CreateTestcaseParam } from "@/services/testcases/testcases.api";
import { Chip } from "./Chip";
import { PriBadge } from "./PriBadge";

const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-slate-800 dark:text-[#e2e8f0] outline-none placeholder:text-slate-400 dark:placeholder:text-[#334155] focus:border-orange-500/50 transition-colors disabled:opacity-50";

interface TestCaseDetailModalProps {
  projectId: string;
  testCaseId: string;
  onClose: () => void;
  startInEditMode?: boolean;
}

const emptyStep: Step = { action: "", expectedOutcome: "" };

export const TestCaseDetailModal = ({ projectId, testCaseId, onClose, startInEditMode = false }: TestCaseDetailModalProps) => {
  const { data: tc, isLoading, isError } = useGetTestcaseById(projectId, testCaseId);
  const { mutate: updateTestcase, isPending: isSaving } = useUpdateTestcase(() => setMode("view"));

  const [mode, setMode] = useState<"view" | "edit">(startInEditMode ? "edit" : "view");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preconditions, setPreconditions] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [assignedToId, setAssignedToId] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ ...emptyStep }]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (tc && mode === "view") {
      setTitle(tc.title);
      setDescription(tc.description ?? "");
      setPreconditions((tc as any).preconditions ?? "");
      setExpectedResult(tc.expectedResult ?? "");
      setPriority(tc.priority);
      setAssignedToId((tc as any).assignedToId ?? "");
      setSteps(tc.steps?.length ? tc.steps : [{ ...emptyStep }]);
      setTags(tc.tags ?? []);
    }
  }, [tc, mode]);

  const enterEditMode = () => {
    if (!tc) return;
    setTitle(tc.title);
    setDescription(tc.description ?? "");
    setPreconditions((tc as any).preconditions ?? "");
    setExpectedResult(tc.expectedResult ?? "");
    setPriority(tc.priority);
    setAssignedToId((tc as any).assignedToId ?? "");
    setSteps(tc.steps?.length ? tc.steps : [{ ...emptyStep }]);
    setTags(tc.tags ?? []);
    setMode("edit");
  };

  const updateStep = (i: number, field: keyof Step, value: string) =>
    setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  const addStep = () => setSteps(prev => [...prev, { ...emptyStep }]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));

  const canSave = title.trim().length > 0 && steps.some(s => s.action.trim().length > 0) && !isSaving;

  const handleSave = () => {
    if (!canSave) return;
    const payload: CreateTestcaseParam = {
      title,
      description,
      preconditions,
      steps: steps.filter(s => s.action.trim().length > 0),
      expectedResult,
      priority,
      assignedToId,
      tags,
    };

    updateTestcase({ projectId, testCaseId, payload: payload });
  };

  return (
    <div onClick={e => !isSaving && e.target === e.currentTarget && onClose()} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 dark:border-white/[0.08] dark:bg-secondary-900/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.35)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] px-6 py-[18px]">
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-[#e2e8f0]">
              {mode === "edit" ? "Edit Test Case" : tc?.title ?? "Test Case"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-[#475569]">
              {mode === "edit" ? "editing" : tc ? (tc as any).caseLabel ?? tc.id : "loading…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mode === "view" && tc && (
              <button onClick={enterEditMode} className="flex cursor-pointer items-center gap-1 rounded-[7px] border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-[#94a3b8]">
                <Pencil size={12} /> Edit
              </button>
            )}
            <button onClick={onClose} disabled={isSaving} className="flex cursor-pointer items-center rounded-[7px] border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.04] p-[5px_7px] text-slate-400 dark:text-[#475569] disabled:opacity-50">
              <X size={14} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-600" />
          </div>
        ) : isError || !tc ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[13px] text-slate-400 dark:text-slate-500">Couldn't load this test case.</p>
          </div>
        ) : mode === "view" ? (
          <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-6 py-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Chip status={tc.status} />
              <PriBadge priority={tc.priority} />
              {tc.tags?.map(t => (
                <span key={t} className="text-[9px] text-orange-600 dark:text-orange-400 bg-orange-500/[0.07] border border-orange-500/[0.15] px-[7px] py-0.5 rounded-full">#{t}</span>
              ))}
            </div>

            {tc.description && (
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">DESCRIPTION</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">{tc.description}</p>
              </div>
            )}

            {(tc as any).preconditions && (
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">PRECONDITIONS</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">{(tc as any).preconditions}</p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">STEPS</p>
              <div className="flex flex-col gap-2">
                {tc.steps?.map((s, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-3 py-2">
                    <p className="text-[12px] text-slate-700 dark:text-slate-300"><span className="text-slate-400 dark:text-slate-600 mr-1">{i + 1}.</span>{s.action}</p>
                    {s.expectedOutcome && <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500 pl-4">→ {s.expectedOutcome}</p>}
                  </div>
                ))}
              </div>
            </div>

            {tc.expectedResult && (
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">EXPECTED RESULT</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">{tc.expectedResult}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <fieldset disabled={isSaving} className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-6 py-6">
              <div>
                <label className="mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">TITLE *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">DESCRIPTION</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">PRECONDITIONS</label>
                <textarea rows={2} value={preconditions} onChange={e => setPreconditions(e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">STEPS</label>
                  <button onClick={addStep} className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 cursor-pointer bg-transparent border-none disabled:opacity-50">
                    <Plus size={11} /> add step
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="mt-2.5 text-[9px] text-slate-400 dark:text-slate-600 w-4 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <input value={s.action} onChange={e => updateStep(i, "action", e.target.value)} placeholder="Action" className={inputCls} />
                        <input value={s.expectedOutcome} onChange={e => updateStep(i, "expectedOutcome", e.target.value)} placeholder="Expected outcome" className={inputCls} />
                      </div>
                      {steps.length > 1 && (
                        <button onClick={() => removeStep(i)} className="mt-2 cursor-pointer bg-transparent border-none text-slate-400 dark:text-slate-600 hover:text-danger-500 disabled:opacity-50">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">EXPECTED RESULT</label>
                <textarea rows={2} value={expectedResult} onChange={e => setExpectedResult(e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">PRIORITY</label>
                <div className="flex gap-1.5">
                  {Object.values(Priority).map(pr => {
                    const active = priority === pr;
                    const cfg = PRIORITY_CONFIG[pr];
                    return (
                      <button
                        key={pr}
                        onClick={() => setPriority(pr)}
                        className={`flex-1 cursor-pointer rounded-lg py-2 text-[9px] font-bold tracking-[0.08em] transition-all duration-[120ms] disabled:opacity-50 border ${active ? cfg.bg : "bg-slate-50 dark:bg-white/[0.02]"} ${active ? cfg.border : "border-slate-200 dark:border-white/[0.06]"}`}
                      >
                        <span className={active ? cfg.text : "text-slate-400 dark:text-[#334155]"}>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </fieldset>

            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={() => setMode("view")}
                disabled={isSaving}
                className="flex-1 cursor-pointer rounded-[10px] border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] py-3 text-xs font-semibold text-slate-500 dark:text-[#475569] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`flex-[2] flex items-center justify-center gap-2 rounded-[10px] border py-3 text-[13px] font-bold transition-all duration-150
                  ${canSave ? "cursor-pointer border-orange-500/40 bg-orange-500 text-white hover:bg-orange-600" : "cursor-not-allowed border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.01] text-slate-300 dark:text-[#1e293b]"}`}
              >
                {isSaving ? (<><Loader2 size={14} className="animate-spin" /> Saving…</>) : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};