import { createApiInstance } from "../../api";

export type createProject_Params ={
    name: string
  description: string
  tags: string[]
}

export type GetProject_Response = {
  data: Project[]
  responseMessage: string
  responseCode: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: string
  yourRole: string
  memberCount: number
  priority: string
  projectStartDate?: string
  projectDueDate?: string
  tags: any[]
  createdAt: string
}
export const authInstance = createApiInstance("PROJECT");

export async function createProject(payload: createProject_Params): Promise<any> {
  const res = await authInstance.post("/Project/", payload);
  return res.data;
}

export async function getAllProject(): Promise<GetProject_Response> {
  const res = await authInstance.get("/Project/");
  return res.data;
}



