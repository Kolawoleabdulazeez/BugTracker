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

