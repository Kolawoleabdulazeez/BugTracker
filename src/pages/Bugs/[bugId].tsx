/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/Component/Button/Button";
import PageLayout from "@/Component/Layout/PageLayout";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
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
import { formatLabel } from "../../utils";
import EditBugModal from "./Components/EditBugModal";
import Dropdown from "@/Component/Dropdown/Dropdown";
import { useGetProjectMembers } from "../../services/project/useProject";
import { InlineDropdown } from "@/Component/Dropdown/InlineDrop";
import CommentsSection from "./Components/CommentsSection";

const Field = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
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
  const [showDeveloperDropdown, setShowDeveloperDropdown] = useState(false);
  const [showTesterDropdown, setShowTesterDropdown] = useState(false);
  const testerAnchorRef = useRef<HTMLDivElement>(null);
  const developerAnchorRef = useRef<HTMLDivElement>(null);

  const safeBugId = typeof bugId === "string" ? bugId : undefined;
  const safeProjectId = typeof projectId === "string" ? projectId : undefined;

  const { data: bug, isLoading } = useGetSingleBug(safeBugId, safeProjectId);
  const { data: membersData, isLoading: membersLoading } =
    useGetProjectMembers(safeProjectId);
  const { mutateAsync: assignDeveloper, isPending: isAssigningDeveloper } =
    useAssignDeveloper(safeProjectId);
  const { mutateAsync: reassignTester, isPending: isReassigningTester } =
    useReassignTester(safeProjectId);

  const developerOptions =
    membersData
      ?.filter((m: any) => m.role === "Developer")
      .map((member: any) => ({
        id: member.userId,
        label: member.fullName,
        name: member.fullName,
        email: member.email,
      })) ?? [];

  const testerOptions =
    membersData
      ?.filter((m: any) => m.role === "Tester")
      .map((member: any) => ({
        id: member.userId,
        label: member.fullName,
        name: member.fullName,
        email: member.email,
      })) ?? [];

  const handleAssignDeveloper = async (item: any) => {
    if (!safeBugId) return;
    await assignDeveloper({ bugId: safeBugId, developerId: item.id });
    setShowDeveloperDropdown(false);
  };

  const handleReassignTester = async (item: any) => {
    if (!safeBugId) return;
    await reassignTester({ bugId: safeBugId, newTesterId: item.id });
    setShowTesterDropdown(false);
  };

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
    <PageLayout
      title="Bug Details"
      showSearch={false}
      contentClassName="bg-slate-100 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
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
              className="mb-3 bg-transparent text-slate-700 dark:text-white"
            />
            <p className="text-sm dark:text-slate-400 text-slate-500">
              {bug.bugLabel}
            </p>
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">
              {bug.title}
            </h1>
          </div>
          <Button
            title="Edit Bug"
            icon={<Pencil size={14} />}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white text-sm flex items-center gap-2"
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

            {/* Description Card */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold dark:text-white text-slate-900">
                  Description
                </h2>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <MoreHorizontal size={16} className="text-slate-400" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <Pencil size={14} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm dark:text-slate-300 text-slate-700 mb-5">
                {bug.description || "No description provided."}
              </p>

              {/* Steps to Reproduce */}
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

              {/* Expected vs Actual */}
              {(bug.expectedBehavior || bug.actualBehavior) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {bug.expectedBehavior && (
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Expected Behavior
                      </p>
                      <p className="text-sm dark:text-white text-slate-700">
                        {bug.expectedBehavior}
                      </p>
                    </div>
                  )}
                  {bug.actualBehavior && (
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actual Behavior
                      </p>
                      <p className="text-sm dark:text-white text-slate-700">
                        {bug.actualBehavior}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Environment / Version / Tags */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {bug.environment && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1">
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
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1">
                      <Tag size={12} /> Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bug.tags.map((tag: any, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {typeof tag === "string" ? tag : tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Comments Section (replaces history) ───────────────────── */}
            {safeBugId && safeProjectId && (
              <CommentsSection bugId={bug.id} comments={bug.comments} projectId={safeProjectId} />
            )}
          </div>

          {/* RIGHT — Assignment + Attachments */}
          <div className="space-y-4">

            {/* Assignment Card */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold dark:text-white text-slate-900">
                  Assignment
                </p>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                  <MoreHorizontal size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Reporter */}
              {bug.reportedBy && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {bug.reportedBy.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold dark:text-white text-slate-800">
                        {bug.reportedBy.fullName}
                      </p>
                      <p className="text-xs text-slate-400">Reporter</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(bug.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {/* Assigned Tester */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {bug.assignedTester?.fullName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold dark:text-white text-slate-800">
                        {bug.assignedTester?.fullName ?? "No tester assigned"}
                      </p>
                      <p className="text-xs text-slate-400">Tester</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowTesterDropdown((prev) => !prev);
                      setShowDeveloperDropdown(false);
                    }}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 dark:border-white/20 dark:text-white text-slate-600 hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    {isReassigningTester ? "Saving..." : "Edit"}
                  </button>
                </div>
                <div ref={testerAnchorRef}>
                  <InlineDropdown
                    anchorRef={testerAnchorRef}
                    isOpen={showTesterDropdown}
                  >
                    <Dropdown
                      hasSearch
                      list={testerOptions}
                      labelParam="label"
                      valueParam="id"
                      placeholder={
                        membersLoading ? "Loading testers..." : "Select tester"
                      }
                      onValChange={handleReassignTester}
                      parentClassName="border rounded-xl border-lightgray px-2 h-[40px] flex items-center w-full bg-white dark:bg-gray-800"
                      dropdownClassName="!h-60"
                    />
                  </InlineDropdown>
                </div>
              </div>

              {/* Assigned Developer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {bug.assignedDeveloper?.fullName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold dark:text-white text-slate-800">
                        {bug.assignedDeveloper?.fullName ?? "No developer assigned"}
                      </p>
                      <p className="text-xs text-slate-400">Developer</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeveloperDropdown((prev) => !prev);
                      setShowTesterDropdown(false);
                    }}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 dark:border-white/20 dark:text-white text-slate-600 hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    {isAssigningDeveloper ? "Saving..." : "Edit"}
                  </button>
                </div>
                <div ref={developerAnchorRef}>
                  <InlineDropdown
                    anchorRef={developerAnchorRef}
                    isOpen={showDeveloperDropdown}
                  >
                    <Dropdown
                      hasSearch
                      list={developerOptions}
                      labelParam="label"
                      valueParam="id"
                      placeholder={
                        membersLoading
                          ? "Loading developers..."
                          : "Select developer"
                      }
                      onValChange={handleAssignDeveloper}
                      parentClassName="border rounded-xl border-lightgray px-2 h-[40px] flex items-center w-full bg-white dark:bg-gray-800"
                      dropdownClassName="!h-60"
                    />
                  </InlineDropdown>
                </div>
              </div>

              {/* Developer Status */}
              {bug.developerStatus && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold dark:text-white text-slate-900">
                      Developer Status
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-white/10 px-4 py-2.5">
                    <span className="text-sm font-medium dark:text-white text-slate-800">
                      {formatLabel(bug.developerStatus)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments Card */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">+</span>
                  <p className="text-base font-semibold dark:text-white text-slate-900">
                    Attachments
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                  <MoreHorizontal size={16} className="text-slate-400" />
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
                        <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Paperclip size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white text-slate-800">
                            {attachment.name || attachment.fileName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {attachment.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No attachments</p>
              )}
            </div>

            {/* Status History (right sidebar — kept for audit trail) */}
            {bug.statusHistory?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronDown size={16} className="text-slate-400" />
                  <p className="text-base font-semibold dark:text-white text-slate-900">
                    Status History
                  </p>
                </div>
                <div className="space-y-4">
                  {bug.statusHistory.map((entry: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
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
                            <span className="dark:text-slate-400 text-slate-500">
                              {" "}by{" "}
                              <span className="font-semibold dark:text-white text-slate-800">
                                {entry.changedByName}
                              </span>
                            </span>
                          )}
                        </p>
                        <span className="text-xs text-slate-400 ml-3 flex-shrink-0">
                          {new Date(entry.changedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
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