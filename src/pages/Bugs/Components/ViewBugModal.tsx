import React from "react";
import { X, Bug, Tag, Cpu, User, Calendar } from "lucide-react";
import {  BugType } from "@/services/bugs/bugs.api";

type ViewBugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bug: BugType | null;
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  normal: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/20",
  urgent: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
  critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
  critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  in_progress: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  closed: "bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-400",
};

const Field: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
        {label}
      </p>
      <p
        className={`text-sm text-slate-800 dark:text-gray-200 ${
          mono ? "font-mono whitespace-pre-wrap" : ""
        }`}
      >
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
    STATUS_COLORS[bug.status?.toLowerCase().replace(" ", "_")] ??
    STATUS_COLORS.open;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#13151f]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
              <Bug size={18} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 dark:text-gray-500">
                  {bug.bugLabel}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
                >
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
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto px-6 py-5">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${priorityClass}`}
            >
              Priority: {bug.priority}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${severityClass}`}
            >
              Severity: {bug.severity}
            </span>
            {bug.developerStatus && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Dev Status: {bug.developerStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Description" value={bug.description} />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 flex items-center gap-1">
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

          <Field
            label="Steps to Reproduce"
            value={bug.stepsToReproduce}
            mono
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Expected Behavior" value={bug.expectedBehavior} />
            <Field label="Actual Behavior" value={bug.actualBehavior} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 flex items-center gap-1">
                <Cpu size={11} /> Environment
              </p>
              <p className="text-sm text-slate-800 dark:text-gray-200">
                {bug.environment || "—"}
              </p>
            </div>
            <Field label="Version" value={bug.version} />
          </div>

          {/* Assignees */}
          {(bug.assignedTester || bug.assignedDeveloper) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bug.assignedTester && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 flex items-center gap-1">
                    <User size={11} /> Assigned Tester
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      {bug.assignedTester.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        {bug.assignedTester.fullName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        {bug.assignedTester.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {bug.assignedDeveloper && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 flex items-center gap-1">
                    <User size={11} /> Assigned Developer
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {bug.assignedDeveloper.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        {bug.assignedDeveloper.fullName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        {bug.assignedDeveloper.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {bug.tags?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 flex items-center gap-1">
                <Tag size={11} /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {bug.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                  >
                    {typeof tag === "string" ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBugModal;