export const URLS = {
  AUTH:      "/api/Auth",
  USER:      "/api/User",
  PROJECT:   "/api/Project",
  BUGS:      "/api/Bugs",
  CHAT:      "/api/Chat",
  TESTCASES: "/api/TestCases",   // ← new
} as const;

export type UrlKey = keyof typeof URLS;