import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const AUTH_STORAGE_KEY = "auth_data";

export type AuthUser = {
  accessToken: string;
  expiresAt: string;
  user: {
    id: string | number;
    fullName: string;
    email: string;
    avatarUrl:string;
    isEmailVerified:boolean
  };
};

export const saveAuthToStorage = (data: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
};

export const getAuthFromStorage = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthFromStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
};


export const authKeys = {
  me: ["auth-user"] as const,
};


export const TABLE_ROWS_PER_PAGE = 20;


import { AxiosError } from "axios";

interface ErrorBody {
  message?: string;
  details?: {
    title?: string;
    responseMessage?: string;
    errors?: Record<string, string[] | string>;
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const body = (error as AxiosError<ErrorBody>)?.response?.data;
  const details = body?.details;

  // 1. Field validation errors (400 from model validation)
  if (details?.errors) {
    const messages = Object.values(details.errors)
      .flat()
      .filter(Boolean);
    if (messages.length > 0) return messages.slice(0, 3).join(" ");
  }

  // 2. Business-rule errors, which your other endpoints return
  if (details?.responseMessage) return details.responseMessage;

  // 3. Generic fallbacks
  if (details?.title && details.title !== "One or more validation errors occurred.") {
    return details.title;
  }

  return fallback;
}