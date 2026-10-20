import PageLayout from "@/Component/Layout/PageLayout";
import { useState, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Priority, TestCaseSummary, TestCaseLifecycleStatus } from "@/utils/types";
import { useGetAllProject } from "@/services/project/useProject";
import {
  useCreateTestcase,
  useCreateTestRun,
  useDeleteTestcase,
  useGetTestcases,
  useUpdateTestcaseStatus,
} from "@/services/testcases/useTestcases";
import Button from "@/Component/Button/Button";
import { ProjectRail } from "../../Component/TestCase/ProjectRail";
import { ProjectStatsHeader } from "../../Component/TestCase/ProjectStatsHeader";
import { TestCaseToolbar } from "../../Component/TestCase/TestCaseToolbar";
import { TestCaseListPanel } from "../../Component/TestCase/TestCaseListPanel";
import AIModal from "./Components/AIModal";
import { ManualModal } from "../../Component/TestCase/ManualModal";
import { ProjectRailSkeleton } from "../../Component/TestCase/ProjectRailSkeleton";
import { TestCaseDetailModal } from "../../Component/TestCase/TestCaseDetailModal";
import { LogRunModal } from "../../Component/TestCase/LogRunModal";
import { GeneratedTestCase } from "@/services/testcases/testcases.api";
import { useCurrentUserId } from "@/utils/lib";

