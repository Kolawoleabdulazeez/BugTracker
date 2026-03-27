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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activity?.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
              <span className="text-lg">👤</span>
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm text-slate-900 dark:text-white">
                <span className="font-semibold">{item.user}</span>{" "}
                <span className="text-slate-500 dark:text-gray-400">
                  {item.action}
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {item.target}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
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