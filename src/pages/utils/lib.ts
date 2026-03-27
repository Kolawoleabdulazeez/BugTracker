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


