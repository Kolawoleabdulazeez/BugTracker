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

const TeamTab: React.FC<TeamTabProps> = ({ teamMembers, onRemoveMember, isRemoving }) => {
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Team Members
      </h3>

      <div className="space-y-3">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white">
                  {member.avatar}
                </div>

                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-900 dark:text-white">
                    {member.name}
                  </p>
                  <p className="break-all text-sm text-slate-500 dark:text-secondary-400">
                    {member.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-secondary-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                  {member.role}
                </span>

                <button
                  type="button"
                  onClick={() => onRemoveMember?.(member.id, member.name)}
                  disabled={isRemoving}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-danger-600 transition hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-danger-400 dark:hover:bg-danger-500/10"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-secondary-400">
            No team members found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamTab;