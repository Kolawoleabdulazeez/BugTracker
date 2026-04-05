import Button from "@/Component/Button/Button";
import PageLayout from "@/Component/Layout/PageLayout";
import { Filter, Grid3x3, LayoutList, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useGetAllProject, useGetProjectMetrics } from "../../services/project/useProject";
import { toast } from "sonner";
import AddBugModal from "./Components/Addbugmodal";
import Dropdown from "@/Component/Dropdown/Dropdown";
import PaginatedTable from "@/Component/Table/PaginatedTable";
import { useGetBugs } from "../../services/bugs/useBugs";
import { BUG_HEADERS } from "../../utils/headers";
import BugActionButton from "./Components/Bugactionbutton";
import { RenderComponent } from "@/Component/RenderComponent";

const Bugs = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddBugModal, setShowAddBugModal] = useState(false);

  const { data, isLoading } = useGetAllProject();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const { data: bugsData, isLoading: bugsLoading, refetch: refetchBugs } =
  useGetBugs(selectedProjectId);
  
  const { data: metricsData } = useGetProjectMetrics(
      typeof selectedProjectId === "string" ? selectedProjectId : undefined
    );
    
const projects = useMemo(() => data?.data ?? [], [data]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );


useEffect(() => {
  if (!projects.length) return;
  const { query } = router;

  const queryProjectId =
    typeof query.projectId === "string" ? query.projectId : "";

  if (queryProjectId) {
    setSelectedProjectId(queryProjectId);
    return;
  }

  const firstProjectId = projects[0]?.id ?? "";
  if (firstProjectId) {
    setSelectedProjectId(firstProjectId);

    router.replace(
      {
        pathname: router.pathname,
        query: { ...query, projectId: firstProjectId },
      },
      undefined,
      { shallow: true }
    );
  }
}, [projects, router]);

  // ── Map action column into each bug row ──────────────────────────────────────
const mappedBugs = useMemo(() => {
  return (bugsData?.bugs ?? []).map((bug) => ({
    ...bug,
    action: RenderComponent(BugActionButton, {
      item: bug,
      projectId: selectedProjectId,
      onActionSuccess: refetchBugs,
    }),
    viewMore: RenderComponent(Button, {
      title: "View Detail",
      className: "text-sm bg-transparent text-white dark:text-slate-900 underline hover:text-blue-400 dark:hover:text-blue-500",
      onClick: () => {
        router.push(`/Bugs/${bug.id}?projectId=${selectedProjectId}`);
      },
    }),
  }));
}, [bugsData, selectedProjectId, refetchBugs, router]);


  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(
      (p) => p.status?.toLowerCase() === "completed"
    ).length;
    const inProgress = projects.filter(
      (p) =>
        p.status?.toLowerCase() === "active" ||
        p.status?.toLowerCase() === "in progress"
    ).length;
    const inReview = projects.filter(
      (p) =>
        p.status?.toLowerCase() === "review" ||
        p.status?.toLowerCase() === "in review"
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const inReviewRate = total > 0 ? Math.round((inReview / total) * 100) : 0;
    return { total, completed, inProgress, inReview, completionRate, inProgressRate, inReviewRate };
  }, [projects]);

  const handleAddBugClick = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project before reporting a bug.");
      return;
    }
    setShowAddBugModal(true);
  };

  return (
    <div>
      <PageLayout
        title="Bugs"
        showSearch={false}
        contentClassName="bg-slate-100 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="space-y-6 mb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="mt-1 text-slate-600 dark:text-gray-400">
              View and manage all reported bugs here
            </p>
            <Button
              title="New Bug"
              icon={<Plus size={20} />}
              onClick={handleAddBugClick}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-3">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-blue-900/20">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Bugs</p>
            {isLoading ? <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-blue-200 dark:bg-blue-800/40" /> : <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">{metricsData?.totalBugs}</p>}
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-300/80">All time</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/40 dark:from-green-950/40 dark:to-green-900/20">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Completed</p>
            {isLoading ? <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-green-200 dark:bg-green-800/40" /> : <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">{metricsData?.closed}</p>}
            <p className="mt-1 text-xs text-green-600 dark:text-green-300/80">{isLoading ? "—" : `${metricsData?.completionPercentage ?? 0}% completion rate`}</p>
          </div>
          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 dark:border-yellow-900/40 dark:from-yellow-950/40 dark:to-yellow-900/20">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">In Progress</p>
            {isLoading ? <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-yellow-200 dark:bg-yellow-800/40" /> : <p className="mt-2 text-3xl font-bold text-yellow-900 dark:text-yellow-100">{metricsData?.inProgress}</p>}
            <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-300/80">{isLoading ? "—" : `${(metricsData?.completionPercentage)?? 0}% of projects`}</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/40 dark:from-purple-950/40 dark:to-purple-900/20">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Open</p>
            {isLoading ? <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-purple-200 dark:bg-purple-800/40" /> : <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">{metricsData?.open}</p>}
            <p className="mt-1 text-xs text-purple-600 dark:text-purple-300/80">{isLoading ? "—" : `${stats.inReviewRate?? 0}% of projects`}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Dropdown
                hasSearch
                list={projects}
                labelParam="name"
                parentClassName="rounded-xl h-12"
                dropdownClassName="!h-80"
                selectedValue={selectedProjectId}
                placeholder="Select a project"
                onValChange={(item) => {
                setSelectedProjectId(item.id);

                router.push(
                    {
                    pathname: router.pathname,
                    query: { ...router.query, projectId: item.id },
                    },
                    undefined,
                    { shallow: true }
                );
                }}
/>
            </div>
            <div className="flex items-center gap-3">
              <Button
                title="Filters"
                icon={<Filter size={18} />}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  showFilters
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              />
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                <Button
                  title={<Grid3x3 size={18} />}
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-400" : "text-slate-500 dark:text-gray-400"}`}
                />
                <Button
                  title={<LayoutList size={18} />}
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-400" : "text-slate-500 dark:text-gray-400"}`}
                />
              </div>
            </div>
          </div>

          {selectedProject && (
            <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
              Viewing bugs for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedProject.name}
              </span>
            </p>
          )}

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-2 xl:grid-cols-4 dark:border-white/10">
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <option>All Severities</option>
                <option>Critical</option>
                <option>Major</option>
                <option>Minor</option>
              </select>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <option>Recent First</option>
                <option>Oldest First</option>
              </select>
            </div>
          )}

          <div className="mt-5">
            <PaginatedTable
              data={mappedBugs}
              headers={BUG_HEADERS}
              loading={bugsLoading}
            />
          </div>
        </div>
      </PageLayout>

      <AddBugModal
        isOpen={showAddBugModal}
        onClose={() => setShowAddBugModal(false)}
        projectId={selectedProjectId}
        projectName={selectedProject?.name}
      />
    </div>
  );
};

export default Bugs;