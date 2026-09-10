import Button from "@/Component/Button/Button";
import PageLayout from "@/Component/Layout/PageLayout";
import {
  Filter,
  Plus,
  Search as SearchIcon,
  Grid3x3,
  LayoutList,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import NewProjectModal from "./Components/NewProjectModal";
import { useGetAllProject } from "../../services/project/useProject";
import { ProjectCardsGrid } from "../../Component/cards";

type SortOption = "recent" | "due-date" | "progress";
type TeamSizeOption = "any" | "1-2" | "3-5" | "6+";

interface Filters {
  status: string;
  priority: string;
  teamSize: TeamSizeOption;
  sort: SortOption;
}

const DEFAULT_FILTERS: Filters = {
  status: "all",
  priority: "all",
  teamSize: "any",
  sort: "recent",
};

function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.teamSize !== "any" ||
    filters.sort !== "recent"
  );
}

const Project = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { data, isLoading, isError } = useGetAllProject();

  const stats = useMemo(() => {
    const projects = data?.data ?? [];
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
  }, [data]);

  const filteredData = useMemo(() => {
    let projects = [...(data?.data ?? [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.status?.toLowerCase().includes(q) ||
          p.priority?.toLowerCase().includes(q)
      );
    }

    if (filters.status !== "all") {
      projects = projects.filter(
        (p) => p.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.priority !== "all") {
      projects = projects.filter(
        (p) => p.priority?.toLowerCase() === filters.priority.toLowerCase()
      );
    }

    if (filters.teamSize !== "any") {
      projects = projects.filter((p) => {
        const count = p.memberCount ?? 0;
        if (filters.teamSize === "1-2") return count >= 1 && count <= 2;
        if (filters.teamSize === "3-5") return count >= 3 && count <= 5;
        if (filters.teamSize === "6+") return count >= 6;
        return true;
      });
    }

    if (filters.sort === "due-date") {
      projects = projects.sort((a, b) => {
        const aDate = a.projectDueDate ? new Date(a.projectDueDate).getTime() : Infinity;
        const bDate = b.projectDueDate ? new Date(b.projectDueDate).getTime() : Infinity;
        return aDate - bDate;
      });
    } else if (filters.sort === "recent") {
      projects = projects.sort((a, b) => {
        const aDate = a.projectStartDate ? new Date(a.projectStartDate).getTime() : 0;
        const bDate = b.projectStartDate ? new Date(b.projectStartDate).getTime() : 0;
        return bDate - aDate;
      });
    }

    return { ...data, data: projects };
  }, [data, searchQuery, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.priority !== "all") count++;
    if (filters.teamSize !== "any") count++;
    if (filters.sort !== "recent") count++;
    return count;
  }, [filters]);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  };

  return (
    <>
      <PageLayout title="Projects" showSearch={false}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="mt-1 text-slate-600 dark:text-secondary-400">
              Manage and track all your projects in one place
            </p>
            <Button
              title="New Project"
              icon={<Plus size={20} />}
              onClick={() => setShowNewProjectModal(true)}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md"
            />
          </div>

          {/* Stats cards */}
         {/* Stats cards */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 backdrop-blur-sm dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02]">
    <p className="text-sm font-medium text-slate-600 dark:text-secondary-300">Total Projects</p>
    {isLoading ? (
      <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
    ) : (
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
    )}
    <p className="mt-1 text-xs text-slate-500 dark:text-secondary-400">All time</p>
  </div>

  <div className="rounded-xl border border-success-200 bg-gradient-to-br from-success-50 to-success-100 p-5 backdrop-blur-sm dark:border-success-800/40 dark:from-success-900/30 dark:to-success-800/10">
    <p className="text-sm font-medium text-success-700 dark:text-success-300">Completed</p>
    {isLoading ? (
      <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-success-200 dark:bg-success-800/40" />
    ) : (
      <p className="mt-2 text-3xl font-bold text-success-900 dark:text-success-100">{stats.completed}</p>
    )}
    <p className="mt-1 text-xs text-success-600 dark:text-success-300/80">
      {isLoading ? "—" : `${stats.completionRate}% completion rate`}
    </p>
  </div>

  <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 backdrop-blur-sm dark:border-orange-800/40 dark:from-orange-900/30 dark:to-orange-800/10">
    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</p>
    {isLoading ? (
      <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-orange-200 dark:bg-orange-800/40" />
    ) : (
      <p className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.inProgress}</p>
    )}
    <p className="mt-1 text-xs text-orange-600 dark:text-orange-300/80">
      {isLoading ? "—" : `${stats.inProgressRate}% of projects`}
    </p>
  </div>

  <div className="rounded-xl border border-info-200 bg-gradient-to-br from-info-50 to-info-100 p-5 backdrop-blur-sm dark:border-info-800/40 dark:from-info-900/30 dark:to-info-800/10">
    <p className="text-sm font-medium text-info-700 dark:text-info-300">In Review</p>
    {isLoading ? (
      <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-info-200 dark:bg-info-800/40" />
    ) : (
      <p className="mt-2 text-3xl font-bold text-info-900 dark:text-info-100">{stats.inReview}</p>
    )}
    <p className="mt-1 text-xs text-info-600 dark:text-info-300/80">
      {isLoading ? "—" : `${stats.inReviewRate}% of projects`}
    </p>
  </div>
