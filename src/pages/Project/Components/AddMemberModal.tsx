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
    defaultValues: {
      email: "",
      role: "",
    },
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
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1d2e]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/15">
              <UserPlus size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add Member
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                {projectName
                  ? `Invite a new member to ${projectName}`
                  : "Invite a new member to this project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
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
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-[#0f1219] dark:text-white dark:placeholder-gray-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Role
            </label>
            <select
              {...register("role", {
                required: "Role is required",
              })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-[#0f1219] dark:text-white"
            >
              <option value="">Select role</option>
              <option value="owner">Owner</option>
              <option value="viewer">Viewer</option>
              <option value="tester">Tester</option>
              <option value="developer">Developer</option>

            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              title="Cancel"
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            />

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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