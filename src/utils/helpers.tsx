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