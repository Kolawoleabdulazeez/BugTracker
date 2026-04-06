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
} from "lucide-react";
import { useRouter } from "next/router";
import { Project } from "@/utils/data";
import { formatTimestamp } from "@/utils";
import ConfirmActionModal from "../pages/Project/Components/DeleteProjectModal";
import { useDeleteProject } from "@/services/project/useProject";
import { GetProject_Response } from "@/services/project/project.api";
import { getPriorityStyles, getProjectStatusStyles } from "@/utils/helpers";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { mutateAsync: handleDeleteProject, isPending: isDeleting } =
  useDeleteProject();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const daysLeft = project.projectDueDate
    && Math.max(
        0,
        Math.ceil(
          (new Date(project.projectDueDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    

  const goToDetails = () => {
    router.push(`/Project/${project.id}`);
  };

  const onConfirmDeleteProject = async () => {
  try {
    await handleDeleteProject(project.id);
    setShowDeleteModal(false);
    setShowMenu(false);
  } catch (error) {
    console.error("Delete project failed:", error);
  }
};

console.log(project, "this is project type in card")
const statusStyles = getProjectStatusStyles(project.status);
const priorityStyles = getPriorityStyles(project.priority);



  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        onClick={goToDetails}
        className="relative w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 dark:backdrop-blur-sm dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:shadow-2xl dark:hover:shadow-black/30"
      >
        <div className={`h-1.5`} />

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <CardItem translateZ="50">
                <h3 className="mb-1.5 text-xl font-bold text-slate-900 transition-colors group-hover/card:text-blue-600 dark:text-white dark:group-hover/card:text-blue-400">
                  {project.name}
                </h3>
              </CardItem>

              <CardItem translateZ="40">
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-gray-400">
                  {project.description}
                </p>
              </CardItem>
            </div>

            <CardItem translateZ="50" className="flex items-center gap-2">
              <button
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
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-400 dark:text-gray-500"
                  }
                />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <MoreVertical
                    size={18}
                    className="text-slate-400 dark:text-gray-400"
                  />
                </button>

                {showMenu && (
                  <div className="absolute right-0 z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-[#111118] dark:shadow-black/30">
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
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Delete
            </button>
                  </div>
                )}
              </div>
            </CardItem>
          </div>

          <CardItem translateZ="60" className="mb-4 flex items-center gap-2">
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

          <CardItem translateZ="70" className="mb-2 w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={14}
                    className="text-slate-400 dark:text-gray-500"
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                    Progress
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {/* {project.progress}% */}
                  {40}%

                </span>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  // style={{ width: `${project.progress}%` }}
                                    style={{ width: `${60}%` }}

                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400">
                {/* {project.completedTasks} of {project.totalTasks} tasks completed */}
                {2} of {5} tasks completed

              </p>
            </div>
          </CardItem>

          <CardItem translateZ="80" className="mb-2  grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
              <Calendar
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-gray-500"
              />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {formatTimestamp(project.projectDueDate)}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Due Date
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
              <Clock
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-gray-500"
              />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {daysLeft} days
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Remaining
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
              <Users
                size={16}
                className="mx-auto mb-1 text-slate-400 dark:text-gray-500"
              />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {project.memberCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Members
              </p>
            </div>
          </CardItem>

          <CardItem
            translateZ="90"
            className="border-t border-slate-200 pt-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                {/* {project.teamMembers.slice(0, 4).map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${member.color} border-2 border-white text-white shadow-sm transition-transform hover:scale-110 dark:border-[#0b0b0f]`}
                    style={{ zIndex: project.teamMembers.length - index }}
                    title={member.name || "Team member"}
                  >
                    <span className="text-base">{member.avatar}</span>
                  </div>
                ))} */}

                {project.memberCount > 4 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm dark:border-[#0b0b0f] dark:bg-white/10">
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-200">
                      +{project.memberCount - 4}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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

interface ProjectCardsGridProps {
  data: GetProject_Response | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function ProjectCardsGrid({
  data,
  isLoading,
  isError,
}: ProjectCardsGridProps) {
  if (isLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-white/10" />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load projects.
      </div>
    );

  const projects = (data?.data ?? []).map((project) => {

    return {
      ...project,
      title: project.name,
      dueDate: project.projectDueDate,
      startDate: project.projectStartDate,
      status: project.status,
      teamSize: project.memberCount,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}


    </div>
  );
}

