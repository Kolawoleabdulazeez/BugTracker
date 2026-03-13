"use client";

import { CardBody, CardContainer, CardItem } from "@/Component/UI/3d-card";
import React, { useState } from "react";
import { Calendar, Users, MoreVertical, Clock, TrendingUp, Star } from "lucide-react";
import { useRouter } from "next/router";
import { projectsData } from "@/pages/utils/data";
import { formatTimestamp } from "@/pages/utils";
import { GetProject_Response } from "@/pages/utils/services/project/project.api";

interface ProjectCardProps {
  project: typeof projectsData[0];
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const daysLeft = project.dueDate
  ? Math.max(0, Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  : project.daysLeft;

  const goToDetails = () => {
    router.push(`/Project/${project.id}`);
  };

  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        onClick={goToDetails}
        className="relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-black/30"
      >
        <div className={`h-1.5 ${project.statusColor}`} />

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <CardItem translateZ="50">
                <h3 className="mb-1.5 text-xl font-bold text-white transition-colors group-hover/card:text-blue-400">
                  {project.title}
                </h3>
              </CardItem>

              <CardItem translateZ="40">
                <p className="line-clamp-2 text-sm text-gray-400">
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
                className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              >
                <Star
                  size={18}
                  className={isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}
                />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 z-50 mt-1 w-40 rounded-lg border border-white/10 bg-[#111118] py-1 shadow-lg shadow-black/30">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </CardItem>
          </div>

          <CardItem translateZ="60" className="mb-4 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white ${project.statusColor}`}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {project.status}
            </span>

            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white ${project.priorityColor}`}>
              {project.priority} Priority
            </span>
          </CardItem>

          <CardItem translateZ="70" className="mb-2 w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-400">Progress</span>
                </div>
                <span className="text-sm font-bold text-white">{project.progress}%</span>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${project.statusColor}`}
                  style={{ width: `${project.progress}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20" />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {project.completedTasks} of {project.totalTasks} tasks completed
              </p>
            </div>
          </CardItem>

          <CardItem translateZ="80" className="mb-2 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
              <Calendar size={16} className="mx-auto mb-1 text-gray-500" />
              <p className="text-xs font-semibold text-white">{formatTimestamp(project.dueDate)}</p>
              <p className="text-xs text-gray-400">Due Date</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
              <Clock size={16} className="mx-auto mb-1 text-gray-500" />
              <p className="text-xs font-semibold text-white">{daysLeft} days</p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
              <Users size={16} className="mx-auto mb-1 text-gray-500" />
              <p className="text-xs font-semibold text-white">{project.teamSize}</p>
              <p className="text-xs text-gray-400">Members</p>
            </div>
          </CardItem>

          <CardItem translateZ="90" className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                {project.teamMembers.slice(0, 4).map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${member.color} border-2 border-[#0b0b0f] text-white shadow-sm transition-transform hover:scale-110`}
                    style={{ zIndex: project.teamMembers.length - index }}
                    title={member.name || "Team member"}
                  >
                    <span className="text-base">{member.avatar}</span>
                  </div>
                ))}

                {project.teamMembers.length > 4 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b0b0f] bg-white/10 shadow-sm">
                    <span className="text-xs font-semibold text-gray-200">
                      +{project.teamMembers.length - 4}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                View Details →
              </button>
            </div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}


interface ProjectCardsGridProps {
  data: GetProject_Response | undefined;
  isLoading: boolean;
  isError: boolean;
}


export function ProjectCardsGrid({ data, isLoading, isError }: ProjectCardsGridProps) {

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
    </div>
  );

  if (isError) return <div className="text-red-400">Failed to load projects.</div>;

  const projects = (data?.data ?? []).map((apiProject, index) => {
    const mockFallback = projectsData[index % projectsData.length];

    return {
      ...mockFallback,
      ...apiProject,
      title: apiProject.name,
      dueDate: apiProject.projectDueDate ?? mockFallback.dueDate,
      startDate: apiProject.projectStartDate ?? mockFallback.startDate,
      status: apiProject.status ?? mockFallback.status,
      teamSize: apiProject.memberCount,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
export { projectsData };