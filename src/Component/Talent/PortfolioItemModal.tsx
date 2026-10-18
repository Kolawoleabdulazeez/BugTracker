"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { PortfolioItem } from "@/services/profile/profile.api";
import { parseDuration } from "@/utils";

const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-slate-800 dark:text-[#e2e8f0] outline-none placeholder:text-slate-400 dark:placeholder:text-[#334155] focus:border-orange-500/50 transition-colors disabled:opacity-50";
const labelCls =
  "mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]";

export interface PortfolioFormValues {
  projectName: string;
  role: string;
  description: string;
  link: string;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd or ""
  current: boolean;
}

interface Props {
  item?: PortfolioItem | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (values: PortfolioFormValues) => void;
}

export const PortfolioItemModal = ({ item, isSaving = false, onClose, onSave }: Props) => {
  const d = parseDuration(item?.duration);

  const [projectName, setProjectName] = useState(item?.projectName ?? "");
  const [role, setRole] = useState(item?.role ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [startDate, setStartDate] = useState(d.start);
  const [endDate, setEndDate] = useState(d.end);
  const [current, setCurrent] = useState(item ? d.current : false);

  const datesValid =
    startDate !== "" && (current || (endDate !== "" && endDate >= startDate));

  const canSave =
    !isSaving && projectName.trim().length > 0 && role.trim().length > 0 && datesValid;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      projectName: projectName.trim(),
      role: role.trim(),
      description: description.trim(),
      link: link.trim(),
      startDate,
      endDate,
      current,
    });
  };

  return (
    <div
      onClick={(e) => !isSaving && e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md"
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-secondary-900/95 dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-[18px] dark:border-white/[0.06]">
          <p className="m-0 text-[13px] font-bold text-slate-900 dark:text-[#e2e8f0]">
            {item ? "Edit experience" : "Add experience"}
          </p>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex cursor-pointer items-center rounded-[7px] border border-slate-200 bg-slate-50 p-[5px_7px] text-slate-400 disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-[#475569]"
          >
            <X size={14} />
          </button>
        </div>

        <fieldset disabled={isSaving} className="m-0 flex max-h-[65vh] flex-col gap-4 overflow-y-auto border-0 px-6 py-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>PROJECT NAME *</label>
              <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>ROLE *</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>DESCRIPTION</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you test or deliver?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>LINK</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
            <div>
              <label className={labelCls}>START *</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>END</label>
              <input
                type="date"
                value={endDate}
                disabled={current}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-[11px] text-slate-500 dark:text-secondary-400">
              <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} />
              Currently here
            </label>
          </div>
        </fieldset>

        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 cursor-pointer rounded-[10px] border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-500 disabled:opacity-50 dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-[#475569]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex flex-[2] items-center justify-center gap-2 rounded-[10px] border py-3 text-[13px] font-bold transition-all duration-150 ${
              canSave
                ? "cursor-pointer border-orange-500/40 bg-orange-500 text-white hover:bg-orange-600"
                : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 dark:border-white/[0.04] dark:bg-white/[0.01] dark:text-[#1e293b]"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : item ? (
              "Save changes"
            ) : (
              "Add experience"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};