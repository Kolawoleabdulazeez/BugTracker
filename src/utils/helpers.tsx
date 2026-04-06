import { GroupMessages } from "@/services/chat/chat.api";

export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-blue-50 text-blue-700 border-blue-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

export const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-50 text-blue-700",
  inprogress: "bg-purple-50 text-purple-700",
  in_progress: "bg-purple-50 text-purple-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-500",
};

export const getProjectStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-100",
      };

    case "completed":
      return {
        dot: "bg-blue-500",
        text: "text-blue-700",
        bg: "bg-blue-100",
      };

    case "archived":
      return {
        dot: "bg-gray-500",
        text: "text-gray-700",
        bg: "bg-gray-100",
      };

    default:
      return {
        dot: "bg-slate-400",
        text: "text-slate-700",
        bg: "bg-slate-100",
      };
  }
};

export function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

export const getPriorityStyles = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return {
        bg: "bg-green-100 dark:bg-green-500/15",
        text: "text-green-700 dark:text-green-300",
      };

    case "medium":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-500/15",
        text: "text-yellow-700 dark:text-yellow-300",
      };

    case "high":
      return {
        bg: "bg-red-100 dark:bg-red-500/15",
        text: "text-red-700 dark:text-red-300",
      };

    default:
      return {
        bg: "bg-gray-100 dark:bg-white/10",
        text: "text-gray-700 dark:text-gray-300",
      };
  }
};

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];
export function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}



// Human-readable relative time
export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Date divider ─────────────────────────────────────────────────────────────
export const DateDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300 dark:text-white/20 px-1">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
  </div>
);


export function groupByDate(messages: GroupMessages[]): { date: string; messages: GroupMessages[] }[] {
  const groups: Record<string, GroupMessages[]> = {};
  messages.forEach((msg) => {
    const date = new Date(msg.sentAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return Object.entries(groups).map(([date, messages]) => ({ date, messages }));
}


export type ChatMessageUI = {
  id: string;
  content: string;
  sender: string;
  senderInitials: string;
  senderColor: string;
  time: string;
  isMine: boolean;
};

export const mapChatMessageToUI = (msg: any): ChatMessageUI => ({
  id: String(msg.id),
  content: msg.content,
  sender: msg.sender?.fullName || "Unknown",
  senderInitials: getInitials(msg.sender?.fullName || "Unknown"),
  senderColor: getAvatarColor(msg.sender?.userId || msg.sender?.fullName || "U"),
  time: formatMessageTime(msg.sentAt),
  isMine: !!msg.isMine,
});