import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  Paperclip,
  MoreVertical,
  Star,
  CheckCircle,
} from "lucide-react";
import Button from "@/Component/Button/Button";
import { formatTimestamp, mapActivityDescription } from "../utils";
import OverviewTab from "./Components/tabs/OverviewTab";
import TeamTab from "./Components/tabs/TeamTab";
import ActivityTab from "./Components/tabs/ActivityTab";
import NewProjectModal from "./Components/NewProjectModal";
import AddMemberModal from "./Components/AddMemberModal";
import ConfirmActionModal from "./Components/DeleteProjectModal";
import { useGetProjectActivities, useGetProjectById, useGetProjectMetrics, useRemoveProjectMember } from "../services/project/useProject";
import BugsTab from "./Components/tabs/BugsTab";
import { useGetBugs } from "../services/bugs/useBugs";

const ProjectDetails = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
const [showAddMemberModal, setShowAddMemberModal] = useState(false);
const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
const [selectedMember, setSelectedMember] = useState<{
  id: string;
  name: string;
} | null>(null);
  const { data, isLoading, isError } = useGetProjectById(
    typeof projectId === "string" ? projectId : undefined
  );
  const { data: activityData } = useGetProjectActivities(
  typeof projectId === "string" ? projectId : undefined
);
const { data: metricsData } = useGetProjectMetrics(
  typeof projectId === "string" ? projectId : undefined
);

const { data: bugsData} = useGetBugs(
  typeof projectId === "string" ? projectId : undefined
);

  const { mutateAsync: handleRemoveMember, isPending: isRemovingMember } =
  useRemoveProjectMember();

const onConfirmRemoveMember = async () => {
  if (typeof projectId !== "string" || !selectedMember) return;

  try {
    await handleRemoveMember({
      projectId,
      memberId: selectedMember.id,
    });

    setShowRemoveMemberModal(false);
    setSelectedMember(null);
  } catch (error) {
    console.error("Remove member failed:", error);
  }
};

const closeRemoveMemberModal = () => {
  setShowRemoveMemberModal(false);
  setSelectedMember(null);
};

const onRemoveMember = (memberId: string, memberName: string) => {
  setSelectedMember({
    id: memberId,
    name: memberName,
  });
  setShowRemoveMemberModal(true);
};



  const apiProject = data?.data;

  const project = useMemo(() => {
    if (!apiProject) return null;


    return {
      ...apiProject,
      title: apiProject.name,
      dueDate: apiProject.projectDueDate,
      startDate: apiProject.projectStartDate,
      teamSize:
        apiProject.memberCount ??
        apiProject.members?.length,
      teamMembers:
        apiProject.members?.map((member: any) => ({
          id: member.userId,
          name: member.fullName,
          email: member.email,
          role: member.role,
          joinedAt: member.joinedAt,
          addedBy: member.addedBy,
          avatar: member.fullName?.charAt(0)?.toUpperCase() || "?",
        })) ?? [],
      tasks: bugsData ?? [],
      activity: apiProject.activity ?? [],
      files: apiProject.files ?? [],
      progress: metricsData?.completionPercentage ?? 0,
      completedTasks: metricsData?.closed ?? 0,
    totalTasks: metricsData?.totalBugs ?? 0,
    };
  }, [apiProject, bugsData]);

const mappedActivities = useMemo(() => {
  const rawActivities = activityData?.activities ?? [];

  return rawActivities.map((item) => {
    const { action, target } = mapActivityDescription(item);

    return {
      id: item.id,
      user: item.actorName || "Unknown User",
      action,
      target,
      time: formatTimestamp(item.createdAt),
    };
  });
}, [activityData]);

  if (!router.isReady || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-white/10" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-center text-slate-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
        Project not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 sm:text-base dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {project.title}
                </h1>
                <button className="text-slate-400 transition-colors hover:text-yellow-400 dark:text-gray-400">
                  <Star size={22} className="sm:h-6 sm:w-6" />
                </button>
              </div>
              <p className="max-w-2xl text-sm text-slate-500 sm:text-base dark:text-gray-400">
                {project.description}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
  title="Edit Project"
  onClick={() => setShowEditProjectModal(true)}
  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-slate-900 hover:bg-slate-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
/>

              <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              icon: <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />,
              label: "Status",
              value: project.status,
            },
            {
              icon: <TrendingUp size={14} className="text-slate-400 dark:text-gray-400" />,
              label: "Progress",
              value: `${project.progress}%`,
            },
            {
              icon: <Calendar size={14} className="text-slate-400 dark:text-gray-400" />,
              label: "Due Date",
              value: formatTimestamp(project.dueDate),
            },
            {
              icon: <CheckCircle size={14} className="text-slate-400 dark:text-gray-400" />,
              label: "Bugs",
              value: `${project.completedTasks}/${project.totalTasks}`,
            },
            {
              icon: <Users size={14} className="text-slate-400 dark:text-gray-400" />,
              label: "Team",
              value: `${project.teamMembers.length} Members`,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                {item.icon}
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  {item.label}
                </span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white break-words">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2 border-b border-slate-200 dark:border-gray-700">
            {["overview", "bugs", "team", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-medium capitalize transition-all sm:px-6 sm:text-base ${
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
           {activeTab === "overview" && <OverviewTab progress={project.progress} />}

              {activeTab === "bugs" && (
          <BugsTab
          />
        )}


      {activeTab === "team" && (
        <TeamTab
          teamMembers={project.teamMembers}
          projectId={typeof projectId === "string" ? projectId : undefined}
         onRemoveMember={onRemoveMember}
          isRemoving={isRemovingMember}
        />
      )}

{activeTab === "activity" && <ActivityTab activity={mappedActivities} />}
          
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                Team
              </h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.teamMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-lg dark:border-gray-800"
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
              <Button
              title="Add Member"
              onClick={() => setShowAddMemberModal(true)}
              className="w-full rounded-lg bg-slate-900 py-2 text-sm text-white hover:bg-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            />
            </div>

            <div className="space-y-3">
              {project.files?.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50"
                >
                  <Paperclip className="shrink-0 text-slate-400 dark:text-gray-400" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">
                      {file.size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NewProjectModal
  isOpen={showEditProjectModal}
  onClose={() => setShowEditProjectModal(false)}
  mode="edit"
  projectId={typeof projectId === "string" ? projectId : undefined}
  initialData={apiProject}
/>

<AddMemberModal
  isOpen={showAddMemberModal}
  onClose={() => setShowAddMemberModal(false)}
  projectId={typeof projectId === "string" ? projectId : undefined}
  projectName={project.title}
/>

<ConfirmActionModal
  isOpen={showRemoveMemberModal}
  title="Remove Member"
  description={
    <>
      Are you sure you want to remove{" "}
      <span className="font-semibold text-slate-900 dark:text-white">
        {selectedMember?.name || "this member"}
      </span>{" "}
      from{" "}
      <span className="font-semibold text-slate-900 dark:text-white">
        {project.title}
      </span>
      ?
    </>
  }
  confirmText="Remove Member"
  isLoading={isRemovingMember}
  onClose={closeRemoveMemberModal}
  onConfirm={onConfirmRemoveMember}
/>
    </div>
  );
};

export default ProjectDetails;