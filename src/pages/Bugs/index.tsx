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
import { mergeOptions, PRIORITY_DEFAULTS, SEVERITY_DEFAULTS, SortOrder, STATUS_DEFAULTS } from "@/utils";

const Bugs = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddBugModal, setShowAddBugModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
const [severityFilter, setSeverityFilter] = useState("");
const [priorityFilter, setPriorityFilter] = useState("");
const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

const activeFilterCount = [statusFilter, severityFilter, priorityFilter].filter(Boolean).length;

const clearFilters = () => {
  setStatusFilter("");
  setSeverityFilter("");
  setPriorityFilter("");
  setSortOrder("newest");
};

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

  const toItems = (allLabel: string, options: string[]): DropdownItem[] => [
  { id: "all", name: allLabel },
  ...options.map((o) => ({ id: o, name: o })),
];

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

  const allBugs = useMemo(() => bugsData?.bugs ?? [], [bugsData]);

const statusOptions = useMemo(() => mergeOptions(STATUS_DEFAULTS, allBugs.map((b) => b.status)), [allBugs]);
const severityOptions = useMemo(() => mergeOptions(SEVERITY_DEFAULTS, allBugs.map((b) => b.severity)), [allBugs]);
const priorityOptions = useMemo(() => mergeOptions(PRIORITY_DEFAULTS, allBugs.map((b) => b.priority)), [allBugs]);

const statusItems = toItems("All Statuses", statusOptions);
const severityItems = toItems("All Severities", severityOptions);
const priorityItems = toItems("All Priorities", priorityOptions);

const visibleBugs = useMemo(() => {
  const filtered = allBugs.filter(
    (b) =>
      (!statusFilter || b.status === statusFilter) &&
      (!severityFilter || b.severity === severityFilter) &&
      (!priorityFilter || b.priority === priorityFilter)
  );

  return [...filtered].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });
}, [allBugs, statusFilter, severityFilter, priorityFilter, sortOrder]);


const mappedBugs = useMemo(() => {
  return visibleBugs.map((bug) => ({
    ...bug,
    action: (
      <div data-no-row-click>
        {RenderComponent(BugActionButton, {
          item: bug,
          projectId: selectedProjectId,
          onActionSuccess: refetchBugs,
        })}
      </div>
    ),
  }));
}, [visibleBugs, selectedProjectId, refetchBugs]);

const handleRowClick = (bug: { id: string }) => {
  router.push(`/Bugs/${bug.id}?projectId=${selectedProjectId}`);
};

  const handleAddBugClick = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project before reporting a bug.");
      return;
    }
    setShowAddBugModal(true);
  };

  type DropdownItem = { id: string; name: string };



const SORT_ITEMS: DropdownItem[] = [
  { id: "newest", name: "Recent First" },
  { id: "oldest", name: "Oldest First" },
];

