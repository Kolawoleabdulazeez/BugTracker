/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiInstance } from "@/utils/api";

export type ProjectMemberPayload = {
  email: string;
  role: string;
};
export type InviteProjectMemberPayload = {
  email: string;
  role: string;
};


export type ProjectPayload = {
  name: string;
  description: string;
  tags: string[];
  projectStartDate?: string;
  projectDueDate?: string;
  projectPriority?: "low" | "medium" | "high";
  members?: ProjectMemberPayload[];
};

export type GetProject_Response = {
  data: Project[];
  responseMessage: string;
  responseCode: string;
};

export interface Project {
   id: string
  name: string
  description: string
  status: string
  yourRole: string
  memberCount: number
  priority: string
  projectStartDate: string
  projectDueDate: string
  tags: any[]
  createdAt: string
}

export type GetProjectActivities_Response ={
    activities: Activity[]
}

export interface Activity {
  id: string
  actorId: string
  actorName: string
  action: string
  entityType: string
  entityId: string
  entityTitle: string
  metadata: any
  createdAt: string
}

export type ProjectMetrics = {
  totalBugs: number;
  open: number;
  inProgress: number;
  closed: number;
  wontFix: number;
  duplicate: number;
  completionPercentage: number;
};

export const authInstance = createApiInstance("PROJECT");

export async function createProject(payload: ProjectPayload): Promise<any> {
  const res = await authInstance.post("/Project/", payload);
  return res.data;
}

export async function updateProject(
  projectId: string,
  payload: ProjectPayload
): Promise<any> {
  const res = await authInstance.put(`/Project/${projectId}`, payload);
  return res.data;
}

export async function deleteProject(projectId: string): Promise<any> {
  const res = await authInstance.delete(`/Project/${projectId}`);
  return res.data;
}

export async function getAllProject(): Promise<GetProject_Response> {
  const res = await authInstance.get("/Project/");
  console.log(res,"this is response coming for all project")
  return res.data;
}

export async function getProjectById(projectId: string): Promise<any> {
  const res = await authInstance.get(`/Project/${projectId}`);
  return res.data;
}


export async function inviteProjectMember(
  projectId: string,
  payload: InviteProjectMemberPayload
): Promise<any> {
  const res = await authInstance.post(`/Project/${projectId}/invite`, payload);
  return res.data;
}

export async function removeProjectMember(
  projectId: string,
  memberId: string
): Promise<any> {
  const res = await authInstance.delete(
    `/Project/${projectId}/members/${memberId}`
  );
  return res.data;
}

export async function getProjectActivities(
  projectId: string
): Promise<GetProjectActivities_Response> {
  const res = await authInstance.get(`/Project/${projectId}/activities`);
  console.log(res, "this is res just like thAT")
  return res.data.data;
}

export async function getProjectMetrics(
  projectId: string
): Promise<ProjectMetrics> {
  const res = await authInstance.get(`/Project/${projectId}/metrics`);
  console.log(res, "this is response coming from the metrics")
  return res.data.data;
}

export type getProjectMembers_Response = {
  data: Members[]
  responseMessage: string
  responseCode: string
}

export interface Members {
  userId: string
  email: string
  fullName: string
  role: string
  joinedAt: string
  addedBy: string
}

export async function getProjectMembers(
  projectId: string
): Promise<getProjectMembers_Response[]> {
  const res = await authInstance.get(`/Project/${projectId}/members`);
  console.log(res, "this is project coming for members")
  return res.data.data;
}