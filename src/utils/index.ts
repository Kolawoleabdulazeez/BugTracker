import { Activity } from "../services/project/project.api";
import { Priority, TestStatus } from "./types";

export const EMAIL_VALIDATION = (value: string) => {
  if (!value) return "Email is required";
  if (!value.includes("@")) return "Please enter a valid email";
  return true;
};

export const PASSWORD_VALIDATION = {
  required: "Password is required",
  validate: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value))
      return "Password must contain at least 1 uppercase letter";
    if (!/[a-z]/.test(value))
      return "Password must contain at least 1 lowercase letter";
    if (!/\d/.test(value)) return "Password must contain at least 1 digit";
    if (!/[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|-]/.test(value))
      return "Password must contain at least 1 special character";
    return true;
  },
};



export const formatTimestamp = (
  value?: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  }).format(date);
};


export const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim()
}


export const mapActivityDescription = (item: Activity) => {

  switch (item.action) {
    case "ProjectCreated":
      return {
        action: "created project",
        target: item.entityTitle,
      };

    case "ProjectUpdated":
      return {
        action: "updated project",
        target: item.entityTitle,
      };

    case "MemberInvited":
      return {
        action: "invited",
        target: item.metadata?.email || item.entityTitle,
      };

    case "MemberAdded":
      return {
        action: "added",
        target: `${item.entityTitle} as ${item.metadata?.role || "member"}`,
      };

    case "MemberRemoved":
      return {
        action: "removed",
        target: item.entityTitle,
      };

    default:
      return {
        action: "performed an action on",
        target: item.entityTitle || "this project",
      };
  }
};


export const trimWithEllipses = (str: string, length?: number) => {
  if (!str) return "";
  return str.length > (length ?? 30)
    ? `${str.substring(0, length ?? 30)}...`
    : str;
};



interface StatusConfig {
  label: string;
  barHex: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  glyph: string;
}

interface PriorityConfig {
  label: string;
  border: string;
  bg: string;
  text: string;
}


interface StatusConfig {
  label: string;
  barHex: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  glyph: string;
}

interface PriorityConfig {
  label: string;
  border: string;
  bg: string;
  text: string;
}

export const STATUS_CONFIG: Record<TestStatus, StatusConfig> = {
  [TestStatus.Draft]: {
    label: "DRAFT",
    barHex: "#757575",
    chipBorder: "border-secondary-400/20",
    chipBg: "bg-secondary-400/[0.08]",
    chipText: "text-secondary-500 dark:text-secondary-400",
    glyph: "◐",
  },
  [TestStatus.Passed]: {
    label: "PASS",
    barHex: "#239A3C",
    chipBorder: "border-success-500/20",
    chipBg: "bg-success-500/[0.08]",
    chipText: "text-success-600 dark:text-success-400",
    glyph: "✓",
  },
  [TestStatus.Failed]: {
    label: "FAIL",
    barHex: "#C92438",
    chipBorder: "border-danger-500/20",
    chipBg: "bg-danger-500/[0.08]",
    chipText: "text-danger-600 dark:text-danger-400",
    glyph: "✕",
  },
  [TestStatus.Pending]: {
    label: "PENDING",
    barHex: "#ED6214",
    chipBorder: "border-orange-500/20",
    chipBg: "bg-orange-500/[0.08]",
    chipText: "text-orange-600 dark:text-orange-400",
    glyph: "◌",
  },
  [TestStatus.Blocked]: {
    label: "BLOCKED",
    barHex: "#5A0620",
    chipBorder: "border-danger-800/25",
    chipBg: "bg-danger-800/[0.10]",
    chipText: "text-danger-800 dark:text-danger-300",
    glyph: "⊘",
  },
};

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  [Priority.Critical]: {
    label: "CRIT",
    border: "border-danger-500/20",
    bg: "bg-danger-500/[0.08]",
    text: "text-danger-600 dark:text-danger-400",
  },
  [Priority.High]: {
    label: "HIGH",
    border: "border-orange-500/20",
    bg: "bg-orange-500/[0.08]",
    text: "text-orange-600 dark:text-orange-400",
  },
  [Priority.Medium]: {
    label: "MED",
    border: "border-info-500/20",
    bg: "bg-info-500/[0.08]",
    text: "text-info-600 dark:text-info-400",
  },
  [Priority.Low]: {
    label: "LOW",
    border: "border-success-500/20",
    bg: "bg-success-500/[0.08]",
    text: "text-success-600 dark:text-success-400",
  },
};

export const STATUS_FILTERS = [null, TestStatus.Passed, TestStatus.Failed, TestStatus.Pending, TestStatus.Blocked] as const;
export const PRIORITY_FILTERS = [null, Priority.Critical, Priority.High, Priority.Medium, Priority.Low] as const;