const FilterDropdown = ({
  list,
  value,
  placeholder,
  onChange,
}: {
  list: DropdownItem[];
  value: string;
  placeholder: string;
  onChange: (id: string) => void;
}) => (
  <Dropdown
    list={list}
    labelParam="name"
    valueParam="id"
    selectedValue={value}
    placeholder={placeholder}
    parentClassName="rounded-lg h-11"
    dropdownClassName="!h-auto max-h-72"
    onValChange={(item) => onChange(item.id)}
  />
);

  return (
    <div>
      <PageLayout title="Bugs" showSearch={false}>
        <div className="space-y-6 mb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="mt-1 text-slate-600 dark:text-secondary-400">
              View and manage all reported bugs here
            </p>
            <Button
              title="New Bug"
              icon={<Plus size={20} />}
              onClick={handleAddBugClick}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-3">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 backdrop-blur-sm dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02]">
            <p className="text-sm font-medium text-slate-600 dark:text-secondary-300">Total Bugs</p>
            {isLoading ? (
              <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{metricsData?.totalBugs}</p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-secondary-400">All time</p>
          </div>

          <div className="rounded-xl border border-success-200 bg-gradient-to-br from-success-50 to-success-100 p-5 backdrop-blur-sm dark:border-success-800/40 dark:from-success-900/30 dark:to-success-800/10">
            <p className="text-sm font-medium text-success-700 dark:text-success-300">Completed</p>
            {isLoading ? (
              <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-success-200 dark:bg-success-800/40" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-success-900 dark:text-success-100">{metricsData?.closed}</p>
            )}
            <p className="mt-1 text-xs text-success-600 dark:text-success-300/80">
              {isLoading ? "—" : `${metricsData?.completionPercentage ?? 0}% completion rate`}
            </p>
          </div>

          <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 backdrop-blur-sm dark:border-orange-800/40 dark:from-orange-900/30 dark:to-orange-800/10">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</p>
            {isLoading ? (
              <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-orange-200 dark:bg-orange-800/40" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-100">{metricsData?.inProgress}</p>
            )}
            <p className="mt-1 text-xs text-orange-600 dark:text-orange-300/80">
              {isLoading ? "—" : `${metricsData?.completionPercentage ?? 0}% of projects`}
            </p>
          </div>

          <div className="rounded-xl border border-danger-200 bg-gradient-to-br from-danger-50 to-danger-100 p-5 backdrop-blur-sm dark:border-danger-800/40 dark:from-danger-900/30 dark:to-danger-800/10">
            <p className="text-sm font-medium text-danger-700 dark:text-danger-300">Open</p>
            {isLoading ? (
              <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-danger-200 dark:bg-danger-800/40" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-danger-900 dark:text-danger-100">{metricsData?.open}</p>
            )}
            <p className="mt-1 text-xs text-danger-600 dark:text-danger-300/80">Needs attention</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
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
          <button
  onClick={() => setShowFilters(!showFilters)}
  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
    showFilters
      ? "border-orange-500 bg-orange-500 text-white"
      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
  }`}
>
  <Filter size={18} />
  Filters
  {activeFilterCount > 0 && (
    <span
      className={`rounded-full px-1.5 text-[10px] font-bold ${
        showFilters
          ? "bg-white text-orange-600"
          : "bg-orange-500 text-white"
      }`}
    >
      {activeFilterCount}
    </span>
  )}
</button>

              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm dark:bg-white/10 dark:text-orange-400"
                      : "text-slate-500 dark:text-secondary-400"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "list"
                      ? "bg-white text-orange-600 shadow-sm dark:bg-white/10 dark:text-orange-400"
                      : "text-slate-500 dark:text-secondary-400"
                  }`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>

          {selectedProject && (
            <p className="mt-3 text-sm text-slate-500 dark:text-secondary-400">
              Viewing bugs for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedProject.name}
              </span>
            </p>
          )}

         {showFilters && (
  <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <FilterDropdown
        list={statusItems}
        value={statusFilter || "all"}
        placeholder="Status"
        onChange={(id) => setStatusFilter(id === "all" ? "" : id)}
      />
      <FilterDropdown
        list={severityItems}
        value={severityFilter || "all"}
        placeholder="Severity"
        onChange={(id) => setSeverityFilter(id === "all" ? "" : id)}
      />
      <FilterDropdown
        list={priorityItems}
        value={priorityFilter || "all"}
        placeholder="Priority"
        onChange={(id) => setPriorityFilter(id === "all" ? "" : id)}
      />
      <FilterDropdown
        list={SORT_ITEMS}
        value={sortOrder}
        placeholder="Sort"
        onChange={(id) => setSortOrder(id as SortOrder)}
      />
    </div>

    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-secondary-400">
      <span>
        Showing {visibleBugs.length} of {allBugs.length} bugs
      </span>
      {(activeFilterCount > 0 || sortOrder !== "newest") && (
        <button
          onClick={clearFilters}
          className="cursor-pointer border-none bg-transparent font-medium text-orange-600 hover:underline dark:text-orange-400"
        >
          Clear filters
        </button>
      )}
    </div>
  </div>
)}
          <div className="mt-5">
            <PaginatedTable
          data={mappedBugs}
          headers={BUG_HEADERS}
          loading={bugsLoading}
          onRowClick={handleRowClick}
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