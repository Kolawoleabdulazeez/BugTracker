import React from "react";
import { Trash2 } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar: string;
};

type TeamTabProps = {
  teamMembers: TeamMember[];
  projectId?: string;
  onRemoveMember?: (memberId: string, memberName: string) => void;
  isRemoving?: boolean;
};

const TeamTab: React.FC<TeamTabProps> = ({
  teamMembers,
  onRemoveMember,
  isRemoving,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Team Members
      </h3>

      <div className="space-y-3">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900/50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                  {member.avatar}
                </div>

                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-900 dark:text-white">
                    {member.name}
                  </p>
                  <p className="break-all text-sm text-slate-500 dark:text-gray-400">
                    {member.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  {member.role}
                </span>

                <button
                  type="button"
                  onClick={() => onRemoveMember?.(member.id, member.name)}
                  disabled={isRemoving}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-gray-400">
            No team members found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamTab;