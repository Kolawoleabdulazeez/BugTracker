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


export const mapActivityDescription = (item: any) => {

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
