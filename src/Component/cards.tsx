"use client";

import { CardBody, CardContainer, CardItem } from "@/Component/UI/3d-card";
import { useState } from "react";
import {
  Calendar,
  Users,
  MoreVertical,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/router";
import { Project } from "@/utils/data";
import { formatTimestamp } from "@/utils";
import ConfirmActionModal from "../pages/Project/Components/DeleteProjectModal";
import { useDeleteProject } from "@/services/project/useProject";
import { GetProject_Response } from "@/services/project/project.api";
import { getPriorityStyles, getProjectStatusStyles } from "@/utils/helpers";

type ViewMode = "grid" | "list";

interface ProjectCardProps {
  project: Project;
  viewMode?: ViewMode;
}

function useProjectCard(project: Project) {
  const [isStarred, setIsStarred] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { mutateAsync: handleDeleteProject, isPending: isDeleting } =
    useDeleteProject();

  const daysLeft =
    project.projectDueDate &&
    Math.max(
      0,
      Math.ceil(
        (new Date(project.projectDueDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    );

  const goToDetails = () => router.push(`/Project/${project.id}`);

  const onConfirmDeleteProject = async () => {
    try {
      await handleDeleteProject(project.id);
      setShowDeleteModal(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Delete project failed:", error);
    }
  };

  const statusStyles = getProjectStatusStyles(project.status);
  const priorityStyles = getPriorityStyles(project.priority);

  return {
    isStarred,
    setIsStarred,
    showMenu,
    setShowMenu,
    showDeleteModal,
    setShowDeleteModal,
    daysLeft,
    goToDetails,
    onConfirmDeleteProject,
    isDeleting,
    statusStyles,
    priorityStyles,
  };
}

function ProjectContextMenu({
  showMenu,
  setShowMenu,
  setShowDeleteModal,
}: {
  showMenu: boolean;
  setShowMenu: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <MoreVertical size={18} className="text-slate-400 dark:text-secondary-400" />
      </button>

      {showMenu && (
        <div className="glass-panel absolute right-0 z-50 mt-1 w-40 rounded-lg py-1">
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-white/5"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-danger-500 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectGridCard({ project }: { project: Project }) {
  const {
    isStarred,
    setIsStarred,
    showMenu,
    setShowMenu,
    showDeleteModal,
    setShowDeleteModal,
    daysLeft,
    goToDetails,
    onConfirmDeleteProject,
    isDeleting,
    statusStyles,
    priorityStyles,
  } = useProjectCard(project);

  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        onClick={goToDetails}
        className="glass-card relative w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl dark:border-white/[0.08] dark:bg-[#171717] dark:hover:border-orange-500/20 dark:hover:shadow-2xl dark:hover:shadow-black/40"
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardItem translateZ="50">
                <h3 className="mb-1.5 text-xl font-bold text-slate-900 dark:text-white">
                  {project.name}
                </h3>
              </CardItem>

              <CardItem translateZ="40">
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-secondary-400">
                  {project.description}
                </p>
              </CardItem>
            </div>

            <CardItem
              translateZ="50"
              className="ml-3 flex shrink-0 items-center gap-2"
            >
              {/* Star */}
              <button
                type="button"
                aria-label={
                  isStarred ? "Remove from favorites" : "Add to favorites"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStarred(!isStarred);
                }}
                className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Star
                  size={18}
                  className={
                    isStarred
                      ? "fill-orange-400 text-orange-400"
                      : "text-slate-400 dark:text-secondary-500"
                  }
                />
              </button>

              <ProjectContextMenu
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                setShowDeleteModal={setShowDeleteModal}
              />
            </CardItem>
          </div>

          {/* Status + Priority */}
          <CardItem
            translateZ="60"
            className="mb-4 flex items-center gap-2"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}
            >
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusStyles.dot}`}
              />
              {project.status}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles.bg} ${priorityStyles.text}`}
            >
              {project.priority} Priority
            </span>
          </CardItem>

          {/* Progress */}
          <CardItem translateZ="70" className="mb-4 w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={14}
                    className="text-slate-400 dark:text-secondary-500"
                  />

                  <span className="text-xs font-medium text-slate-500 dark:text-secondary-400">
                    Progress
                  </span>
                </div>

                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  40%
                </span>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{ width: "40%" }}
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-secondary-400">
                2 of 5 tasks completed
              </p>
            </div>
          </CardItem>

          {/* Project Stats */}
          <CardItem
            translateZ="80"
            className="mb-4 grid grid-cols-3 gap-2"
          >
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-center dark:border-white/[0.07] dark:bg-white/[0.035]">
              <Calendar
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-secondary-500"
              />

              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {formatTimestamp(project.projectDueDate)}
              </p>

              <p className="text-xs text-slate-500 dark:text-secondary-400">
                Due Date
              </p>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-center dark:border-white/[0.07] dark:bg-white/[0.035]">
              <Clock
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-secondary-500"
              />

              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {daysLeft} days
              </p>

              <p className="text-xs text-slate-500 dark:text-secondary-400">
                Remaining
              </p>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-center dark:border-white/[0.07] dark:bg-white/[0.035]">
              <Users
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-secondary-500"
              />

              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {project.memberCount}
              </p>

              <p className="text-xs text-slate-500 dark:text-secondary-400">
                Members
              </p>
            </div>
          </CardItem>

          {/* Footer */}
          <CardItem
            translateZ="90"
            className="border-t border-slate-200 pt-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                {project.memberCount > 4 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm dark:border-[#171717] dark:bg-white/10">
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-200">
                      +{project.memberCount - 4}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                View Details →
              </button>
            </div>
          </CardItem>
        </div>
      </CardBody>

      <ConfirmActionModal
        isOpen={showDeleteModal}
        title="Delete Project"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {project.name}
            </span>
            ? All related data for this project may become inaccessible.
          </>
        }
        confirmText="Delete Project"
        isLoading={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDeleteProject}
      />
    </CardContainer>
  );
}
function ProjectListRow({ project }: { project: Project }) {
  const {
    isStarred, setIsStarred,
    showMenu, setShowMenu,
    showDeleteModal, setShowDeleteModal,
    daysLeft, goToDetails,
    onConfirmDeleteProject, isDeleting,
    statusStyles, priorityStyles,
  } = useProjectCard(project);

  return (
    <>
      <div
        onClick={goToDetails}
        className="glass-card group flex cursor-pointer items-center gap-4 rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-glow"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {project.name}
            </h3>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-secondary-400">
            {project.description}
          </p>
        </div>

        <div className="hidden sm:block flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusStyles.dot}`} />
            {project.status}
          </span>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles.bg} ${priorityStyles.text}`}>
            {project.priority}
          </span>
        </div>

        <div className="hidden lg:flex w-32 flex-shrink-0 flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-secondary-400">Progress</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">40%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: "60%" }} />
          </div>
        </div>

        <div className="hidden xl:flex flex-shrink-0 items-center gap-1.5 text-xs text-slate-500 dark:text-secondary-400">
          <Calendar size={13} className="text-slate-400" />
          {formatTimestamp(project.projectDueDate)}
        </div>

        <div className="hidden xl:flex flex-shrink-0 items-center gap-1.5 text-xs text-slate-500 dark:text-secondary-400">
          <Clock size={13} className="text-slate-400" />
          {daysLeft}d left
        </div>

        <div className="hidden sm:flex flex-shrink-0 items-center gap-1.5 text-xs text-slate-500 dark:text-secondary-400">
          <Users size={13} className="text-slate-400" />
          {project.memberCount}
        </div>

        <div
          className="flex flex-shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsStarred(!isStarred); }}
            className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <Star
              size={15}
              className={isStarred ? "fill-orange-400 text-orange-400" : "text-slate-400 dark:text-secondary-500"}
            />
          </button>
          <ProjectContextMenu
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            setShowDeleteModal={setShowDeleteModal}
          />
          <ChevronRight
            size={16}
            className="ml-1 text-slate-300 transition-colors group-hover:text-slate-400 dark:text-white/20 dark:group-hover:text-white/40"
          />
        </div>
      </div>

      <ConfirmActionModal
        isOpen={showDeleteModal}
        title="Delete Project"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{project.name}</span>
            ? All related data for this project may become inaccessible.
          </>
        }
        confirmText="Delete Project"
        isLoading={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDeleteProject}
      />
    </>
  );
}

export function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  if (viewMode === "list") return <ProjectListRow project={project} />;
  return <ProjectGridCard project={project} />;
}

interface ProjectCardsGridProps {
  data: GetProject_Response | undefined;
  isLoading: boolean;
  isError: boolean;
  viewMode?: ViewMode;
}

export function ProjectCardsGrid({
  data,
  isLoading,
  isError,
  viewMode = "grid",
}: ProjectCardsGridProps) {
  if (isLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500 dark:border-white/10" />
      </div>
    );

  if (isError)
    return (
      <p className="text-sm text-danger-500 dark:text-danger-400">
        Failed to load projects.
      </p>
    );

  const projects = (data?.data ?? []).map((project) => ({
    ...project,
    title: project.name,
    dueDate: project.projectDueDate,
    startDate: project.projectStartDate,
    status: project.status,
    teamSize: project.memberCount,
  }));

  if (projects.length === 0)
    return (
      <p className="text-sm text-slate-400 dark:text-secondary-500">
        No projects found.
      </p>
    );

  if (viewMode === "list")
    return (
      <div className="flex flex-col gap-2">
        <div className="hidden lg:flex items-center gap-4 px-5 pb-1 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-secondary-500">
          <span className="flex-1">Project</span>
          <span className="hidden sm:block w-24 flex-shrink-0">Status</span>
          <span className="hidden md:block w-20 flex-shrink-0">Priority</span>
          <span className="hidden lg:block w-32 flex-shrink-0">Progress</span>
          <span className="hidden xl:block w-24 flex-shrink-0">Due date</span>
          <span className="hidden xl:block w-16 flex-shrink-0">Time left</span>
          <span className="hidden sm:block w-12 flex-shrink-0">Members</span>
          <span className="w-20 flex-shrink-0" />
        </div>

        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode="list" />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} viewMode="grid" />
      ))}
    </div>
  );
}