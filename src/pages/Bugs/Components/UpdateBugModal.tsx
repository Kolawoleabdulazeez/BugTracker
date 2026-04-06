import React, { useEffect } from "react";
import { X, Bug, ArrowRight, Layers, Cpu, Tag, Plus } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "@/Component/Input/Input";
import Dropdown from "@/Component/Dropdown/Dropdown";
import {  BugType } from "@/services/bugs/bugs.api";
import { useUpdateBug } from "@/services/bugs/useBugs";

type UpdateBugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bug: BugType | null;
  projectId: string;
};

type BugFormValues = {
  title: string;
  description: string;
  priority: string;
  severity: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  version: string;
  status: string;
  newTag: string;
  tags: { value: string }[];
};

const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    color:
      "border-slate-300 bg-slate-50 text-slate-600 dark:border-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
    active:
      "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-300",
  },
  {
    value: "normal",
    label: "Normal",
    color:
      "border-slate-300 bg-slate-50 text-slate-600 dark:border-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
    active:
      "border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-300",
  },
  {
    value: "urgent",
    label: "Urgent",
    color:
      "border-slate-300 bg-slate-50 text-slate-600 dark:border-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
    active:
      "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500 dark:bg-orange-500/20 dark:text-orange-300",
  },
];

const SEVERITY_LIST = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "critical", label: "Critical" },
];

const STATUS_LIST = [
  { id: "open", label: "Open" },
  { id: "inprogress", label: "In Progress" },
  { id: "closed", label: "Closed" },
  { id: "wontfix", label: "Won't Fix" },
  { id: "duplicate", label: "Duplicate" },
];

const labelClass = "dark:text-white text-darkPrimary mb-2";

