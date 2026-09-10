
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiErrorResponse } from "../project/useProject";
import {
  createTestcase,
  CreateTestcaseParam,
  generateTestcase,
  GenerateTestcaseParam,
  getTestcases,
  GetTestcasesResponse,
  viewTestcaseById,
  updateTestcaseById,
  deleteTestcaseById,
} from "./testcases.api";
import { TestCase } from "@/utils/types";

export function useGetTestcases(projectId: string) {
  return useQuery<GetTestcasesResponse>({
    queryKey: ["project-testcases", projectId],
    queryFn: () => getTestcases(projectId),
    enabled: !!projectId,
  });
}

export function useGetTestcaseById(
  projectId: string,
  testCaseId: string
) {
  return useQuery<TestCase>({
    queryKey: ["project-testcases", projectId, testCaseId],
    queryFn: () => viewTestcaseById(projectId, testCaseId),
    enabled: !!projectId && !!testCaseId,
  });
}

export function useCreateTestcase(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    TestCase,
    AxiosError<ApiErrorResponse>,
    {
      projectId: string;
      payload: CreateTestcaseParam[];
    }
  >({
    mutationFn: ({ projectId, payload }) =>
      createTestcase(projectId, payload),

    onSuccess: (_data, variables) => {
      toast.success("Test case created");

      queryClient.invalidateQueries({
        queryKey: ["project-testcases", variables.projectId],
      });

      onSuccessCallback?.();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to create test case"
      );
    },
  });
}

export function useUpdateTestcase(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    TestCase,
    AxiosError<ApiErrorResponse>,
    {
      projectId: string;
      testCaseId: string;
      payload: CreateTestcaseParam;
    }
  >({
    mutationFn: ({ projectId, testCaseId, payload }) =>
      updateTestcaseById(projectId, testCaseId, payload),

    onSuccess: (_data, variables) => {
      toast.success("Test case updated");

      // Invalidate the list
      queryClient.invalidateQueries({
        queryKey: ["project-testcases", variables.projectId],
      });

      // Invalidate the individual test case
      queryClient.invalidateQueries({
        queryKey: [
          "project-testcases",
          variables.projectId,
          variables.testCaseId,
        ],
      });

      onSuccessCallback?.();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to update test case"
      );
    },
  });
}

export function useGenerateTestcase(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    TestCase[],
    AxiosError<ApiErrorResponse>,
    {
      projectId: string;
      payload: GenerateTestcaseParam;
    }
  >({
    mutationFn: ({ projectId, payload }) =>
      generateTestcase(projectId, payload),

    onSuccess: (_data, variables) => {
      toast.success("Testcases generated successfully");

      queryClient.invalidateQueries({
        queryKey: ["project-testcases", variables.projectId],
      });

      onSuccessCallback?.();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to generate testcases"
      );
    },
  });
}


export function useDeleteTestcase(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { projectId: string; testCaseId: string }
  >({
    mutationFn: ({ projectId, testCaseId }) =>
      deleteTestcaseById(projectId, testCaseId),

    onSuccess: (_data, variables) => {
      toast.success("Test case deleted");

      queryClient.invalidateQueries({
        queryKey: ["project-testcases", variables.projectId],
      });

      onSuccessCallback?.();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.details?.responseMessage ||
          "Failed to delete test case"
      );
    },
  });
}