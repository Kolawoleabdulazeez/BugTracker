import { useQuery } from "@tanstack/react-query";
import { getUserMetrics, UserMetrics_Params } from "./user.api";

export const PROJECT_QUERY_KEY = ["user-metrics"];

export function useGetUserMetrics(params: UserMetrics_Params) {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, params],
    queryFn: () => getUserMetrics(params),
  });
}