const TestCases = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "ai" | "manual">(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TestCaseLifecycleStatus | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [openTestCaseId, setOpenTestCaseId] = useState<string | null>(null);
  const [runTarget, setRunTarget] = useState<TestCaseSummary | null>(null);

  const { data: projectData, isLoading: projectsLoading } = useGetAllProject();
  const projects = projectData?.data ?? [];
  const proj = projects.find(p => p.id === projectId) ?? projects[0] ?? null;
  const activeProjectId = projectId ?? proj?.id ?? "";
        const currentUserId = useCurrentUserId();


  const {
    data: casesData,
    isLoading: casesLoading,
    isFetching: casesFetching,
  } = useGetTestcases(activeProjectId);

  const listLoading = projectsLoading || casesLoading;

  const cases = useMemo<TestCaseSummary[]>(
    () => casesData?.testCases ?? [],
    [casesData?.testCases]
  );

  const { mutate: createTestcase, isPending: isSavingTestcase } =
    useCreateTestcase(() => setModal(null));

  const { mutate: deleteTestcase } = useDeleteTestcase();

  const { mutate: updateStatus, variables: statusVars, isPending: isUpdatingStatus } =
    useUpdateTestcaseStatus();

  const { mutate: createRun, isPending: isLoggingRun } = useCreateTestRun(
    () => setRunTarget(null)
  );

      const handleAddGenerated = (items: GeneratedTestCase[]) => {
  if (!items.length) return;

  createTestcase({
    projectId: activeProjectId,
    payload: items.map((tc) => ({
      title: tc.title,
      description: tc.description,
      preconditions: tc.preconditions,
      steps: tc.steps, // see note below
      expectedResult: tc.expectedResult,
      priority: tc.priority.toLowerCase() as Priority,
      assignedToId: currentUserId ?? "",
      tags: tc.tags,
    })),
  });
};

  const updatingStatusId = isUpdatingStatus ? statusVars?.testCaseId ?? null : null;

  const filtered = useMemo(
    () =>
      cases.filter((tc) => {
        if (filterStatus && tc.status !== filterStatus) return false;
        if (filterPriority && tc.priority !== filterPriority) return false;
        if (
          search &&
          !tc.title.toLowerCase().includes(search.toLowerCase()) &&
          !tc.caseLabel.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [cases, filterStatus, filterPriority, search]
  );

  const stats = useMemo(
    () => ({
      total: cases.length,
      active: cases.filter((t) => t.status === "active").length,
      draft: cases.filter((t) => t.status === "draft").length,
      deprecated: cases.filter((t) => t.status === "deprecated").length,
    }),
    [cases]
  );

  return (
    <div>
      <PageLayout title="Test Cases" showSearch={false}>
        <div className="flex justify-between items-start mb-5 flex-col md:flex-row gap-3">
          <div className="flex gap-3 flex-wrap">
            <Button
              icon={<Sparkles size={13} />}
              title="Generate with AI"
              className="!text-amber-600 dark:!text-amber-400 px-5 cursor-pointer !bg-amber-400/[0.10] dark:!bg-amber-400/[0.08] border border-amber-400/25 shadow-none hover:!bg-amber-400/[0.16]"
              onClick={() => setModal("ai")}
            />
            <Button icon={<Plus size={14} />} title="New Test" onClick={() => setModal("manual")} />
          </div>
        </div>

        <div className="flex gap-5 flex-col lg:flex-row">
          <div className="lg:w-[240px] lg:flex-shrink-0 w-full">
            <button className="lg:hidden flex items-center justify-between w-full mb-2 cursor-pointer bg-transparent border-none p-0" onClick={() => setRailOpen(o => !o)}>
              <p className="m-0 text-[12px] text-slate-900 dark:text-white tracking-[0.12em] font-bold">PROJECTS</p>
            </button>
            <p className="hidden lg:block ml-1 mb-2.5 text-[9px] text-slate-500 dark:text-secondary-500 tracking-[0.12em] font-bold">PROJECTS</p>

            <div className={`${railOpen ? "block" : "hidden"} lg:block`}>
              {projectsLoading ? (
                <ProjectRailSkeleton />
              ) : projects.length === 0 ? (
                <p className="text-[11px] text-slate-500 dark:text-secondary-500 px-1 py-3">No projects found</p>
              ) : (
                <div className="flex lg:flex-col flex-row gap-1.5 overflow-x-auto pb-2 lg:pb-0 lg:overflow-x-visible">
                  {projects.map(project => (
                    <div key={project.id} className="lg:w-full flex-shrink-0 w-[180px]">
                      <ProjectRail project={project} active={activeProjectId === project.id} onClick={() => { setProjectId(project.id); setRailOpen(false); }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <ProjectStatsHeader
              projectName={proj?.name}
              isLoading={listLoading}
              stats={stats}
            />

            <TestCaseToolbar
              search={search} onSearchChange={setSearch}
              filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}
              filterPriority={filterPriority} onFilterPriorityChange={setFilterPriority}
            />

            <TestCaseListPanel
              cases={cases}
              filtered={filtered}
              isLoading={listLoading}
              isRefreshing={casesFetching && !casesLoading}
              projectName={proj?.name}
              onAI={() => setModal("ai")}
              onManual={() => setModal("manual")}
              onDelete={id => deleteTestcase({ projectId: activeProjectId, testCaseId: id })}
              onOpen={id => setOpenTestCaseId(id)}
              onRun={tc => setRunTarget(tc)}
              onStatusChange={(id, status) =>
                updateStatus({ projectId: activeProjectId, testCaseId: id, payload: { status } })
              }
              updatingStatusId={updatingStatusId}
            />
          </div>
        </div>
      </PageLayout>

      {modal === "ai" && (
        <AIModal
  onClose={() => setModal(null)}
  onAdd={handleAddGenerated}
  isSaving={isSavingTestcase}
  projectId={activeProjectId}
  projectOverview={proj?.description ?? ""}
/>
      )}
      {modal === "manual" && (
        <ManualModal
          onClose={() => setModal(null)}
          onSave={payload => createTestcase({ projectId: activeProjectId, payload: [payload] })}
          isSaving={isSavingTestcase}
        />
      )}

      {openTestCaseId && (
        <TestCaseDetailModal
          projectId={activeProjectId}
          testCaseId={openTestCaseId}
          onClose={() => setOpenTestCaseId(null)}
        />
      )}

      {runTarget && (
        <LogRunModal
          testCaseLabel={runTarget.caseLabel}
          testCaseTitle={runTarget.title}
          onClose={() => setRunTarget(null)}
          isSaving={isLoggingRun}
          onSave={payload =>
            createRun({
              projectId: activeProjectId,
              testCaseId: runTarget.id,
              payload,
            })
          }
        />
      )}
    </div>
  );
};

export default TestCases;