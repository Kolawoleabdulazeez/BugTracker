import React from "react";
import { X, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/Component/Button/Button";
import { useInviteProjectMember } from "@/services/project/useProject";

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
};

type AddMemberFormValues = {
  email: string;
  role: string;
};

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    defaultValues: { email: "", role: "" },
  });

  const { mutateAsync, isPending } = useInviteProjectMember(() => {
    reset();
    onClose();
  });

  const submitForm = async (data: AddMemberFormValues) => {
    if (!projectId) return;

    try {
      await mutateAsync({
        projectId,
        payload: {
          email: data.email,
          role: data.role.toLowerCase(),
        },
      });
    } catch (error) {
      console.error("Invite member failed:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-secondary-900/90">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15">
              <UserPlus size={18} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add Member
              </h2>
              <p className="text-sm text-slate-500 dark:text-secondary-400">
                {projectName
                  ? `Invite a new member to ${projectName}`
                  : "Invite a new member to this project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-secondary-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter member email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-secondary-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-danger-500 dark:text-danger-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Role
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="">Select role</option>
              <option value="owner">Owner</option>
              <option value="viewer">Viewer</option>
              <option value="tester">Tester</option>
              <option value="developer">Developer</option>
            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-danger-500 dark:text-danger-400">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              title="Cancel"
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-secondary-800 dark:text-gray-200 dark:hover:bg-secondary-700"
            />

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Inviting..." : "Invite Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;