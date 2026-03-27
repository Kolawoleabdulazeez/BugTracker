import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
  ProjectPayload,
  InviteProjectMemberPayload,
  inviteProjectMember,
  removeProjectMember,
  getProjectActivities,
  getProjectMetrics,
  getProjectMembers,
} from "./project.api";

type ApiSuccessResponse = {
  responseMessage?: string;
};

type ApiErrorResponse = {
  details?: {
    responseMessage?: string;
  };
};

export const PROJECT_QUERY_KEY = ["projects"];

export function useCreateProject(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse, AxiosError<ApiErrorResponse>, ProjectPayload>({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Project created successfully");

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to create project"
      );
    },
  });
}

export function useUpdateProject(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse,
    AxiosError<ApiErrorResponse>,
    { projectId: string; payload: ProjectPayload }
  >({
    mutationFn: ({ projectId, payload }) => updateProject(projectId, payload),
    onSuccess: (data, variables) => {
      toast.success(data?.responseMessage || "Project updated successfully");

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...PROJECT_QUERY_KEY, variables.projectId],
      });

      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to update project"
      );
    },
  });
}

export function useDeleteProject(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteProject,
    onSuccess: (data, projectId) => {
      toast.success(data?.responseMessage || "Project deleted successfully");

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      queryClient.removeQueries({
        queryKey: [...PROJECT_QUERY_KEY, projectId],
      });

      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to delete project"
      );
    },
  });
}

export function useGetAllProject() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: getAllProject,
  });
}

export function useGetProjectById(projectId?: string) {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, projectId],
    queryFn: () => getProjectById(projectId as string),
    enabled: !!projectId,
  });
}

export function useInviteProjectMember(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse,
    AxiosError<ApiErrorResponse>,
    { projectId: string; payload: InviteProjectMemberPayload }
  >({
    mutationFn: ({ projectId, payload }) =>
      inviteProjectMember(projectId, payload),
    onSuccess: (data, variables) => {
      toast.success(data?.responseMessage || "Member invited successfully");

      queryClient.invalidateQueries({
        queryKey: [...PROJECT_QUERY_KEY, variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to invite member"
      );
    },
  });
}

export function useRemoveProjectMember(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse,
    AxiosError<ApiErrorResponse>,
    { projectId: string; memberId: string }
  >({
    mutationFn: ({ projectId, memberId }) =>
      removeProjectMember(projectId, memberId),
    onSuccess: (data, variables) => {
      toast.success(data?.responseMessage || "Member removed successfully");

      queryClient.invalidateQueries({
        queryKey: [...PROJECT_QUERY_KEY, variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY,
      });

      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to remove member"
      );
    },
  });
}

export const PROJECT_ACTIVITY_QUERY_KEY = ["project-activities"];

export function useGetProjectActivities(projectId?: string) {
  return useQuery({
    queryKey: [...PROJECT_ACTIVITY_QUERY_KEY, projectId],
    queryFn: () => getProjectActivities(projectId as string),
    enabled: !!projectId,
  });
}

export const PROJECT_METRICS_QUERY_KEY = ["project-metrics"];

export function useGetProjectMetrics(projectId?: string) {
  return useQuery({
    queryKey: [...PROJECT_METRICS_QUERY_KEY, projectId],
    queryFn: () => getProjectMetrics(projectId as string),
    enabled: !!projectId,
  });
}

export const PROJECT_MEMBERS_QUERY_KEY = ["project-members"];

export function useGetProjectMembers(projectId?: string) {
  return useQuery({
    queryKey: [...PROJECT_MEMBERS_QUERY_KEY, projectId],
    queryFn: () => getProjectMembers(projectId as string),
    enabled: !!projectId,
  });
}