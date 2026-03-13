import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProject, createProject_Params, getAllProject } from "./project.api";

export const PROJECT_QUERY_KEY = ["projects"];

export function useCreateProject(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<any, any, createProject_Params>({
    mutationFn: createProject,
    onSuccess: (data) => {
      const message =
        data?.responseMessage || "Project created successfully";

      toast.success(message);

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      onSuccessCallback?.();
    },
  });
}

export function useGetAllProject() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: getAllProject,
  });
}