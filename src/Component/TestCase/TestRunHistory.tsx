import { useEffect, useState } from "react";
import { Bug, ChevronDown, Link2, Trash2 } from "lucide-react";
import { useDeleteTestRun, useGetTestRunById, useGetTestRuns, useLinkBugToRun } from "@/services/testcases/useTestcases";
import { TestRun } from "@/services/testcases/testcases.api";
import { getRunStyle } from "@/utils";


interface TestRunHistoryProps {
  projectId: string;
  testCaseId: string;
}

const RunRow = ({
  run,
  projectId,
  testCaseId,
}: {
  run: TestRun;
  projectId: string;
  testCaseId: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [linking, setLinking] = useState(false);
  const [bugId, setBugId] = useState("");

  const { data: detail, isLoading: detailLoading } = useGetTestRunById(
  projectId,
  testCaseId,
  expanded ? run.id : ""
);
const full = detail ?? run;
const steps = full.stepResults ?? [];

  const { mutate: remove, isPending: deleting } = useDeleteTestRun();
  const { mutate: link, isPending: linkingBug } = useLinkBugToRun(() => {
    setLinking(false);
    setBugId("");
  });

  useEffect(() => {
    if (!confirmingDelete) return;
    const t = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmingDelete]);

  const style = getRunStyle(run.result);

  return (
    <div
      className={`px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.04] ${
        deleting ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-[0.08em] uppercase flex-shrink-0 ${style.chip}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>

        <div className="flex-1 min-w-0">
          <p className="m-0 text-[11px] text-slate-500 dark:text-secondary-400">
            {[run.environment, run.appVersion && `v${run.appVersion}`]
              .filter(Boolean)
              .join(" · ") || "No environment recorded"}
            {run.duration != null && ` · ${run.duration}s`}
          </p>
          <p className="m-0 mt-0.5 text-[10px] text-slate-400 dark:text-secondary-500">
            {run.executedBy?.fullName ? `${run.executedBy.fullName} · ` : ""}
            {run.executedAt ? new Date(run.executedAt).toLocaleString() : ""}
            </p>
          {run.notes && (
            <p className="m-0 mt-1.5 text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
              {run.notes}
            </p>
          )}
          {run.linkedBugId && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-danger-600 dark:text-danger-400">
                    <Bug size={11} /> {run.linkedBugLabel ?? run.linkedBugId}
                </span>
                )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {run.result === "failed" && !run.linkedBugId && (
            <button
              type="button"
              onClick={() => setLinking(o => !o)}
              className="flex items-center gap-1 h-7 px-2 rounded-md border cursor-pointer text-[10px] font-bold bg-slate-100 dark:bg-white/[0.05] border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-secondary-400"
            >
              <Link2 size={12} /> Link bug
            </button>
          )}
         <button
  type="button"
  aria-label="Toggle run details"
  onClick={() => setExpanded(o => !o)}
  className="flex items-center justify-center w-7 h-7 rounded-md border cursor-pointer bg-slate-100 dark:bg-white/[0.05] border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-secondary-400"
>
  <ChevronDown size={13} className={expanded ? "rotate-180" : ""} />
</button>
          {confirmingDelete ? (
            <button
              type="button"
              onClick={() => {
                setConfirmingDelete(false);
                remove({ projectId, testCaseId, testRunId: run.id });
              }}
              className="flex items-center gap-1 h-7 px-2 rounded-md border cursor-pointer text-[10px] font-bold text-white bg-danger-600 border-danger-600"
            >
              <Trash2 size={12} /> Confirm?
            </button>
          ) : (
            <button
              type="button"
              aria-label="Delete run"
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center justify-center w-7 h-7 rounded-md border cursor-pointer bg-slate-100 dark:bg-white/[0.05] border-slate-200 dark:border-white/[0.08] text-danger-600 dark:text-danger-400 hover:bg-danger-500/10"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {linking && (
        <div className="mt-3 flex gap-2">
          <input
            value={bugId}
            onChange={e => setBugId(e.target.value)}
            placeholder="Existing bug ID"
            className="flex-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3 py-2 text-xs text-slate-800 dark:text-[#e2e8f0] outline-none focus:border-orange-500/50"
          />
          <button
            type="button"
            disabled={!bugId.trim() || linkingBug}
            onClick={() =>
              link({ projectId, testCaseId, testRunId: run.id, bugId: bugId.trim() })
            }
            className="px-3 rounded-lg border border-orange-500/40 bg-orange-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {linkingBug ? "Linking…" : "Link"}
          </button>
        </div>
      )}

    {expanded && (
  <div className="mt-3 flex flex-col gap-1.5 pl-1">
    {detailLoading ? (
      <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500">Loading…</p>
    ) : steps.length === 0 ? (
      <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500">
        No step results recorded for this run.
      </p>
    ) : (
      steps.map((s, i) => {
        const st = getRunStyle(s.result);
        return (
          <div key={i} className="flex items-start gap-2 text-[11px]">
            <span className="w-10 flex-shrink-0 text-slate-400 dark:text-secondary-500">
              Step {s.stepNumber}
            </span>
            <span className={`flex-shrink-0 font-bold uppercase text-[9px] mt-0.5 ${st.chip.split(" ")[0]}`}>
              {st.label}
            </span>
            <span className="text-slate-600 dark:text-slate-300">{s.actualOutcome}</span>
          </div>
        );
      })
    )}
  </div>
)}
    </div>
  );
};

export const TestRunHistory = ({ projectId, testCaseId }: TestRunHistoryProps) => {
const { data, isLoading, isError } = useGetTestRuns(projectId, testCaseId);
const runs = data?.runs ?? [];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.04]">
            <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-white/[0.06]" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-white/[0.06]" />
              <div className="h-2.5 w-1/3 rounded bg-slate-200 dark:bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="m-0 px-4 py-8 text-center text-[12px] text-danger-600 dark:text-danger-400">
        Could not load test runs.
      </p>
    );
  }

  if (runs.length === 0) {
    return (
      <p className="m-0 px-4 py-8 text-center text-[12px] text-slate-400 dark:text-secondary-500">
        No runs logged yet.
      </p>
    );
  }
return (
  <div>
    {runs.map(run => (
      <RunRow key={run.id} run={run} projectId={projectId} testCaseId={testCaseId} />
    ))}
    {data && data.totalCount > runs.length && (
      <p className="m-0 px-4 py-3 text-center text-[10px] text-slate-400 dark:text-secondary-500">
        Showing {runs.length} of {data.totalCount} runs
      </p>
    )}
  </div>
);
};