// src/services/testcases/testcases.api.ts
import { createApiInstance } from "@/utils/api";
import { Priority, Step, TestCase, TestCaseSummary } from "@/utils/types";

export interface GenerateTestcaseParam {
  projectOverview: string;
  isDocUpload: boolean;
  fileUpload: FileUpload;
}

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

export const testcasesInstance = createApiInstance("TESTCASES");

export async function generateTestcase(
  projectId: string,
  payload: GenerateTestcaseParam
): Promise<TestCase[]> {
  const res = await testcasesInstance.put(`/${projectId}/generate`, payload);
  return res.data;

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
  testCaseId:string,
): Promise<TestCase> {
  const res = await testcasesInstance.get(`/${projectId}/${testCaseId}`);
  return res.data.data;
}

export async function updateTestcaseById(
  projectId: string,
  testCaseId:string,
  payload: CreateTestcaseParam
): Promise<TestCase> {
  const res = await testcasesInstance.put(`/${projectId}/${testCaseId}`, payload);
  return res.data;
}


export async function deleteTestcaseById(
  projectId: string,
  testCaseId: string,
): Promise<void> {
  await testcasesInstance.delete(`/${projectId}/${testCaseId}`);

}