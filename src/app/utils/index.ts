export const EMAIL_VALIDATION = (value: string) => {
  if (!value) return "Email is required";
  if (!value.includes("@")) return "Please enter a valid email";
  return true;
};