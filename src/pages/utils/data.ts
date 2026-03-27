// ─── Data ────────────────────────────────────────────────────────────────────
 
// ─── Types ───────────────────────────────────────────────────────────────────
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status   = "Open" | "In Progress" | "Resolved" | "Closed";
export type PassFail = "Pass" | "Fail" | "Pending" | "Blocked";

interface Bug       { id: string; title: string; severity: Severity; status: Status; reporter: string; date: string }
interface TestCase  { id: string; title: string; result: PassFail; assignee: string; duration: string }
interface Member    { name: string; role: string; avatar: string; bugs: number; resolved: number }
interface SectionData {
  title: string;
  accent: string;
  icon: string;
  description: string;
  stats: { label: string; value: string | number; delta?: string }[];
  bugs: Bug[];
  tests: TestCase[];
  members: Member[];
}



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
  tags: any[]
  createdAt: string
};