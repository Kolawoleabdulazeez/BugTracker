/* eslint-disable @typescript-eslint/no-explicit-any */

import { GroupMessages, Message } from "@/services/chat/chat.api";
import { useEffect, useState } from "react";

// ── Bug priority/severity/status (4-level: low/medium/high/critical) ──
export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-300 dark:border-success-500/20",
  medium: "bg-info-50 text-info-700 border-info-200 dark:bg-info-500/10 dark:text-info-300 dark:border-info-500/20",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  critical: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:border-danger-500/20",
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-secondary-100 text-secondary-600 border-secondary-200 dark:bg-white/5 dark:text-secondary-300 dark:border-white/10",
  medium: "bg-info-50 text-info-700 border-info-200 dark:bg-info-500/10 dark:text-info-300 dark:border-info-500/20",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  critical: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:border-danger-500/20",
};

export const STATUS_COLORS: Record<string, string> = {
  open: "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-300",
  inprogress: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  in_progress: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  resolved: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300",
  closed: "bg-secondary-100 text-secondary-500 dark:bg-white/5 dark:text-secondary-400",
};

// ── Project status (active/completed/archived) — used by cards.tsx ──
export const getProjectStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        dot: "bg-success-500",
        text: "text-success-700 dark:text-success-300",
        bg: "bg-success-100 dark:bg-success-500/15",
      };

    case "completed":
      return {
        dot: "bg-info-500",
        text: "text-info-700 dark:text-info-300",
        bg: "bg-info-100 dark:bg-info-500/15",
      };

    case "archived":
      return {
        dot: "bg-secondary-400",
        text: "text-secondary-700 dark:text-secondary-300",
        bg: "bg-secondary-100 dark:bg-white/5",
      };

    default:
      return {
        dot: "bg-slate-400 dark:bg-secondary-500",
        text: "text-slate-700 dark:text-secondary-300",
        bg: "bg-slate-100 dark:bg-white/5",
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

// ── Project priority (low/medium/high) — used by cards.tsx ──
export const getPriorityStyles = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return {
        bg: "bg-success-100 dark:bg-success-500/15",
        text: "text-success-700 dark:text-success-300",
      };

    case "medium":
      return {
        bg: "bg-orange-100 dark:bg-orange-500/15",
        text: "text-orange-700 dark:text-orange-300",
      };

    case "high":
      return {
        bg: "bg-danger-100 dark:bg-danger-500/15",
        text: "text-danger-700 dark:text-danger-300",
      };

    default:
      return {
        bg: "bg-slate-100 dark:bg-white/10",
        text: "text-slate-700 dark:text-gray-300",
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

// ── Avatar palette — now built from your actual theme scales ──
export const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-success-500",
  "bg-info-500",
  "bg-danger-500",
  "bg-orange-700",
  "bg-info-700",
  "bg-success-700",
  "bg-danger-400",
];
export function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

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

export const DateDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300 dark:text-secondary-600 px-1">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
  </div>
);

type DateGroupedMessage = {
  sentAt: string;
};

export function groupByDate<T extends DateGroupedMessage>(
  messages: T[]
): { date: string; messages: T[] }[] {
  const groups: Record<string, T[]> = {};

  messages.forEach((msg) => {
    const date = new Date(msg.sentAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(msg);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages,
  }));
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

export function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 80);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}