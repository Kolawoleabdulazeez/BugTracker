// ─── Data ────────────────────────────────────────────────────────────────────
 
// ─── Types ───────────────────────────────────────────────────────────────────
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status   = "Open" | "In Progress" | "Resolved" | "Closed";
export type PassFail = "Pass" | "Fail" | "Pending" | "Blocked";


export enum Store {
  ACCESS_TOKEN = "a15e952b-cf46-4bf9-8524-38542acffc5a"
}




export type TeamMember = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
};

export type Task = {
  id: number;
  title: string;
  status: string;
  assignee: string;
  dueDate: string;
};

export type Activity = {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
};

export type FileItem = {
  id: number;
  name: string;
  size: string;
};

export type Project = {
  id: string
  name: string
  description: string
  status: string
  yourRole: string
  memberCount: number
  priority: string
  projectStartDate: string
  projectDueDate: string
  tags: string[]
  createdAt: string
};