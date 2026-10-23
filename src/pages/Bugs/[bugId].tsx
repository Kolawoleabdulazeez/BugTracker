/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/Component/Button/Button";
import PageLayout from "@/Component/Layout/PageLayout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  ArrowLeft,
  Tag,
  Cpu,
  Paperclip,
  MoreHorizontal,
  Pencil,
  ChevronDown,
} from "lucide-react";
import {
  useAssignDeveloper,
  useGetSingleBug,
  useReassignTester,
} from "../../services/bugs/useBugs";
import { PRIORITY_COLORS, SEVERITY_COLORS, STATUS_COLORS } from "../../utils/helpers";
import EditBugModal from "./Components/EditBugModal";
import { useGetProjectMembers } from "../../services/project/useProject";
import CommentsSection from "./Components/CommentsSection";
import { useCurrentUserId } from "@/utils/lib";
import DeveloperStatusPanel from "./Components/Developerstatuspanel";
import { AssigneeRow } from "../../Component/Bugs/AssigneeRow";

const Field = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-400">
        {label}
      </p>
      <p className="text-sm dark:text-white text-slate-800 whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
};

const BugDetailsPage = () => {
  const router = useRouter();
  const { bugId, projectId } = router.query;
  const [showEditModal, setShowEditModal] = useState(false);


  const safeBugId = typeof bugId === "string" ? bugId : undefined;
  const safeProjectId = typeof projectId === "string" ? projectId : undefined;

  const { data: bug, isLoading } = useGetSingleBug(safeBugId, safeProjectId);
  const { data: membersData, isLoading: membersLoading } =
    useGetProjectMembers(safeProjectId);
  const { mutateAsync: assignDeveloper, isPending: isAssigningDeveloper } =
    useAssignDeveloper(safeProjectId);
  const { mutateAsync: reassignTester, isPending: isReassigningTester } =
    useReassignTester(safeProjectId);

    const currentUserId = useCurrentUserId();

    

    const canEditDeveloperStatus =
  !!currentUserId &&
  !!bug?.assignedDeveloper?.userId &&
  String(bug.assignedDeveloper.userId).toLowerCase() === currentUserId.toLowerCase();





      const toOptions = (role: string) =>
  (membersData ?? [])
    .filter((m: any) => m.role === role)
    .map((m: any) => ({ id: m.userId, name: m.fullName, email: m.email }));

const developerOptions = toOptions("Developer");
const testerOptions = toOptions("Tester");




  if (isLoading) {
    return (
      <PageLayout title="Bug Details" showSearch={false}>
        <div className="p-6">Loading...</div>
      </PageLayout>
    );
  }

  if (!bug) {
    return (
      <PageLayout title="Bug Details" showSearch={false}>
        <div className="p-6">Bug not found.</div>
      </PageLayout>
    );
  }

  const priorityClass =
    PRIORITY_COLORS[bug.priority?.toLowerCase()] ?? PRIORITY_COLORS.low;
  const severityClass =
    SEVERITY_COLORS[bug.severity?.toLowerCase()] ?? SEVERITY_COLORS.medium;
  const statusClass =
    STATUS_COLORS[bug.status?.toLowerCase().replace(" ", "_")] ??
    STATUS_COLORS.open;

  return (
    <PageLayout title="Bug Details" showSearch={false}>
      <div className="space-y-6 p-4">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <Button
              title="Back"
              icon={<ArrowLeft size={18} className="text-slate-700 dark:text-white" />}
              onClick={() =>
                router.push({
                  pathname: "/Bugs",
                  query: safeProjectId ? { projectId: safeProjectId } : {},
                })
              }
              className="mb-3 bg-transparent text-slate-700 dark:text-white shadow-none"
            />
            <p className="text-sm dark:text-secondary-400 text-slate-500">
              {bug.bugLabel}
            </p>
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">
              {bug.title}
            </h1>
          </div>
          <Button
            title="Edit Bug"
            icon={<Pencil size={14} />}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-white text-sm flex items-center gap-2 hover:bg-orange-600"
            onClick={() => setShowEditModal(true)}
          />
        </div>

        {/* ── Status Badges ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClass}`}>
            {bug.severity}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass}`}>
            {bug.priority}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {bug.status}
          </span>
        </div>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* LEFT — Description + Comments */}
          <div className="xl:col-span-2 space-y-4">

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold dark:text-white text-slate-900">
                  Description
                </h2>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <MoreHorizontal size={16} className="text-slate-400 dark:text-secondary-500" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <Pencil size={14} className="text-slate-400 dark:text-secondary-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm dark:text-slate-300 text-slate-700 mb-5">
                {bug.title || "No description provided."}
              </p>

              {bug.stepsToReproduce && (
                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold dark:text-white text-slate-800">
                    Steps to Reproduce
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    {bug.stepsToReproduce
                      .split("\n")
                      .map((step: string, i: number) => (
                        <li key={i} className="text-sm dark:text-slate-300 text-slate-700">
                          {step}
                        </li>
                      ))}
                  </ol>
                </div>
              )}

              {(bug.expectedBehavior || bug.actualBehavior) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {bug.expectedBehavior && (
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500">
                        Expected Behavior
                      </p>
                      <p className="text-sm dark:text-white text-slate-700">
                        {bug.expectedBehavior}
                      </p>
                    </div>
                  )}
                  {bug.actualBehavior && (
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500">
                        Actual Behavior
                      </p>
                      <p className="text-sm dark:text-white text-slate-700">
                        {bug.actualBehavior}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {bug.environment && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                      <Cpu size={12} /> Environment
                    </p>
                    <p className="text-sm dark:text-white text-slate-800">
                      {bug.environment}
                    </p>
                  </div>
                )}
                {bug.version && <Field label="Version" value={bug.version} />}
                {bug.tags?.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 flex items-center gap-1">
                      <Tag size={12} /> Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bug.tags.map((tag: any, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300"
                        >
                          {typeof tag === "string" ? tag : tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {safeBugId && safeProjectId && (
              <CommentsSection bugId={bug.id} comments={bug.comments} projectId={safeProjectId} />
            )}
          </div>

          {/* RIGHT — Assignment + Attachments */}
          <div className="space-y-4">

            <div className="glass-card rounded-2xl p-5 space-y-5">
  <p className="m-0 text-base font-semibold text-slate-900 dark:text-white">Assignment</p>

  {bug.reportedBy && (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
          {bug.reportedBy.fullName?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-semibold text-slate-800 dark:text-white">
            {bug.reportedBy.fullName}
          </p>
          <p className="m-0 text-xs text-slate-400 dark:text-secondary-500">Reporter</p>
        </div>
      </div>
      <span className="flex-shrink-0 text-xs text-slate-400 dark:text-secondary-500">
        {new Date(bug.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
  )}

  <AssigneeRow
    role="Tester"
    person={bug.assignedTester}
    options={testerOptions}
    loading={membersLoading}
    saving={isReassigningTester}
    accent="bg-info-500"
    onSelect={(id) => reassignTester({ bugId: bug.id, newTesterId: id })}
  />

  <AssigneeRow
    role="Developer"
    person={bug.assignedDeveloper}
    options={developerOptions}
    loading={membersLoading}
    saving={isAssigningDeveloper}
    accent="bg-success-500"
    onSelect={(id) => assignDeveloper({ bugId: bug.id, developerId: id })}
  />

  <div className="border-t border-slate-200 pt-5 dark:border-white/10">
    <DeveloperStatusPanel
      bugId={bug.id}
      projectId={safeProjectId ?? ""}
      status={bug.developerStatus}
      canEdit={canEditDeveloperStatus}
    />
  </div>
</div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 dark:text-secondary-500">+</span>
                  <p className="text-base font-semibold dark:text-white text-slate-900">
                    Attachments
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                  <MoreHorizontal size={16} className="text-slate-400 dark:text-secondary-500" />
                </button>
              </div>

              {bug.attachments?.length > 0 ? (
                <div className="space-y-3">
                  {bug.attachments.map((attachment: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                          <Paperclip size={16} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white text-slate-800">
                            {attachment.name || attachment.fileName}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-secondary-500">
                            {attachment.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-secondary-500">No attachments</p>
              )}
            </div>

            {bug.statusHistory?.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronDown size={16} className="text-slate-400 dark:text-secondary-500" />
                  <p className="text-base font-semibold dark:text-white text-slate-900">
                    Status History
                  </p>
                </div>
                <div className="space-y-4">
                  {bug.statusHistory.map((entry: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <div className="flex-1 flex justify-between items-start">
                        <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                          {entry.comment ||
                            `Status changed from ${entry.fromStatus} to `}
                          {!entry.comment && (
                            <span className="font-semibold dark:text-white text-slate-900">
                              {entry.toStatus}
                            </span>
                          )}
                          {entry.changedByName && (
                            <span className="dark:text-secondary-400 text-slate-500">
                              {" "}by{" "}
                              <span className="font-semibold dark:text-white text-slate-800">
                                {entry.changedByName}
                              </span>
                            </span>
                          )}
                        </p>
                        <span className="text-xs text-slate-400 dark:text-secondary-500 ml-3 flex-shrink-0">
                          {new Date(entry.changedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditBugModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        projectId={safeProjectId ?? ""}
        bug={bug}
      />
    </PageLayout>
  );
};

export default BugDetailsPage;