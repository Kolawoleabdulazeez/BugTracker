import React from "react";

type OverviewTabProps = {
  progress: number;
};

const OverviewTab: React.FC<OverviewTabProps> = ({ progress }) => {
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6">
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
        Progress Overview
      </h3>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between gap-4">
            <span className="text-sm text-slate-500 dark:text-secondary-400">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;