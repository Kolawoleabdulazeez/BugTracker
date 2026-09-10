import React from "react";
import DashboardT from "@/pages/Dashboard/Components/dashboard";
import PageLayout from "@/Component/Layout/PageLayout";
import OverallProgress from "./Components/AnalyticsGauge";

import { useGetUserMetrics } from "@/services/user/useUser";
import {
  SummaryCards,
  BugStatusDistribution,
  ActivityTimeline,
  TopContributor,
} from "@/services/user/user.api";
import TopContributors from "./Components/Topcontributors";
import ActivityTimelineChart from "./Components/Activitytimelinechart";
import Bugstatus from "./Components/Bugstatus";

// ── Fallback defaults ──────────────────────────────────────────────────────────

const defaultSummaryCards: SummaryCards = {
  totalBugs: 0,
  openBugs: 0,
  inProgressBugs: 0,
  closedBugs: 0,
  completionPercentage: 0,
  totalActivities: 0,
};

const defaultBugStatus: BugStatusDistribution = {
  open: 0,
  inProgress: 0,
  closed: 0,
  wontFix: 0,
  duplicate: 0,
};

const defaultTimeline: ActivityTimeline[] = [];
const defaultContributors: TopContributor[] = [];

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { data } = useGetUserMetrics({
    ActivityDays: 30,
    IncludeBugStatusDistribution: true,
    IncludeBugLifecycleTrend: true,
    IncludeActivityTimeline: true,
    IncludeTopContributors: true,
    IncludeSummaryCards: true,
  });

  const summaryCards = data?.summaryCards ?? defaultSummaryCards;
  const bugStatus = data?.bugStatusDistribution ?? defaultBugStatus;
  const timeline = data?.activityTimeline ?? defaultTimeline;
  const contributors = data?.topContributors ?? defaultContributors;

  return (
    <PageLayout title="Dashboard" showSearch={true}>

      {/* ── Banner ── */}
      <DashboardT SummaryCards={summaryCards} />

      {/* ── Row 1: Donut + Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Bugstatus data={bugStatus} />
        <ActivityTimelineChart data={timeline} />
      </div>

      {/* ── Row 2: Top contributors + Overall progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 px-5 pb-5">

        {/* Contributors takes 2/3 width */}
        <div className="lg:col-span-2">
          <TopContributors data={contributors} />
        </div>

        {/* Overall progress wired to real data */}
        <div className="lg:col-span-1">
          <OverallProgress
            total={summaryCards.totalBugs}
            completed={summaryCards.closedBugs}
            delayed={bugStatus.wontFix + bugStatus.duplicate}
            ongoing={summaryCards.inProgressBugs}
          />
        </div>
      </div>

    </PageLayout>
  );
};

export default Dashboard;