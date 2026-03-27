import Button from "@/Component/Button/Button";
import PageLayout from "@/Component/Layout/PageLayout";
import {
  Filter,
  Plus,
  Search as SearchIcon,
  Grid3x3,
  LayoutList,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ProjectCardsGrid } from "./Components/cards";
import NewProjectModal from "./Components/NewProjectModal";
import { useGetAllProject } from "../services/project/useProject";


const Project = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const { data, isLoading, isError } = useGetAllProject();

  console.log(data, "this is the data to get project type")

  const projects= data?.data ?? [];

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

    return {
      total,
      completed,
      inProgress,
      inReview,
      completionRate,
      inProgressRate,
      inReviewRate,
    };
  }, [projects]);

  return (
    <>
      <PageLayout
        title="Projects"
        showSearch={false}
        contentClassName="bg-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mt-1 text-slate-600 dark:text-gray-400">
                Manage and track all your projects in one place
              </p>
            </div>

            <Button
              title="New Project"
              icon={<Plus size={20} />}
              onClick={() => setShowNewProjectModal(true)}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-blue-900/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Projects
              </p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-blue-200 dark:bg-blue-800/40" />
              ) : (
                <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {stats.total}
                </p>
              )}
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-300/80">
                All time
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/40 dark:from-green-950/40 dark:to-green-900/20">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Completed
              </p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-green-200 dark:bg-green-800/40" />
              ) : (
                <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">
                  {stats.completed}
                </p>
              )}
              <p className="mt-1 text-xs text-green-600 dark:text-green-300/80">
                {isLoading ? "—" : `${stats.completionRate}% completion rate`}
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 dark:border-yellow-900/40 dark:from-yellow-950/40 dark:to-yellow-900/20">
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                In Progress
              </p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-yellow-200 dark:bg-yellow-800/40" />
              ) : (
                <p className="mt-2 text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                  {stats.inProgress}
                </p>
              )}
              <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-300/80">
                {isLoading ? "—" : `${stats.inProgressRate}% of projects`}
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/40 dark:from-purple-950/40 dark:to-purple-900/20">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                In Review
              </p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-purple-200 dark:bg-purple-800/40" />
              ) : (
                <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.inReview}
                </p>
              )}
              <p className="mt-1 text-xs text-purple-600 dark:text-purple-300/80">
                {isLoading ? "—" : `${stats.inReviewRate}% of projects`}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search projects by name, status, or team member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    showFilters
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                >
                  <Filter size={18} />
                  Filters
                </button>

                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-md p-2 transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-400"
                        : "text-slate-500 dark:text-gray-400"
                    }`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-md p-2 transition-all ${
                      viewMode === "list"
                        ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-blue-400"
                        : "text-slate-500 dark:text-gray-400"
                    }`}
                  >
                    <LayoutList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-2 xl:grid-cols-4 dark:border-white/10">
                <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option>All Statuses</option>
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>Completed</option>
                </select>

                <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option>Any Team Size</option>
                  <option>1-2 members</option>
                  <option>3-5 members</option>
                </select>

                <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option>Recent First</option>
                  <option>Due Date</option>
                  <option>Progress</option>
                </select>
              </div>
            )}
          </div>

          <ProjectCardsGrid
            data={data}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </PageLayout>

          <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        mode="create"
      />
    </>
  );
};

export default Project;