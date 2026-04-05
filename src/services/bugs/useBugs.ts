/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    assignDeveloper,
  createBug,
  CreateBugPayload,
  deleteBug,
  getBugs,
  getSingleBug,
  postComment,
  PostCommentPayload,
  reassignTester,
  updateBug,
  UpdateBugPayload,
  updateBugStatus,
  UpdateBugStatusPayload,
} from "./bugs.api";
import { toast } from "sonner";

export const BUGS_QUERY_KEY = ["bugs"];

export function useGetBugs(projectId?: string) {
  return useQuery({
    queryKey: [...BUGS_QUERY_KEY, projectId],
    queryFn: () => getBugs(projectId as string),
    enabled: !!projectId,
  });
}

export function useCreateBug(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBugPayload) => {
      if (!projectId) throw new Error("No project selected");
      return createBug(projectId, payload);
    },
    onSuccess: () => {
      toast.success("Bug reported successfully!");
      queryClient.invalidateQueries({ queryKey: [...BUGS_QUERY_KEY, projectId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to create bug. Please try again."
      );
    },
  });
}

export function useUpdateBug(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bugId, payload }: { bugId: string; payload: UpdateBugPayload }) =>
      updateBug(bugId, projectId as string, payload), // ✅ pass projectId
    onSuccess: () => {
      toast.success("Bug updated successfully!");
      queryClient.invalidateQueries({ queryKey: [...BUGS_QUERY_KEY, projectId] });
      queryClient.invalidateQueries({ queryKey: [...SINGLE_BUG_QUERY_KEY] }); // ✅ also refresh single bug
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to update bug. Please try again."
      );
    },
  });
}

export function useDeleteBug(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bugId: string) => deleteBug(bugId, projectId as string),
    onSuccess: () => {
      toast.success("Bug deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [...BUGS_QUERY_KEY, projectId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to delete bug. Please try again."
      );
    },
  });
}

export const SINGLE_BUG_QUERY_KEY = ["single-bug"];

export function useGetSingleBug(bugId?: string, projectId?: string) {
  return useQuery({
    queryKey: [...SINGLE_BUG_QUERY_KEY, bugId, projectId],
    queryFn: () => getSingleBug(bugId as string, projectId as string),
    enabled: !!bugId && !!projectId,
  });
}

export function useUpdateBugStatus(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bugId,
      payload,
    }: {
      bugId: string;
      payload: UpdateBugStatusPayload;
    }) => {
      if (!projectId) throw new Error("No project selected");
      return updateBugStatus(bugId, projectId, payload);
    },

    onSuccess: () => {
      toast.success("Bug status updated successfully!");

      queryClient.invalidateQueries({
        queryKey: [...BUGS_QUERY_KEY, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: [...SINGLE_BUG_QUERY_KEY],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to update bug status"
      );
    },
  });
}



export function useAssignDeveloper(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bugId, developerId }: { bugId: string; developerId: string }) =>
      assignDeveloper(bugId, projectId as string, developerId),
    onSuccess: () => {
      toast.success("Developer assigned successfully!");
      queryClient.invalidateQueries({ queryKey: [...SINGLE_BUG_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to assign developer."
      );
    },
  });
}

export function useReassignTester(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bugId, newTesterId }: { bugId: string; newTesterId: string }) =>
      reassignTester(bugId, projectId as string, newTesterId),
    onSuccess: () => {
      toast.success("Tester reassigned successfully!");
      queryClient.invalidateQueries({ queryKey: [...SINGLE_BUG_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to reassign tester."
      );
    },
  });
}
export const COMMENTS_QUERY_KEY = ["bug-comments"];


export function usePostComment(
  bugId?: string,
  projectId?: string,
  onSuccessCallback?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostCommentPayload) => {
      if (!bugId || !projectId) throw new Error("Missing bugId or projectId");
      return postComment(bugId, projectId, payload);
    },
    onSuccess: () => {
      toast.success("Comment posted!");
      queryClient.invalidateQueries({
        queryKey: [...COMMENTS_QUERY_KEY, bugId, projectId],
      });
      // Also keep the single bug cache in sync
      queryClient.invalidateQueries({
        queryKey: [...SINGLE_BUG_QUERY_KEY, bugId, projectId],
      });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.responseMessage ||
          "Failed to post comment."
      );
    },
  });
}
 