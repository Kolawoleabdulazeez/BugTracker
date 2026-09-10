import React from "react";
import { X, Bug, Tag, Cpu, User, Calendar } from "lucide-react";
import { BugType } from "@/services/bugs/bugs.api";

type ViewBugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bug: BugType | null;
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-300 dark:border-success-500/20",
  normal: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  urgent: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:border-danger-500/20",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
  critical: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-300",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-secondary-100 text-secondary-600 border-secondary-200 dark:bg-white/5 dark:text-secondary-300",
  medium: "bg-info-50 text-info-700 border-info-200 dark:bg-info-500/10 dark:text-info-300",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
  critical: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-300",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-300",
  in_progress: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  resolved: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300",
  closed: "bg-secondary-100 text-secondary-500 dark:bg-white/5 dark:text-secondary-400",
};

const Field: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500">
        {label}
      </p>
      <p className={`text-sm text-slate-800 dark:text-gray-200 ${mono ? " whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </div>
  );
};

const ViewBugModal: React.FC<ViewBugModalProps> = ({ isOpen, onClose, bug }) => {
  if (!isOpen || !bug) return null;

  const priorityClass =
    PRIORITY_COLORS[bug.priority?.toLowerCase()] ?? PRIORITY_COLORS.low;
  const severityClass =
    SEVERITY_COLORS[bug.severity?.toLowerCase()] ?? SEVERITY_COLORS.medium;
  const statusClass =
    STATUS_COLORS[bug.status?.toLowerCase().replace(" ", "_")] ?? STATUS_COLORS.open;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-secondary-900/95">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
              <Bug size={18} className="text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className=" text-xs text-slate-400 dark:text-secondary-500">
                  {bug.bugLabel}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                  {bug.status}
                </span>
              </div>
              <h2 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                {bug.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-secondary-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${priorityClass}`}>
              Priority: {bug.priority}
            </span>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${severityClass}`}>
              Severity: {bug.severity}
            </span>
            {bug.developerStatus && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                Dev Status: {bug.developerStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Description" value={bug.description} />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                <Calendar size={11} /> Reported
              </p>
              <p className="text-sm text-slate-800 dark:text-gray-200">
                {new Date(bug.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Field label="Steps to Reproduce" value={bug.stepsToReproduce} mono />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Expected Behavior" value={bug.expectedBehavior} />
            <Field label="Actual Behavior" value={bug.actualBehavior} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                <Cpu size={11} /> Environment
              </p>
              <p className="text-sm text-slate-800 dark:text-gray-200">
                {bug.environment || "—"}
              </p>
            </div>
            <Field label="Version" value={bug.version} />
          </div>

          {(bug.assignedTester || bug.assignedDeveloper) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bug.assignedTester && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                    <User size={11} /> Assigned Tester
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-info-500 text-xs font-bold text-white">
                      {bug.assignedTester.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        {bug.assignedTester.fullName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-secondary-500">
                        {bug.assignedTester.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {bug.assignedDeveloper && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                    <User size={11} /> Assigned Developer
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success-500 text-xs font-bold text-white">
                      {bug.assignedDeveloper.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        {bug.assignedDeveloper.fullName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-secondary-500">
                        {bug.assignedDeveloper.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {bug.tags?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                <Tag size={11} /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {bug.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300"
                  >
                    {typeof tag === "string" ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBugModal;