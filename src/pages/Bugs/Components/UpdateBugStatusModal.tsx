import React, { useState } from "react";
import { X, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

interface UpdateBugStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, comment: string) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  { value: "inprogress", label: "In Progress", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
  { value: "closed", label: "Closed", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
  { value: "wontfix", label: "Won't Fix", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  { value: "duplicate", label: "Duplicate", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
];

const UpdateBugStatusModal: React.FC<UpdateBugStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!status) {
      setError("Please select a status.");
      return;
    }
    setError("");
    await onConfirm(status, comment);
    setStatus("");
    setComment("");
  };

  const handleClose = () => {
    setStatus("");
    setComment("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#13151f] animate-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20">
              <AlertTriangle size={17} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Update Bug Status
              </h2>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                Select a new status for this bug
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">

          {/* Status pills */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2.5">
              Status <span className="text-red-500 normal-case tracking-normal">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatus(opt.value);
                    setError("");
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    status === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#13151f] ring-current`
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-500 dark:hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2.5">
              Comment{" "}
              <span className="normal-case tracking-normal font-normal text-slate-300 dark:text-gray-600">
                (optional)
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note about this status change..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/5 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || !status}
            className="group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating…
              </>
            ) : (
              <>
                Update Status
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBugStatusModal;