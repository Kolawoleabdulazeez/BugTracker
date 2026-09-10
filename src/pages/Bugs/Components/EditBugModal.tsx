import React, { useEffect } from "react";
import { X, Bug, ArrowRight, Plus, Layers, Cpu, Tag } from "lucide-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useUpdateBug } from "@/services/bugs/useBugs";
import Input from "@/Component/Input/Input";
import Dropdown from "@/Component/Dropdown/Dropdown";
import { BugType } from "@/services/bugs/bugs.api";

type EditBugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  bug: BugType;
};

type BugFormValues = {
  title: string;
  description: string;
  priority: "low" | "normal" | "urgent";
  severity: "low" | "medium" | "high" | "critical";
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  version: string;
  newTag: string;
  tags: { value: string }[];
};

const PRIORITY_OPTIONS: {
  value: BugFormValues["priority"];
  label: string;
  color: string;
  active: string;
}[] = [
  {
    value: "low",
    label: "Low",
    color: "border-slate-300 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-secondary-400",
    active: "border-success-500 bg-success-50 text-success-700 dark:border-success-500 dark:bg-success-500/20 dark:text-success-300",
  },
  {
    value: "normal",
    label: "Normal",
    color: "border-slate-300 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-secondary-400",
    active: "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500 dark:bg-orange-500/20 dark:text-orange-300",
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "border-slate-300 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-secondary-400",
    active: "border-danger-500 bg-danger-50 text-danger-700 dark:border-danger-500 dark:bg-danger-500/20 dark:text-danger-300",
  },
];

const SEVERITY_LIST = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "critical", label: "Critical" },
];

const EditBugModal: React.FC<EditBugModalProps> = ({
  isOpen,
  onClose,
  projectId,
  bug,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm<BugFormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      severity: "medium",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      environment: "",
      version: "",
      newTag: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (isOpen && bug) {
      reset({
        title: bug.title ?? "",
        description: bug.description ?? "",
        priority: (bug.priority?.toLowerCase() as BugFormValues["priority"]) ?? "low",
        severity: (bug.severity?.toLowerCase() as BugFormValues["severity"]) ?? "medium",
        stepsToReproduce: bug.stepsToReproduce ?? "",
        expectedBehavior: bug.expectedBehavior ?? "",
        actualBehavior: bug.actualBehavior ?? "",
        environment: bug.environment ?? "",
        version: bug.version ?? "",
        newTag: "",
        tags: (bug.tags ?? []).map((t) =>
          typeof t === "string" ? { value: t } : { value: t.name ?? t.value ?? "" }
        ),
      });
    }
  }, [isOpen, bug, reset]);

  useEffect(() => {
    register("priority");
    register("severity");
  }, [register]);

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const { mutateAsync: updateBug, isPending } = useUpdateBug(projectId);

  const priority = watch("priority");
  const severity = watch("severity");

  const handleAddTag = () => {
    const tag = getValues("newTag")?.trim();
    if (!tag) return;
    appendTag({ value: tag });
    setValue("newTag", "");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data: BugFormValues) => {
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
          tags: data.tags.map((t) => t.value),
        },
      });
      onClose();
    } catch {
      // errors handled in hook via toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-secondary-900/95">

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
              <Bug size={18} className="text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Bug
              </h2>
              <p className="text-xs text-slate-500 dark:text-secondary-400">
                {bug.bugLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-secondary-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[calc(100vh-160px)] space-y-5 overflow-y-auto px-6 py-5"
        >
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
                inputClassName="text-white"
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <Input
                label="Description"
                required
                textarea
                inputClassName="text-white"
                placeholder="Briefly describe what the bug is and its impact..."
                {...field}
                errortxt={errors.description?.message}
                parentClassName="w-full"
              />
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-darkPrimary mb-3 !text-sm font-bold md:mb-1.5">
                Priority <span className="text-errorRed mx-1">*</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("priority", opt.value, { shouldValidate: true })}
                    className={`rounded-lg border-2 px-3 py-2.5 text-xs font-semibold transition-all ${
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
              valueParam="id"
              placeholder="Select severity"
              selectedValue={severity}
              onValChange={(item) =>
                setValue("severity", item.id as BugFormValues["severity"], { shouldValidate: true })
              }
              parentClassName="border rounded-xl !h-10 border-lightgray rounded-[2px] px-2 flex items-center"
              errortxt={errors.severity?.message}
            />
          </div>

          <div>
            <p className="text-darkPrimary !text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <Layers size={14} />
              Steps to Reproduce <span className="text-errorRed mx-1">*</span>
            </p>
            <Controller
              name="stepsToReproduce"
              control={control}
              rules={{ required: "Steps to reproduce are required" }}
              render={({ field }) => (
                <Input
                  textarea
                  placeholder={"1. Go to...\n2. Click on...\n3. Observe..."}
                  {...field}
                  errortxt={errors.stepsToReproduce?.message}
                  inputClassName=" text-xs text-white"
                  parentClassName="w-full"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="expectedBehavior"
              control={control}
              rules={{ required: "Expected behavior is required" }}
              render={({ field }) => (
                <Input
                  label="Expected Behavior"
                  required
                  textarea
                  inputClassName="text-white"
                  placeholder="What should happen..."
                  {...field}
                  errortxt={errors.expectedBehavior?.message}
                  parentClassName="w-full"
                />
              )}
            />
            <Controller
              name="actualBehavior"
              control={control}
              rules={{ required: "Actual behavior is required" }}
              render={({ field }) => (
                <Input
                  label="Actual Behavior"
                  required
                  textarea
                  inputClassName="text-white"
                  placeholder="What actually happens..."
                  {...field}
                  errortxt={errors.actualBehavior?.message}
                  parentClassName="w-full"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Environment"
              placeholder="e.g. Chrome 120, macOS Sonoma"
              lefticon={<Cpu size={16} className="text-slate-400" />}
              {...register("environment")}
              parentClassName="w-full"
              inputClassName="text-white"
            />
            <Input
              label="App Version"
              placeholder="e.g. v2.4.1"
              {...register("version")}
              parentClassName="w-full"
            />
          </div>

          <div>
            <p className="text-darkPrimary !text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <Tag size={14} />
              Tags
            </p>
            <div className="flex gap-2 items-start">
              <Input
                placeholder="Type a tag and press Enter or +"
                {...register("newTag")}
                onKeyDown={handleTagKeyDown}
                parentClassName="flex-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-secondary-400 dark:hover:border-orange-500 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
              >
                <Plus size={18} />
              </button>
            </div>

            {tagFields.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {tagFields.map((field, index) => (
                  <span
                    key={field.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300"
                  >
                    {field.value}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-orange-400 hover:text-danger-500 dark:hover:text-danger-400"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-white/5">
            <button
              type="submit"
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Bug size={16} />
                  Save Changes
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBugModal;