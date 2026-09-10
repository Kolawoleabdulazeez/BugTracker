import StatusTag from "@/Component/shared/StatusTag";
import { ActivityEvent } from "@/services/user/user.api";

const ACTION_TO_STATUS = {
  opened: "open",
  reopened: "open",
  "in-progress": "inProgress",
  closed: "closed",
  commented: "inProgress",
  assigned: "inProgress",
} as const;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function ActivityLogRow({ event }: { event: ActivityEvent }) {
  return (
    <div className="flex items-center gap-4 px-5 py-2.5 border-b border-hairline last:border-0 hover:bg-surface-0/50 transition-colors">
      <span className=" text-xs text-ink-muted w-12 flex-shrink-0">
        {formatTime(event.timestamp)}
      </span>
      <span className=" text-xs text-ink font-medium w-20 flex-shrink-0">
        {event.bugId}
      </span>
      <span className="text-sm text-ink truncate flex-1 min-w-0">
        {event.bugTitle}
      </span>
      <StatusTag status={ACTION_TO_STATUS[event.action]} />
      <span className="text-xs text-ink-muted w-24 flex-shrink-0 text-right truncate">
        {event.actorName}
      </span>
    </div>
  );
}