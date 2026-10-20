import { AlignLeft, CheckCheck, FileText, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { PriBadge } from "../../../Component/TestCase/PriBadge";
import { useGenerateTestcase } from "@/services/testcases/useTestcases";
import { GenerateTestcaseParam, GeneratedTestCase } from "@/services/testcases/testcases.api";
import { Priority } from "@/utils/types";


interface AIModalProps {
  onClose: () => void;
  onAdd: (c: GeneratedTestCase[]) => void;
  isSaving?: boolean;
  projectId: string;
  projectOverview: string;
}
type InputMode = "doc" | "overview";

const MIN_OVERVIEW_LENGTH = 20;

const toBase64 = (f: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });



const MODES: {
  id: InputMode;
  title: string;
  hint: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "doc", title: "Upload a document", hint: "PDF requirements or user stories", icon: FileText },
  { id: "overview", title: "Project overview", hint: "Describe the project in text", icon: AlignLeft },
];

const AIModal = ({ onClose, onAdd, projectId, projectOverview, isSaving=false }: AIModalProps) => {
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [mode, setMode] = useState<InputMode>("doc");
  const [file, setFile] = useState<File | null>(null);
  const [overview, setOverview] = useState(projectOverview ?? "");
const [generated, setGenerated] = useState<GeneratedTestCase[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: generateTestcase, isPending: isGenerating } = useGenerateTestcase();
  

  const canGenerate =
    mode === "doc" ? !!file : overview.trim().length >= MIN_OVERVIEW_LENGTH;

const generate = async () => {
  if (!canGenerate) return;

  try {
    const payload: GenerateTestcaseParam =
      mode === "doc" && file
        ? {
            projectOverview,
            isDocUpload: true,
            fileUpload: { base64File: await toBase64(file), fileType: file.type },
          }
        : { projectOverview: overview.trim(), isDocUpload: false };

    const cases = await generateTestcase({ projectId, payload });
    setGenerated(cases);
    setSelected(new Set(cases.map((_, i) => i)));
    setStep("review");
  } catch (err) {
    console.error("generateTestcase error:", err);
  }
};

const canAdd = selected.size > 0 && !isSaving;



  const toggle = (i: number) =>
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(i)) {
        s.delete(i);
      } else {
        s.add(i);
      }
      return s;
    });



  const subtitle =
    step === "review"
      ? `${generated.length} cases generated`
      : mode === "doc"
      ? "upload requirements doc"
      : "describe your project";

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md"
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 dark:border-white/[0.08] dark:bg-secondary-900/95 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.35)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] px-6 py-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-amber-400/25 bg-amber-400/10">
              <Sparkles size={15} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 dark:text-[#e2e8f0]">AI Test Generator</p>
              <p className="text-[10px] text-slate-400 dark:text-[#475569]">{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex cursor-pointer items-center rounded-[7px] border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.04] p-[5px_7px] text-slate-400 dark:text-[#475569] transition-colors hover:text-slate-600 dark:hover:text-[#94a3b8]">
            <X size={14} />
          </button>
        </div>

        <div className="p-6">
          {step === "upload" ? (
            <>
              {/* Mode switch */}
              <div role="radiogroup" aria-label="Input type" className="mb-4 grid grid-cols-2 gap-2">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={isGenerating}
                      onClick={() => setMode(m.id)}
                      className={`flex items-start gap-2.5 rounded-[10px] border p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed
                        ${active
                          ? "border-amber-400/40 bg-amber-400/[0.08]"
                          : "border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20"}`}
                    >
                      <Icon
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${active ? "text-amber-500" : "text-slate-400 dark:text-[#475569]"}`}
                      />
                      <span className="min-w-0">
                        <span className={`block text-xs font-semibold ${active ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-[#94a3b8]"}`}>
                          {m.title}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-[#475569]">{m.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {mode === "doc" ? (
                <div
                  onClick={() => inputRef.current?.click()}
                  className={`flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border transition-all duration-150
                    ${file ? "border-amber-400/30 bg-amber-400/[0.06]" : "border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/20"}`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04]">
                    <Upload size={17} className={file ? "text-amber-500" : "text-slate-400 dark:text-[#475569]"} />
                  </div>
                  {file ? (
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-amber-600 dark:text-amber-400">{file.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#475569]">ready to process · click to change</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-slate-600 dark:text-[#94a3b8]">Click to choose your PDF</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#334155]">requirements · user stories · acceptance criteria</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    disabled={isGenerating}
                    rows={7}
                    placeholder="e.g. A bug tracking platform where testers report bugs, developers fix them, and project managers monitor progress. Key flows: login, project creation, bug reporting, assignment, status updates…"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[13px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.02] dark:text-[#e2e8f0] dark:placeholder:text-[#334155]"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-[#475569]">
                    <span>
                      {overview.trim().length < MIN_OVERVIEW_LENGTH
                        ? `Add a bit more detail (${MIN_OVERVIEW_LENGTH - overview.trim().length} more characters)`
                        : "Looks good"}
                    </span>
                    <span>{overview.length} characters</span>
                  </div>
                </div>
              )}

              <button
                onClick={generate}
                disabled={!canGenerate || isGenerating}
                className={`mt-3.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border py-[13px] text-[13px] font-bold transition-all duration-150
                  ${!canGenerate || isGenerating
                    ? "cursor-not-allowed border-amber-400/10 bg-amber-400/[0.04] text-slate-400 dark:text-[#475569]"
                    : "border-amber-400/30 bg-amber-400/[0.14] text-amber-700 dark:text-amber-400 hover:bg-amber-400/[0.2]"
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {mode === "doc" ? "Analysing document…" : "Analysing overview…"}
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Generate test cases
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.08em] text-slate-400 dark:text-[#475569]">REVIEW GENERATED CASES</span>
                <button onClick={() => setSelected(new Set(generated.map((_, i) => i)))} className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-[10px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                  <CheckCheck size={11} /> select all
                </button>
              </div>

              {generated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-[13px] text-slate-400 dark:text-[#475569]">No test cases in response.</p>
                  <p className="mt-1 text-[10px] text-slate-300 dark:text-[#334155]">Check the console log for the raw API response shape.</p>
                </div>
              ) : (
                <div className="flex max-h-[280px] flex-col gap-1.5 overflow-y-auto pr-1">
                  {generated.map((tc, i) => (
                    <button
                      key={i}
                      onClick={() => toggle(i)}
                      className={`flex cursor-pointer items-start gap-3 rounded-[10px] border p-[12px_14px] text-left transition-all duration-[120ms]
                        ${selected.has(i) ? "border-amber-400/25 bg-amber-400/[0.06]" : "border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03]"}`}
                    >
                      <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-all duration-[120ms]
                          ${selected.has(i) ? "border-amber-500 bg-amber-500" : "border-slate-300 dark:border-white/15 bg-transparent"}`}>
                        {selected.has(i) && <span className="text-[9px] font-black text-black">✓</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-1.5">
                    <PriBadge priority={tc.priority.toLowerCase() as Priority} />
                    </div>
                        <p className="mb-0.5 text-xs font-semibold text-slate-900 dark:text-[#e2e8f0]">{tc.title}</p>
                        <p className="mb-1.5 text-[11px] leading-[1.4] text-slate-500 dark:text-[#475569]">{tc.description}</p>
                        <div className="flex gap-1">
                          {tc.tags?.map((t) => (
                            <span key={t} className="rounded-lg bg-orange-500/[0.07] px-1.5 py-0.5 text-[9px] text-orange-600 dark:text-orange-400">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
  <button
    onClick={() => setStep("upload")}
    disabled={isSaving}
    className="flex-1 cursor-pointer rounded-[10px] border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] py-3 text-xs font-semibold text-slate-500 dark:text-[#475569] transition-colors hover:text-slate-700 dark:hover:text-[#94a3b8] disabled:cursor-not-allowed disabled:opacity-50"
  >
    ← Back
  </button>
  <button
    onClick={() => onAdd(generated.filter((_, i) => selected.has(i)))}
    disabled={!canAdd}
    className={`flex flex-[2] items-center justify-center gap-2 rounded-[10px] border py-3 text-[13px] font-bold transition-all duration-150
      ${canAdd
        ? "cursor-pointer border-amber-400/30 bg-amber-400/[0.14] text-amber-700 dark:text-amber-400 hover:bg-amber-400/[0.2]"
        : "cursor-not-allowed border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-white/[0.02] text-slate-300 dark:text-[#334155]"}`}
  >
    {isSaving ? (
      <>
        <Loader2 size={14} className="animate-spin" /> Saving…
      </>
    ) : (
      `Add ${selected.size} test${selected.size !== 1 ? "s" : ""} →`
    )}
  </button>
</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;