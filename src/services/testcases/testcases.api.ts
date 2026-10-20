// src/services/testcases/testcases.api.ts
import { BugPriority, BugSeverity, RunResult } from "@/utils";
import { createApiInstance } from "@/utils/api";
import { Priority, Step, TestCase, TestCaseSummary } from "@/utils/types";



export interface FileUpload {
  base64File: string;
  fileType: string;
}

export interface CreateTestcaseParam {
  title: string;
  description: string;
  preconditions: string;
  steps: Step[];
  expectedResult: string;
  priority: Priority;
  assignedToId: string;
  tags: string[];
}

export interface GetTestcasesResponse {
  testCases: TestCaseSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type TestCaseLifecycleStatus = "draft" | "active" | "deprecated";

export interface UpdateTestcaseStatusParam {
  status: TestCaseLifecycleStatus;
}

export interface StepResultParam {
  stepNumber: number;
  result: RunResult;
  actualOutcome: string;
}

export interface CreateTestRunParam {
  result: RunResult;
  environment?: string;
  appVersion?: string;
  notes?: string;
  stepResults?: StepResultParam[];
  linkedBugId?: string;
  autoCreateBug?: boolean;
  autoCreateBugTitle?: string;
  autoCreateBugSeverity?: BugSeverity;
  autoCreateBugPriority?: BugPriority;
  duration?: number;
}

export interface TestRunExecutor {
  userId: string;
  fullName: string;
  email: string;
}

export interface TestRun {
  id: string;
  projectId: string;
  testCaseId: string;
  testCaseLabel: string;
  testCaseCaseNumber: number;
  testCaseTitle: string;
  executedBy: TestRunExecutor;
  result: RunResult;
  environment: string | null;
  appVersion: string | null;
  notes: string | null;
  stepResults: StepResultParam[];
  linkedBugId: string | null;
  linkedBugLabel: string | null;
  duration: number | null;
  executedAt: string;
}

export interface GetTestRunsResponse {
  runs: TestRun[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GeneratedTestCase {
  title: string;
  description: string;
  preconditions: string;
  steps: { action: string; expectedOutcome: string }[];
  expectedResult: string;
  priority: string; 
  tags: string[];
}

export interface GenerateTestcaseParam {
  projectOverview: string;
  isDocUpload: boolean;
  fileUpload?: FileUpload;
}

export const testcasesInstance = createApiInstance("TESTCASES");



export async function generateTestcase(
  projectId: string,
  payload: GenerateTestcaseParam
): Promise<GeneratedTestCase[]> {
  const res = await testcasesInstance.post(`/${projectId}/generate`, payload);
  return res.data.data ?? [];
}

export async function getTestcases(projectId: string): Promise<GetTestcasesResponse> {
  const res = await testcasesInstance.get(`/${projectId}`);
  return res.data.data;
}

export async function createTestcase(
  projectId: string,
  payload: CreateTestcaseParam[]
): Promise<TestCase> {
  const res = await testcasesInstance.post(`/${projectId}`, payload);
  return res.data;
}

export async function viewTestcaseById(
  projectId: string,
  testCaseId: string
): Promise<TestCase> {
  const res = await testcasesInstance.get(`/${projectId}/${testCaseId}`);
  return res.data.data;
}

export async function updateTestcaseById(
  projectId: string,
  testCaseId: string,
  payload: CreateTestcaseParam
): Promise<TestCase> {
  const res = await testcasesInstance.put(`/${projectId}/${testCaseId}`, payload);
  return res.data;
}

export async function deleteTestcaseById(
  projectId: string,
  testCaseId: string
): Promise<void> {
  await testcasesInstance.delete(`/${projectId}/${testCaseId}`);
}

export async function updateTestcaseStatus(
  projectId: string,
  testCaseId: string,
  payload: UpdateTestcaseStatusParam
): Promise<void> {
  await testcasesInstance.patch(`/${projectId}/${testCaseId}/status`, payload);
}

// ---------- Test runs ----------

export async function createTestRun(
  projectId: string,
  testCaseId: string,
  payload: CreateTestRunParam
): Promise<TestRun> {
  const res = await testcasesInstance.post(
    `/${projectId}/${testCaseId}/runs`,
    payload
  );
  return res.data?.data ?? res.data;
}

export async function getTestRuns(
  projectId: string,
  testCaseId: string
): Promise<GetTestRunsResponse> {
  const res = await testcasesInstance.get(`/${projectId}/${testCaseId}/runs`);
  return res.data.data;
}
export async function getTestRunById(
  projectId: string,
  testCaseId: string,
  testRunId: string
): Promise<TestRun> {
  const res = await testcasesInstance.get(
    `/${projectId}/${testCaseId}/runs/${testRunId}`
  );
  return res.data.data;
}

export async function deleteTestRun(
  projectId: string,
  testCaseId: string,
  testRunId: string
): Promise<GetTestRunsResponse> {
  const res = await testcasesInstance.delete(
    `/${projectId}/${testCaseId}/runs/${testRunId}`
  );
  return res.data.data;
}

export async function linkBugToRun(
  projectId: string,
  testCaseId: string,
  testRunId: string,
  bugId: string
): Promise<TestRun> {
  const res = await testcasesInstance.patch(
    `/${projectId}/${testCaseId}/runs/${testRunId}/link-bug`,
    { bugId }
  );
  return res.data.data;
}
