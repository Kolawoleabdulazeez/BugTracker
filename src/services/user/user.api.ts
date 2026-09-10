import { createApiInstance } from "@/utils/api";

export const authInstance = createApiInstance("USER");


export type UserMetrics_Params ={
  ActivityDays:number
  IncludeBugStatusDistribution:boolean
  IncludeBugLifecycleTrend:boolean
  IncludeActivityTimeline:boolean
  IncludeTopContributors:boolean
  IncludeSummaryCards:boolean
}

export type UserMetrics_Response= {
    summaryCards: SummaryCards
  bugStatusDistribution: BugStatusDistribution
  bugLifecycleTrend: any
  activityTimeline: ActivityTimeline[]
  topContributors: TopContributor[]
}

export interface SummaryCards {
  totalBugs: number
  openBugs: number
  inProgressBugs: number
  closedBugs: number
  completionPercentage: number
  totalActivities: number
}

export interface ActivityEvent {
  id: string;
  bugId: string;
  bugTitle: string;
  action: "opened" | "closed" | "reopened" | "in-progress" | "commented" | "assigned";
  actorName: string;
  timestamp: string; 
}

export interface BugStatusDistribution {
  open: number
  inProgress: number
  closed: number
  wontFix: number
  duplicate: number
}

export interface ActivityTimeline {
  date: string
  activityCount: number
}

export interface TopContributor {
  actorName: string
  activityCount: number
}



export async function getUserMetrics(
  params: UserMetrics_Params
): Promise<UserMetrics_Response> {
  const res = await authInstance.get(
    `/metrics?ActivityDays=${params.ActivityDays}
    &IncludeBugStatusDistribution=${params.IncludeBugStatusDistribution}
    &IncludeBugLifecycleTrend=${params.IncludeBugLifecycleTrend}
    &IncludeActivityTimeline=${params.IncludeActivityTimeline}
    &IncludeTopContributors=${params.IncludeTopContributors}
    &IncludeSummaryCards=${params.IncludeSummaryCards}`
  );

  return res.data.data;
}