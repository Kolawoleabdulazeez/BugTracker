/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  X,
  Info,
  Calendar,
  Rocket,
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@/Component/Button/Button";
import { useCreateProject, useUpdateProject } from "@/services/project/useProject";

type NewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  projectId?: string;
  initialData?: any;
};

interface TeamMember {
  email: string;
  role: string;
}

interface ProjectFormValues {
  name: string;
  description: string;
  projectStartDate: string;
  projectDueDate: string;
  projectPriority: "low" | "medium" | "high";
  members: TeamMember[];
  tags: string[];
  newMemberEmail: string;
  newMemberRole: string;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  mode = "create",
  projectId,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      projectStartDate: "",
      projectDueDate: "",
      projectPriority: "medium",
      members: [],
      tags: [],
      newMemberEmail: "",
      newMemberRole: "",
    },
  });

  const { mutateAsync: createMutateAsync, isPending: isCreating } = useCreateProject();
  const { mutateAsync: updateMutateAsync, isPending: isUpdating } = useUpdateProject();
  const isPending = isCreating || isUpdating;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "members",
  });

  const priority = watch("projectPriority");

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData) {
      const mappedMembers =
        initialData.members?.map((member: any) => ({
          email: member.email || "",
          role: member.role || "",
        })) ?? [];

      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        projectStartDate: initialData.projectStartDate
          ? initialData.projectStartDate.split("T")[0]
          : "",
        projectDueDate: initialData.projectDueDate
          ? initialData.projectDueDate.split("T")[0]
          : "",
        projectPriority: initialData.priority?.toLowerCase() || "medium",
        members: mappedMembers,
        tags: initialData.tags || [],
        newMemberEmail: "",
        newMemberRole: "",
      });

      replace(mappedMembers);
    } else {
      reset({
        name: "",
        description: "",
        projectStartDate: "",
        projectDueDate: "",
        projectPriority: "medium",
        members: [],
        tags: [],
        newMemberEmail: "",
        newMemberRole: "",
      });

      replace([]);
    }
  }, [isOpen, mode, initialData, reset, replace]);

  const handleAddMember = () => {
    const memberName = getValues("newMemberEmail")?.trim();
    const memberRole = getValues("newMemberRole")?.trim();

    if (!memberName || !memberRole) return;

    append({ email: memberName, role: memberRole });
    setValue("newMemberEmail", "");
    setValue("newMemberRole", "");
  };

  const submitForm = async (data: ProjectFormValues) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        tags: [],
        projectStartDate: data.projectStartDate,
        projectDueDate: data.projectDueDate,
        projectPriority: data.projectPriority,
        members: data.members,
      };

      if (mode === "edit" && projectId) {
        await updateMutateAsync({ projectId, payload });
      } else {
        await createMutateAsync(payload);
      }

      reset();
      onClose();
    } catch (error) {
      console.error(`${mode} project failed:`, error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl duration-300 dark:border-white/10 dark:bg-secondary-900/90">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Button
              title={<X size={24} />}
              onClick={handleClose}
              className="bg-transparent text-slate-500 transition-colors hover:text-slate-900 dark:text-secondary-400 dark:hover:text-white"
              type="button"
            />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === "edit" ? "Edit Project" : "New Project"}
            </h2>
          </div>

          <Button
            title={<Info size={20} />}
            type="button"
            className="bg-transparent text-info-500 transition-colors hover:text-info-600 dark:text-info-400 dark:hover:text-info-300"
          />
        </div>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto p-6"
        >
          <div>
            <h3 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
              {mode === "edit" ? "Update Project" : "Launch TestOrbit"}
            </h3>
            <p className="text-slate-500 dark:text-secondary-400">
              {mode === "edit"
                ? "Modify your project details and save changes."
                : "Initialize your next testing environment with customized parameters."}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apollo Mission QA"
              {...register("name", { required: "Project name is required" })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-secondary-500"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-danger-500 dark:text-danger-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Describe the scope and objectives..."
              rows={4}
              {...register("description", { required: "Description is required" })}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-secondary-500"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-danger-500 dark:text-danger-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("projectStartDate")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500" size={18} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("projectDueDate")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500" size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setValue("projectPriority", item as "low" | "medium" | "high")}
                  className={`rounded-lg border-2 px-4 py-2.5 font-medium capitalize transition-all ${
                    priority === item
                      ? item === "high"
                        ? "border-danger-500 bg-danger-50 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400"
                        : item === "medium"
                        ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                        : "border-success-500 bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-secondary-400 dark:hover:border-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                Team Members
              </label>
              <span className="text-xs text-slate-400 dark:text-secondary-500">
                {fields.length} added
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                placeholder="Enter member email"
                {...register("newMemberEmail")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-secondary-500"
              />

              <input
                type="text"
                placeholder="Enter member role"
                {...register("newMemberRole")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-secondary-500"
              />

              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-medium text-white transition-all hover:bg-orange-600"
              >
                <Plus size={18} />
                Add User
              </button>
            </div>

            {fields.length > 0 && (
              <div className="mt-4 space-y-3">
                {fields.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {member.email}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-secondary-400">
                        {member.role}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-lg p-2 text-danger-500 transition-colors hover:bg-danger-50 hover:text-danger-600 dark:text-danger-400 dark:hover:bg-danger-500/10 dark:hover:text-danger-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 dark:border-orange-500/30 dark:from-orange-500/10 dark:to-orange-600/10">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500">
              <Rocket className="text-white" size={24} />
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">
                Orbit Protocol
              </h4>
              <p className="text-sm text-slate-500 dark:text-secondary-400">
                Automated testing pipelines will be initialized upon creation.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? mode === "edit"
                ? "Updating Project..."
                : "Creating Project..."
              : mode === "edit"
              ? "Update Project"
              : "Create Project"}

            {!isPending && (
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;