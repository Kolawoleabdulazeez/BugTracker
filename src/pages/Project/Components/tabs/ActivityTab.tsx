import React from "react";

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
};

type ActivityTabProps = {
  activity: ActivityItem[];
};

const ActivityTab: React.FC<ActivityTabProps> = ({ activity }) => {
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activity?.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20">
              <span className="text-lg">👤</span>
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm text-slate-900 dark:text-white">
                <span className="font-semibold">{item.user}</span>{" "}
                <span className="text-slate-500 dark:text-secondary-400">
                  {item.action}
                </span>{" "}
                <span className="text-orange-600 dark:text-orange-400">
                  {item.target}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-secondary-500">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTab;