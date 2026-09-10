import { Project } from "@/services/project/project.api";

export interface ProjectRailProp {
  active: boolean;
  onClick: () => void;
  project: Project;
}

export const ProjectRail = ({ project, active, onClick }: ProjectRailProp) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-stretch overflow-hidden rounded-[10px] border text-left transition-all duration-150 cursor-pointer
        ${active
          ? "border-orange-500/30 bg-orange-500/[0.08]"
          : "border-slate-200 dark:border-white/[0.06] bg-transparent hover:border-slate-300 dark:hover:border-white/[0.12] hover:bg-slate-50 dark:hover:bg-white/[0.02]"
        }`}
    >
      <div className={`w-[3px] flex-shrink-0 transition-colors duration-150 ${active ? "bg-orange-500" : "bg-transparent"}`} />
      <div className="flex flex-1 items-center justify-between px-[14px] py-3 min-w-0">
        <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium ${active ? "text-orange-600 dark:text-orange-400" : "text-slate-700 dark:text-slate-200"}`}>
          {project.name}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-secondary-500 flex-shrink-0 ml-2">
          {project.status}
        </span>
      </div>
    </button>
  );
};