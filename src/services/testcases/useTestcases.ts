
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
  UpdateTestcaseStatusParam,
  updateTestcaseStatus,
  getTestRuns,
  TestRun,
  CreateTestRunParam,
  createTestRun,
  deleteTestRun,
  linkBugToRun,
  getTestRunById,
  GetTestRunsResponse,
  GeneratedTestCase,
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
  GeneratedTestCase[],
  AxiosError<ApiErrorResponse>,
  { projectId: string; payload: GenerateTestcaseParam }
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


export function useUpdateTestcaseStatus(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    {
      projectId: string;
      testCaseId: string;
      payload: UpdateTestcaseStatusParam;
    }
  >({
    mutationFn: ({ projectId, testCaseId, payload }) =>
      updateTestcaseStatus(projectId, testCaseId, payload),

    onSuccess: (_data, variables) => {
      toast.success(`Status set to ${variables.payload.status}`);

      // The prefix key covers the list; the detail key is a child of it,
      // but we invalidate it explicitly for clarity.
      queryClient.invalidateQueries({
        queryKey: ["project-testcases", variables.projectId],
      });
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
          "Failed to update status"
      );
    },
  });
}

const runsKey = (projectId: string, testCaseId: string) =>
  ["test-runs", projectId, testCaseId] as const;

const errMsg = (e: AxiosError<ApiErrorResponse>, fallback: string) =>
  e.response?.data?.details?.responseMessage || fallback;

export function useGetTestRuns(projectId: string, testCaseId: string) {
  return useQuery<GetTestRunsResponse>({
    queryKey: runsKey(projectId, testCaseId),
    queryFn: () => getTestRuns(projectId, testCaseId),
    enabled: !!projectId && !!testCaseId,
  });
}

export function useGetTestRunById(
  projectId: string,
  testCaseId: string,
  testRunId: string
) {
  return useQuery<TestRun>({
    queryKey: [...runsKey(projectId, testCaseId), testRunId],
    queryFn: () => getTestRunById(projectId, testCaseId, testRunId),
    enabled: !!projectId && !!testCaseId && !!testRunId,
  });
}

export function useCreateTestRun(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    TestRun,
    AxiosError<ApiErrorResponse>,
    { projectId: string; testCaseId: string; payload: CreateTestRunParam }
  >({
    mutationFn: ({ projectId, testCaseId, payload }) =>
      createTestRun(projectId, testCaseId, payload),

    onSuccess: (_d, v) => {
      toast.success("Test run logged");
      queryClient.invalidateQueries({
        queryKey: runsKey(v.projectId, v.testCaseId),
      });
      // In case the list endpoint starts returning the latest run result
      queryClient.invalidateQueries({
        queryKey: ["project-testcases", v.projectId],
      });
      onSuccessCallback?.();
    },

    onError: (e) => toast.error(errMsg(e, "Failed to log test run")),
  });
}

export function useDeleteTestRun(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    GetTestRunsResponse,
    AxiosError<ApiErrorResponse>,
    { projectId: string; testCaseId: string; testRunId: string }
  >({
    mutationFn: ({ projectId, testCaseId, testRunId }) =>
      deleteTestRun(projectId, testCaseId, testRunId),

    onSuccess: (data, v) => {
      toast.success("Test run deleted");

      if (data?.runs) {
        queryClient.setQueryData(runsKey(v.projectId, v.testCaseId), data);
      } else {
        queryClient.invalidateQueries({
          queryKey: runsKey(v.projectId, v.testCaseId),
        });
      }

      onSuccessCallback?.();
    },

    onError: (e) => toast.error(errMsg(e, "Failed to delete test run")),
  });
}
export function useLinkBugToRun(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

return useMutation<
  TestRun,
  AxiosError<ApiErrorResponse>,
  { projectId: string; testCaseId: string; testRunId: string; bugId: string }
>({
    mutationFn: ({ projectId, testCaseId, testRunId, bugId }) =>
      linkBugToRun(projectId, testCaseId, testRunId, bugId),

    onSuccess: (_d, v) => {
      toast.success("Bug linked to run");
      queryClient.invalidateQueries({
        queryKey: runsKey(v.projectId, v.testCaseId),
      });
      onSuccessCallback?.();
    },

    onError: (e) => toast.error(errMsg(e, "Failed to link bug")),
  });
}