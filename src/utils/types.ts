export interface PageDetails {
  PageSize?: number;
  SearchQuery?: number;
  MinDate?: number;
  MaxDate?: number;
  PageNumber?: number;
  TotalRecords?: number;
}
export enum TestStatus {
  Draft = "draft",
  Passed = "passed",
  Failed = "failed",
  Pending = "pending",
  Blocked = "blocked",
}

export enum Priority {
  Critical = "critical",
  High = "high",
  Medium = "medium",
  Low = "low",
}

export interface Step {
  action: string;
  expectedOutcome: string;
}



export interface TestCaseSummary {
  id: string;
  caseNumber: number;
  caseLabel: string;        
   title: string;
  priority: Priority;
  status: TestStatus;
  stepCount: number;
  assignedTo: AssignedTo | null;
  tags: string[];
  createdAt: string;
}
export interface AssignedTo {
  id: string;
  name: string;
}



// src/utils/types.ts
export interface StepDetail {
  stepNumber: number;
  action: string;
  expectedOutcome: string;
}

export interface CreatedBy {
  userId: string;
  fullName: string;
  email: string;
}

export interface AssignedTo {
  id: string;
  name: string;
}


export interface TestCase {
  id: string;
  projectId: string;
  caseNumber: number;
  caseLabel: string;
  title: string;
  description: string;
  preconditions: string;
  steps: StepDetail[];
  expectedResult: string;
  priority: Priority;
  status: TestStatus;
  createdBy: CreatedBy;
  assignedTo: AssignedTo | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}