</div>

          {/* Search + filter bar */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, status, or priority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-secondary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-secondary-500 dark:hover:text-secondary-300"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    showFilters || activeFilterCount > 0
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                >
                  <Filter size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-orange-600">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {(hasActiveFilters(filters) || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                  >
                    <X size={14} />
                    Clear
                  </button>
                )}

                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                    className={`rounded-md p-2 transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-orange-600 shadow-sm dark:bg-white/10 dark:text-orange-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                    }`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="List view"
                    className={`rounded-md p-2 transition-all ${
                      viewMode === "list"
                        ? "bg-white text-orange-600 shadow-sm dark:bg-white/10 dark:text-orange-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                    }`}
                  >
                    <LayoutList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-2 xl:grid-cols-4 dark:border-white/10">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-secondary-400">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilter("status", e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-secondary-400">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilter("priority", e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-secondary-400">Team Size</label>
                  <select
                    value={filters.teamSize}
                    onChange={(e) => setFilter("teamSize", e.target.value as TeamSizeOption)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  >
                    <option value="any">Any Team Size</option>
                    <option value="1-2">1–2 members</option>
                    <option value="3-5">3–5 members</option>
                    <option value="6+">6+ members</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-secondary-400">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilter("sort", e.target.value as SortOption)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  >
                    <option value="recent">Recent First</option>
                    <option value="due-date">Due Date</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>
              </div>
            )}

            {hasActiveFilters(filters) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.status !== "all" && (
                  <FilterChip label={`Status: ${filters.status}`} onRemove={() => setFilter("status", "all")} />
                )}
                {filters.priority !== "all" && (
                  <FilterChip label={`Priority: ${filters.priority}`} onRemove={() => setFilter("priority", "all")} />
                )}
                {filters.teamSize !== "any" && (
                  <FilterChip label={`Team: ${filters.teamSize}`} onRemove={() => setFilter("teamSize", "any")} />
                )}
                {filters.sort !== "recent" && (
                  <FilterChip label={`Sort: ${filters.sort}`} onRemove={() => setFilter("sort", "recent")} />
                )}
              </div>
            )}
          </div>

          {!isLoading && (searchQuery || hasActiveFilters(filters)) && (
            <p className="text-sm text-slate-500 dark:text-secondary-400">
              Showing{" "}
              <span className="font-medium text-slate-700 dark:text-gray-200">
                {filteredData.data?.length ?? 0}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700 dark:text-gray-200">
                {data?.data?.length ?? 0}
              </span>{" "}
              projects
            </p>
          )}

          <ProjectCardsGrid
            data={filteredData}
            isLoading={isLoading}
            isError={isError}
            viewMode={viewMode}
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

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-300">
      {label}
      <button
        onClick={onRemove}
        className="rounded-full text-orange-500 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-200"
      >
        <X size={11} />
      </button>
    </span>
  );
}

export default Project;