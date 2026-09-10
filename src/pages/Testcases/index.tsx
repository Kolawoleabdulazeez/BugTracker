import PageLayout from "@/Component/Layout/PageLayout";
import { useState, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Priority, TestCaseSummary, TestStatus } from "@/utils/types";
import { useGetAllProject } from "@/services/project/useProject";
import { useCreateTestcase, useDeleteTestcase, useGetTestcases } from "@/services/testcases/useTestcases";
import Button from "@/Component/Button/Button";
import { ProjectRail } from "../../Component/TestCase/ProjectRail";
import { ProjectStatsHeader } from "../../Component/TestCase/ProjectStatsHeader";
import { TestCaseToolbar } from "../../Component/TestCase/TestCaseToolbar";
import { TestCaseListPanel } from "../../Component/TestCase/TestCaseListPanel";
import AIModal from "./Components/AIModal";
import { ManualModal } from "../../Component/TestCase/ManualModal";
import { ProjectRailSkeleton } from "../../Component/TestCase/ProjectRailSkeleton";
import { TestCaseDetailModal } from "../../Component/TestCase/TestCaseDetailModal";

const TestCases = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "ai" | "manual">(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TestStatus | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [openTestCaseId, setOpenTestCaseId] = useState<string | null>(null);

  const { data: projectData, isLoading: projectsLoading } = useGetAllProject();
  const projects = projectData?.data ?? [];
  const proj = projects.find(p => p.id === projectId) ?? projects[0] ?? null;
  const activeProjectId = projectId ?? proj?.id ?? "";

  const { data: casesData } = useGetTestcases(activeProjectId);
 const cases = useMemo<TestCaseSummary[]>(
  () => casesData?.testCases ?? [],
  [casesData?.testCases]
);

const { mutate: createTestcase, isPending: isSavingTestcase } =
  useCreateTestcase(() => setModal(null));

const { mutate: deleteTestcase } = useDeleteTestcase();

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

const stats = {
  total: cases.length,
  passed: cases.filter((t) => t.status === TestStatus.Passed).length,
  failed: cases.filter((t) => t.status === TestStatus.Failed).length,
  pending: cases.filter((t) => t.status === TestStatus.Pending).length,
};
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
            <ProjectStatsHeader projectName={proj?.name} isLoading={projectsLoading} stats={stats} />

            <TestCaseToolbar
              search={search} onSearchChange={setSearch}
              filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}
              filterPriority={filterPriority} onFilterPriorityChange={setFilterPriority}
            />

            <TestCaseListPanel
              cases={cases}
              filtered={filtered}
              projectName={proj?.name}
              onAI={() => setModal("ai")}
              onManual={() => setModal("manual")}
              onDelete={id => deleteTestcase({ projectId: activeProjectId, testCaseId: id })}
              onOpen={id => setOpenTestCaseId(id)}
            />
          </div>
        </div>
      </PageLayout>

      {modal === "ai" && (
        <AIModal
          onClose={() => setModal(null)}
          onAdd={() => {}}
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
    </div>
  );
};

export default TestCases;