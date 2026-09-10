import { Layers3, Plus, Zap } from "lucide-react";

export const TestCaseEmptyState = ({
  onAI,
  onManual,
}: {
  onAI: () => void;
  onManual: () => void;
}) => (
  <div className="flex flex-col items-center justify-center px-10 py-16 text-center">
    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 ring-1 ring-white/10">
      <Layers3 size={22} className="text-white/20" />
    </div>

    <p className="text-sm font-semibold text-white/60 mb-1">
      No test cases yet
    </p>

    <p className="text-xs text-white/30 leading-relaxed mb-5">
      Create a test case manually or generate test cases with AI.
    </p>

    <div className="flex gap-2">
      <button
        onClick={onAI}
        className="flex items-center gap-1 px-3 py-2 bg-yellow-400/[0.06] border border-yellow-400/15 rounded-lg text-[10px]  text-yellow-400 font-bold"
      >
        <Zap size={11} />
        AI GEN
      </button>

      <button
        onClick={onManual}
        className="flex items-center gap-1 px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-lg text-[10px]  text-slate-400 font-bold"
      >
        <Plus size={11} />
        ADD TEST CASE
      </button>
    </div>
  </div>
);