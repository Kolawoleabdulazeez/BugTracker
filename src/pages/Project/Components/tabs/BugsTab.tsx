/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode, useState } from "react";
import {
  Bug,
  CheckCircle2,
  Clock,
  ChevronDown,
  Filter,
  Plus,
  Circle,
  Flame,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import { useGetBugs } from "@/services/bugs/useBugs";
import { BugType } from "@/services/bugs/bugs.api";
import Button from "@/Component/Button/Button";

type BugStatus = "open" | "in_progress" | "resolved" | "closed";

type BugsTabProps = {
  projectId?: string;
  completedTasks?: number;
  totalTasks?: number;
  onAddBug?: () => void;
};

const PRIORITY_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: ReactNode;
  }
> = {
  critical: {
    label: "Critical",
    color: "text-danger-600 dark:text-danger-400",
    bg: "bg-danger-50 dark:bg-danger-500/10",
    icon: <Flame size={12} />,
  },
  high: {
    label: "High",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: <ArrowUpRight size={12} />,
  },
  medium: {
    label: "Medium",
    color: "text-info-600 dark:text-info-400",
    bg: "bg-info-50 dark:bg-info-500/10",
    icon: <Minus size={12} />,
  },
  low: {
    label: "Low",
    color: "text-secondary-500 dark:text-secondary-400",
    bg: "bg-secondary-100 dark:bg-secondary-700/30",
    icon: <ArrowUpRight size={12} className="rotate-90" />,
  },
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: ReactNode;
  }
> = {
  open: {
    label: "Open",
    color: "text-danger-600 dark:text-danger-400",
    bg: "bg-danger-50 dark:bg-danger-500/10",
    icon: <Circle size={12} />,
  },
  in_progress: {
    label: "In Progress",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: <Clock size={12} />,
  },
  resolved: {
    label: "Resolved",
    color: "text-success-600 dark:text-success-400",
    bg: "bg-success-50 dark:bg-success-500/10",
    icon: <CheckCircle2 size={12} />,
  },
  closed: {
    label: "Closed",
    color: "text-secondary-500 dark:text-secondary-400",
    bg: "bg-secondary-100 dark:bg-secondary-700/30",
    icon: <CheckCircle2 size={12} />,
  },
};


const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG["open"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority?.toLowerCase()] ?? PRIORITY_CONFIG["low"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const BugRow: React.FC<{ bug: BugType }> = ({ bug }) => {
  const [expanded, setExpanded] = useState(false);

  const testerName = typeof bug.assignedTester === "object" && bug.assignedTester !== null
    ? (bug.assignedTester as any).fullName ?? (bug.assignedTester as any).name ?? ""
    : "";

  const testerInitial = testerName.charAt(0).toUpperCase();

  return (
    <div
      className={`group rounded-lg border transition-all duration-200 ${
        bug.status === "closed" || bug.status === "resolved"
          ? "border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/[0.02]"
          : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
      }`}
    >
      <div
        className="flex cursor-pointer flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              bug.status === "closed" || bug.status === "resolved"
                ? "bg-slate-100 dark:bg-white/5"
                : "bg-danger-50 dark:bg-danger-500/10"
            }`}
          >
            <Bug
              size={15}
              className={
                bug.status === "closed" || bug.status === "resolved"
                  ? "text-slate-400 dark:text-secondary-500"
                  : "text-danger-500 dark:text-danger-400"
              }
            />
          </div>
          <span className=" text-xs text-slate-400 dark:text-secondary-500">
            {bug.bugLabel || `#${bug.bugNumber}`}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`break-words text-sm font-medium ${
              bug.status === "closed" || bug.status === "resolved"
                ? "text-slate-400 line-through dark:text-secondary-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {bug.title}
          </p>
          {bug.tags && bug.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {bug.tags.map((tag, i) => (
                <span key={i} className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-white/5 dark:text-secondary-400">
                  {typeof tag === "string" ? tag : tag.name ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <PriorityBadge priority={bug.priority} />
          <StatusDot status={bug.status} />

          {testerInitial && (
            <div title={testerName} className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
              {testerInitial}
            </div>
          )}

          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-200 dark:text-secondary-500 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-white/5">
          {bug.description ? (
            <p className="mb-3 text-sm text-slate-500 dark:text-secondary-400">
              {bug.description}
            </p>
          ) : (
            <p className="mb-3 text-sm italic text-slate-400 dark:text-secondary-600">
              No description provided.
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 dark:text-secondary-500">
            <span>
              Reported{" "}
              {new Date(bug.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {testerName && <span>Assigned to {testerName}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

const BugsTab: React.FC<BugsTabProps> = ({ projectId, onAddBug }) => {
  const { data: bugsData } = useGetBugs(projectId);
  const bugs = bugsData?.bugs ?? [];
  const [filterStatus, setFilterStatus] = useState<BugStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filtered = bugs.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchPriority = filterPriority === "all" || b.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Bug Tracker
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Filter size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as BugStatus | "all")}
                className="h-8 rounded-lg border border-slate-200 bg-white py-0 pl-7 pr-3 text-xs text-slate-700 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as string | "all")}
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {onAddBug && (
              <Button
                title="Add Bug"
                icon={<Plus size={13} />}
                onClick={onAddBug}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-orange-500 px-3 text-xs font-medium text-white transition hover:bg-orange-600"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length > 0 ? (
            filtered.map((bug) => <BugRow key={bug.id} bug={bug} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                <Bug size={22} className="text-slate-400 dark:text-secondary-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                No bugs found
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-secondary-500">
                Try adjusting your filters or add a new bug.
              </p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/10 dark:text-secondary-500">
            Showing {filtered.length} of {bugs.length} bugs
          </p>
        )}
      </div>
    </div>
  );
};

export default BugsTab;