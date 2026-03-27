import React, { useState } from "react";
import {
  Bug,
  AlertCircle,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type BugPriority = "critical" | "high" | "medium" | "low";
type BugStatus = "open" | "in_progress" | "resolved" | "closed";

type Bug = {
  id: string;
  title: string;
  description?: string;
  priority: BugPriority;
  status: BugStatus;
  assignee?: string;
  assigneeAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  tag?: string;
};

type BugsTabProps = {
  completedTasks?: number;
  totalTasks?: number;
  bugs?: Bug[];
  onAddBug?: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  BugPriority,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  critical: {
    label: "Critical",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
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
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    icon: <Minus size={12} />,
  },
  low: {
    label: "Low",
    color: "text-slate-500 dark:text-gray-400",
    bg: "bg-slate-100 dark:bg-gray-700/50",
    icon: <ArrowUpRight size={12} className="rotate-90" />,
  },
};

const STATUS_CONFIG: Record<
  BugStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  open: {
    label: "Open",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: <Circle size={12} />,
  },
  in_progress: {
    label: "In Progress",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon: <Clock size={12} />,
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: <CheckCircle2 size={12} />,
  },
  closed: {
    label: "Closed",
    color: "text-slate-500 dark:text-gray-500",
    bg: "bg-slate-100 dark:bg-gray-700/50",
    icon: <CheckCircle2 size={12} />,
  },
};

// ─── Mock data (replace with real API data) ───────────────────────────────────

const MOCK_BUGS: Bug[] = [
  {
    id: "BUG-001",
    title: "Dashboard crashes on mobile when sidebar is open",
    description: "Reproducible on iOS Safari 16+. Screen goes blank.",
    priority: "critical",
    status: "in_progress",
    assignee: "Amara Obi",
    assigneeAvatar: "A",
    createdAt: "2025-03-10T08:00:00Z",
    tag: "UI",
  },
  {
    id: "BUG-002",
    title: "Export to CSV missing last column headers",
    priority: "high",
    status: "open",
    assignee: "Kofi Mensah",
    assigneeAvatar: "K",
    createdAt: "2025-03-12T10:30:00Z",
    tag: "Export",
  },
  {
    id: "BUG-003",
    title: "Notifications not clearing after being read",
    priority: "medium",
    status: "open",
    assignee: "Zara Ahmed",
    assigneeAvatar: "Z",
    createdAt: "2025-03-14T14:00:00Z",
    tag: "Notifications",
  },
  {
    id: "BUG-004",
    title: "Dark mode toggle resets on page refresh",
    priority: "low",
    status: "resolved",
    assignee: "Amara Obi",
    assigneeAvatar: "A",
    createdAt: "2025-03-01T09:00:00Z",
    tag: "Theme",
  },
  {
    id: "BUG-005",
    title: "Search returns duplicated results on second page",
    priority: "high",
    status: "closed",
    assignee: "Kofi Mensah",
    assigneeAvatar: "K",
    createdAt: "2025-02-28T11:00:00Z",
    tag: "Search",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusDot: React.FC<{ status: BugStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: BugPriority }> = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const BugRow: React.FC<{ bug: Bug }> = ({ bug }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group rounded-lg border transition-all duration-200 ${
        bug.status === "closed" || bug.status === "resolved"
          ? "border-slate-100 bg-slate-50/50 dark:border-gray-700/50 dark:bg-gray-900/30"
          : "border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900/50"
      }`}
    >
      <div
        className="flex cursor-pointer flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Bug ID + Icon */}
        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              bug.status === "closed" || bug.status === "resolved"
                ? "bg-slate-100 dark:bg-gray-700/50"
                : "bg-red-50 dark:bg-red-500/10"
            }`}
          >
            <Bug
              size={15}
              className={
                bug.status === "closed" || bug.status === "resolved"
                  ? "text-slate-400 dark:text-gray-500"
                  : "text-red-500 dark:text-red-400"
              }
            />
          </div>
          <span className="font-mono text-xs text-slate-400 dark:text-gray-500">
            {bug.id}
          </span>
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <p
            className={`break-words text-sm font-medium ${
              bug.status === "closed" || bug.status === "resolved"
                ? "text-slate-400 line-through dark:text-gray-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {bug.title}
          </p>
          {bug.tag && (
            <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-gray-700 dark:text-gray-400">
              {bug.tag}
            </span>
          )}
        </div>

        {/* Badges + Assignee */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <PriorityBadge priority={bug.priority} />
          <StatusDot status={bug.status} />

          {bug.assigneeAvatar && (
            <div
              title={bug.assignee}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white"
            >
              {bug.assigneeAvatar}
            </div>
          )}

          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-200 dark:text-gray-500 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-gray-700/50">
          {bug.description ? (
            <p className="mb-3 text-sm text-slate-500 dark:text-gray-400">
              {bug.description}
            </p>
          ) : (
            <p className="mb-3 text-sm italic text-slate-400 dark:text-gray-600">
              No description provided.
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 dark:text-gray-500">
            <span>
              Reported{" "}
              {new Date(bug.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {bug.assignee && <span>Assigned to {bug.assignee}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BugsTab: React.FC<BugsTabProps> = ({
  completedTasks = 0,
  totalTasks = 0,
  bugs = MOCK_BUGS,
  onAddBug,
}) => {
  const [filterStatus, setFilterStatus] = useState<BugStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<BugPriority | "all">("all");

  const filtered = bugs.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchPriority =
      filterPriority === "all" || b.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  const openCount = bugs.filter(
    (b) => b.status === "open" || b.status === "in_progress"
  ).length;
  const resolvedCount = bugs.filter(
    (b) => b.status === "resolved" || b.status === "closed"
  ).length;
  const criticalCount = bugs.filter((b) => b.priority === "critical").length;

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Bugs",
            value: bugs.length || totalTasks,
            icon: <Bug size={14} className="text-slate-400 dark:text-gray-400" />,
            color: "text-slate-900 dark:text-white",
          },
          {
            label: "Open",
            value: openCount,
            icon: (
              <AlertCircle size={14} className="text-blue-500 dark:text-blue-400" />
            ),
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Resolved",
            value: resolvedCount || completedTasks,
            icon: (
              <CheckCircle2
                size={14}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ),
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Critical",
            value: criticalCount,
            icon: <Flame size={14} className="text-red-500 dark:text-red-400" />,
            color: "text-red-600 dark:text-red-400",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm"
          >
            <div className="mb-1 flex items-center gap-1.5">
              {card.icon}
              <span className="text-xs text-slate-500 dark:text-gray-400">
                {card.label}
              </span>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── Bug List Panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Bug Tracker
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status filter */}
            <div className="relative">
              <Filter
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as BugStatus | "all")
                }
                className="h-8 rounded-lg border border-slate-200 bg-white py-0 pl-7 pr-3 text-xs text-slate-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(e.target.value as BugPriority | "all")
              }
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {onAddBug && (
              <button
                onClick={onAddBug}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Plus size={13} />
                Add Bug
              </button>
            )}
          </div>
        </div>

        {/* Bug Rows */}
        <div className="space-y-2">
          {filtered.length > 0 ? (
            filtered.map((bug) => <BugRow key={bug.id} bug={bug} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700">
                <Bug size={22} className="text-slate-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                No bugs found
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                Try adjusting your filters or add a new bug.
              </p>
            </div>
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-gray-700 dark:text-gray-500">
            Showing {filtered.length} of {bugs.length} bugs
          </p>
        )}
      </div>
    </div>
  );
};

export default BugsTab;