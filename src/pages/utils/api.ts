import axios, { AxiosInstance } from "axios";
import { URLS, UrlKey } from "./urls";
import { toast } from "sonner";

export const createApiInstance = (baseKey: UrlKey): AxiosInstance => {
  const instance = axios.create({
    baseURL: URLS[baseKey],
    timeout: 30000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ✅ Attach interceptor HERE
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Session expired. Please login again.");
        // await logoutAndRedirect();
      }

      return Promise.reject(error);
    }
  );

  return instance;
};