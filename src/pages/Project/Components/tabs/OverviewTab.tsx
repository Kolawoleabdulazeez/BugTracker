import React from "react";

type OverviewTabProps = {
  progress: number;
};

const OverviewTab: React.FC<OverviewTabProps> = ({ progress }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Progress Overview
      </h3>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between gap-4">
            <span className="text-sm text-slate-500 dark:text-gray-400">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-gray-700">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;