const UpdateBugModal: React.FC<UpdateBugModalProps> = ({
  isOpen,
  onClose,
  bug,
  projectId,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    register,
    formState: { errors },
  } = useForm<BugFormValues>();

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace,
  } = useFieldArray({ control, name: "tags" });

  const { mutateAsync: updateBug, isPending } = useUpdateBug(projectId);

  const priority = watch("priority");
  const severity = watch("severity");
  const status = watch("status");

  useEffect(() => {
    if (!isOpen || !bug) return;
    reset({
      title: bug.title ?? "",
      description: bug.description ?? "",
      priority: bug.priority?.toLowerCase() ?? "low",
      severity: bug.severity?.toLowerCase() ?? "medium",
      stepsToReproduce: bug.stepsToReproduce ?? "",
      expectedBehavior: bug.expectedBehavior ?? "",
      actualBehavior: bug.actualBehavior ?? "",
      environment: bug.environment ?? "",
      version: bug.version ?? "",
      status: bug.status?.toLowerCase() ?? "open",
      newTag: "",
      tags: [],
    });
    replace(
      (bug.tags ?? []).map((t) => ({
        value: typeof t === "string" ? t : t.name,
      }))
    );
  }, [isOpen, bug, reset, replace]);

  useEffect(() => {
    register("priority");
    register("severity");
    register("status");
  }, [register]);

  const handleAddTag = () => {
    const tag = getValues("newTag")?.trim();
    if (!tag) return;
    appendTag({ value: tag });
    setValue("newTag", "");
  };

  const onSubmit = async (data: BugFormValues) => {
    if (!bug) return;
    try {
      await updateBug({
        bugId: bug.id,
        payload: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          severity: data.severity,
          stepsToReproduce: data.stepsToReproduce,
          expectedBehavior: data.expectedBehavior,
          actualBehavior: data.actualBehavior,
          environment: data.environment,
          version: data.version,
          status: data.status,
          tags: data.tags.map((t) => t.value),
        },
      });
      onClose();
    } catch {
      // handled in hook
    }
  };

  if (!isOpen || !bug) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
      {/*
        ─── Modal shell ──────────────────────────────────────────────────────────
        Key fix: `flex flex-col` + `max-h-[92dvh]` on the shell.
        The header and footer are flex-shrink-0 (they never collapse).
        Only the form body gets flex-1 + overflow-y-auto, so only IT scrolls.
      */}
      <div className="w-full sm:max-w-2xl flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#13151f] max-h-[70dvh] sm:max-h-[88vh]">

        {/* ── Header ── flex-shrink-0 keeps it always visible */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
              <Bug size={18} className="text-yellow-500 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Update Bug
              </h2>
              <p className="font-mono text-xs text-slate-400 dark:text-gray-500">
                {bug.bugLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable form body ── flex-1 fills remaining space, scrolls internally */}
        <form
          id="update-bug-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-5 px-6 py-5"
        >
          {/* Title */}
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <Input
                label="Bug Title"
                required
                placeholder="e.g. Login button unresponsive on mobile"
                {...field}
                errortxt={errors.title?.message}
                parentClassName="w-full"
                labelClassName={labelClass}
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <Input
                label="Description"
                required
                textarea
                placeholder="Briefly describe what the bug is and its impact..."
                {...field}
                errortxt={errors.description?.message}
                parentClassName="w-full"
                labelClassName={labelClass}
              />
            )}
          />

          {/* Priority + Severity + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="dark:text-white text-darkPrimary text-sm font-bold mb-1.5">
                Priority <span className="text-errorRed mx-1">*</span>
              </p>
              <div className="flex flex-col gap-1.5">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("priority", opt.value)}
                    className={`rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-all ${
                      priority === opt.value ? opt.active : opt.color
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Dropdown
              label="Severity"
              isRequired
              list={SEVERITY_LIST}
              labelParam="label"
              className="dark:text-white"
              valueParam="id"
              placeholder="Select severity"
              selectedValue={severity}
              onValChange={(item) => setValue("severity", item.id)}
              parentClassName="border border-lightgray rounded-[2px] px-2 h-[40px] flex items-center"
              errortxt={errors.severity?.message}
            />

            <Dropdown
              label="Status"
              list={STATUS_LIST}
              labelParam="label"
              valueParam="id"
              className="dark:text-white"
              placeholder="Select status"
              selectedValue={status}
              onValChange={(item) => setValue("status", item.id)}
              parentClassName="border border-lightgray rounded-[2px] px-2 h-[40px] flex items-center"
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <p className="dark:text-white text-darkPrimary text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <Layers size={14} />
              Steps to Reproduce
            </p>
            <Controller
              name="stepsToReproduce"
              control={control}
              render={({ field }) => (
                <Input
                  textarea
                  placeholder={"1. Go to...\n2. Click on...\n3. Observe..."}
                  {...field}
                  inputClassName="font-mono text-xs"
                  parentClassName="w-full"
                  labelClassName={labelClass}
                />
              )}
            />
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="expectedBehavior"
              control={control}
              render={({ field }) => (
                <Input
                  label="Expected Behavior"
                  textarea
                  placeholder="What should happen..."
                  {...field}
                  parentClassName="w-full"
                  labelClassName={labelClass}
                />
              )}
            />
            <Controller
              name="actualBehavior"
              control={control}
              render={({ field }) => (
                <Input
                  label="Actual Behavior"
                  textarea
                  placeholder="What actually happens..."
                  {...field}
                  parentClassName="w-full"
                  labelClassName={labelClass}
                />
              )}
            />
          </div>

          {/* Environment + Version */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <Input
                  label="Environment"
                  placeholder="e.g. Chrome 120, macOS Sonoma"
                  lefticon={<Cpu size={16} className="text-slate-400" />}
                  {...field}
                  parentClassName="w-full"
                  labelClassName={labelClass}
                />
              )}
            />
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <Input
                  label="App Version"
                  placeholder="e.g. v2.4.1"
                  {...field}
                  parentClassName="w-full"
                  labelClassName={labelClass}
                />
              )}
            />
          </div>

          {/* Tags */}
          <div>
            <p className="dark:text-white text-darkPrimary text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <Tag size={14} /> Tags
            </p>
            <div className="flex gap-2 items-start">
              <Input
                placeholder="Type a tag and press Enter or +"
                {...register("newTag")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                parentClassName="flex-1"
                labelClassName={labelClass}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-blue-500"
              >
                <Plus size={18} />
              </button>
            </div>
            {tagFields.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {tagFields.map((field, index) => (
                  <span
                    key={field.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                  >
                    {field.value}
                    <button type="button" onClick={() => removeTag(index)}>
                      <X size={11} className="text-blue-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* ── Footer ── flex-shrink-0 keeps it always pinned at the bottom */}
        <div className="flex-shrink-0 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#13151f] px-6 py-4">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto sm:px-6 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="update-bug-form"
              disabled={isPending}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-white shadow-lg shadow-yellow-500/20 transition-all hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Bug...
                </>
              ) : (
                <>
                  <Bug size={16} />
                  Update Bug
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdateBugModal;