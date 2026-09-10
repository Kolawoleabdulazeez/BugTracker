type StatusKey = "open" | "inProgress" | "closed" | "wontFix" | "duplicate";

const STATUS_CONFIG: Record<StatusKey, { label: string; className: string }> = {
  open: { label: "Open", className: "text-status-open border-status-open/30 bg-status-open/10" },
  inProgress: { label: "In progress", className: "text-status-progress border-status-progress/30 bg-status-progress/10" },
  closed: { label: "Closed", className: "text-status-closed border-status-closed/30 bg-status-closed/10" },
  wontFix: { label: "Won't fix", className: "text-status-wontfix border-status-wontfix/30 bg-status-wontfix/10" },
  duplicate: { label: "Duplicate", className: "text-status-duplicate border-status-duplicate/30 bg-status-duplicate/10" },
};

export default function StatusTag({ status }: { status: StatusKey }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs  ${className}`}>
      {label}
    </span>
  );
}

export const VALID_STATUSES = ["open", "inProgress", "closed", "wontFix", "duplicate"] as const;
type BugStatus = (typeof VALID_STATUSES)[number];

export function normalizeStatus(status: string): BugStatus {
  return (VALID_STATUSES as readonly string[]).includes(status)
    ? (status as BugStatus)
    : "open"; // fallback for anything unexpected
}