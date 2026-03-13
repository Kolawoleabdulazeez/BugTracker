export const URLS = {
  AUTH: "/api/Auth",
  USER: "/api/User",
  PROJECT: "/api/Project",
} as const;

export type UrlKey = keyof typeof URLS;