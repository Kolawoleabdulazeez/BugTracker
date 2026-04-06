/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiInstance } from "@/utils/api";

export type CreateBugPayload = {
  title: string;
  description: string;
  priority: string;
  severity: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  version: string;
  assignedDeveloperId?: string;
  tags: string[];
};

export type UpdateBugPayload = Partial<CreateBugPayload> & {
  status?: string;
};

export type GetBugsResponse = {
  bugs: BugType[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BugType ={
  id: string
  projectId: string
  bugNumber: number
  bugLabel: string
  title: string
  description: string
  stepsToReproduce: string
  expectedBehavior: string
  actualBehavior: string
  severity: string
  priority: string
  status: string
  developerStatus: string
  environment: string
  version: string
  reportedBy: ReportedBy
  assignedTester: AssignedTester
  assignedDeveloper: any
  testerComment: any
  developerComment: any
  attachments: any[]
  tags: any[]
  duplicateOf: any
  statusHistory: StatusHistory[]
  comments: Comment[]
  resolvedAt: any
  createdAt: string
  updatedAt: string
}

export interface ReportedBy {
  userId: string
  fullName: string
  email: string
}
export interface AssignedTester {
  userId: string
  fullName: string
  email: string
}

export interface AssignedDeveloper {
  userId: string
  fullName: string
  email: string
}
export interface Comment {
  id: string
  authorId: string
  authorName: string
  content: string
  isEdited: boolean
  createdAt: string
}

export interface StatusHistory {
  fromStatus: string
  toStatus: string
  changedBy: string
  changedByName: string
  comment: string
  changedAt: string
}

export interface AssignedTester {
  userId: string;
  fullName: string;
  email: string;
}

export const authInstance = createApiInstance("BUGS");

export async function getBugs(projectId: string): Promise<GetBugsResponse> {
  const res = await authInstance.get("/", {
    params: { projectId },
  });
  console.log(res, "this is the result from get bug")
  return res.data.data;
}

export async function createBug(
  projectId: string,
  payload: CreateBugPayload
): Promise<any> {
  const res = await authInstance.post("/", payload, {
    params: { projectId },
  });
  return res.data;
}

export async function updateBug(
  bugId: string,
  projectId: string,    
  payload: UpdateBugPayload
): Promise<any> {
  const res = await authInstance.put(`/${bugId}`, payload, {
    params: { projectId }, 
  });
  return res.data;
}


export async function deleteBug(bugId: string, projectId: string): Promise<any> {
  const res = await authInstance.delete(`/${bugId}`, {
    params: { projectId },
  });
  return res.data;
}

export async function getSingleBug(
  bugId: string,
  projectId: string
): Promise<BugType> {
  const res = await authInstance.get(`/${bugId}`, {
    params: { projectId },
  });
  console.log(res.data.data, "this is properties of single bug")
  return res.data.data;
}

export type UpdateBugStatusPayload = {
  status: string;
  comment?: string;
  duplicateOfBugId?: string;
};

export async function updateBugStatus(
  bugId: string,
  projectId: string,
  payload: UpdateBugStatusPayload
): Promise<any> {
  const res = await authInstance.patch(
    `/${bugId}/status`,
    payload,
    {
      params: { projectId },
    }
  );

  return res.data;
}

export async function assignDeveloper(
  bugId: string,
  projectId: string,
  developerId: string
): Promise<any> {
  const res = await authInstance.patch(
    `/${bugId}/assign-developer`,
    { developerId },
    { params: { projectId } }
  );
  return res.data;
}

export async function reassignTester(
  bugId: string,
  projectId: string,
  newTesterId: string
): Promise<any> {
  const res = await authInstance.patch(
    `/${bugId}/reassign-tester`,
    { newTesterId },
    { params: { projectId } }
  );
  return res.data;
}


export type PostCommentPayload = {
  content: string;
};
 
export async function postComment(
  bugId: string,
  projectId: string,
  payload: PostCommentPayload
): Promise<any> {
  const res = await authInstance.post(
    `/${bugId}/comments`,
    payload,
    { params: { projectId } }
  );
  return res.data;
}


