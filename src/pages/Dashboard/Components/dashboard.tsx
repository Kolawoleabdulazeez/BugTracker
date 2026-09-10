"use client";

import { SummaryCards } from "@/services/user/user.api";
import { AnimatedNumber } from "@/utils/helpers";

export interface DashboardTProp {
  SummaryCards: SummaryCards;
}

export default function DashboardT({ SummaryCards }: DashboardTProp) {
  const fixedPct = SummaryCards.completionPercentage;
  const circumference = 2 * Math.PI * 38;

  const metrics = [
    {
      value: SummaryCards.totalBugs,
      label: "Total Bugs",
      sub: "All time",
      color: "text-info-500",
      bg: "bg-info-50/70 dark:bg-info-900/20",
      border: "border-info-200/60 dark:border-info-700/30",
      valueColor: "#3B6FE0",
    },
    {
      value: SummaryCards.closedBugs,
      label: "Closed",
      sub: "Resolved issues",
      color: "text-success-500",
      bg: "bg-success-50/70 dark:bg-success-900/20",
      border: "border-success-200/60 dark:border-success-700/30",
      valueColor: "#239A3C",
    },
    {
      value: SummaryCards.openBugs,
      label: "Open",
      sub: "Needs attention",
      color: "text-danger-500",
      bg: "bg-danger-50/70 dark:bg-danger-900/20",
      border: "border-danger-200/60 dark:border-danger-700/30",
      valueColor: "#C92438",
    },
    {
      value: SummaryCards.inProgressBugs,
      label: "In Progress",
      sub: "Being worked on",
      color: "text-orange-500",
      bg: "bg-orange-50/70 dark:bg-orange-900/20",
      border: "border-orange-200/60 dark:border-orange-700/30",
      valueColor: "#ED6214",
    },
  ];

  const total = SummaryCards.totalBugs || 1;

  const closedPercentage = (SummaryCards.closedBugs / total) * 100;
  const openPercentage = (SummaryCards.openBugs / total) * 100;
  const inProgressPercentage =
    (SummaryCards.inProgressBugs / total) * 100;

  const clampedFixedPct = Math.min(Math.max(fixedPct, 0), 100);

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.06]
        bg-white/75
        shadow-[0_6px_24px_rgba(17,23,42,0.08)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:shadow-[0_10px_32px_rgba(17,23,42,0.12)]
        dark:border-white/[0.08]
        dark:bg-secondary-800/45
        dark:shadow-[0_8px_30px_rgba(0,0,0,0.28)]
        dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.38)]
      "
    >
      {/* Subtle orange glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-48
          w-48
          rounded-full
          bg-orange-500/[0.04]
          blur-3xl
          dark:bg-orange-500/[0.08]
        "
      />

      <div className="relative z-10 flex flex-col items-stretch p-5 lg:flex-row lg:p-6">
        {/* Fix-rate ring */}
        <div
          className="
            mb-5
            flex
            shrink-0
            items-center
            gap-5
            border-black/[0.06]
            lg:mb-0
            lg:mr-8
            lg:border-r
            lg:pr-8
            dark:border-white/[0.08]
          "
        >
          <div
            className="relative shrink-0"
            style={{
              width: 90,
              height: 90,
            }}
          >
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              className="block"
            >
              {/* Ring background */}
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-grayBg1 dark:text-secondary-500"
              />

              {/* Progress */}
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="none"
                stroke="#239A3C"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference * (1 - clampedFixedPct / 100)
                }
                transform="rotate(-90 45 45)"
                className="transition-all duration-700"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[1.2rem] font-bold text-success-500">
                {fixedPct}%
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray2 dark:text-gray3">
              Tickets Fixed
            </p>

            <p className="mt-0.5 text-xs text-gray2 dark:text-gray3">
              Sprint
            </p>

            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-grayBg1 dark:bg-secondary-500">
              <div
                className="h-full rounded-full bg-success-500 transition-all duration-700"
                style={{
                  width: `${clampedFixedPct}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Metrics + distribution */}
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray2 dark:text-gray3">
            Project Insight
          </p>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map(
              ({
                value,
                label,
                sub,
                bg,
                border,
                valueColor,
              }) => (
                <div
                  key={label}
                  className={`
                    flex
                    min-w-0
                    flex-col
                    gap-0.5
                    rounded-xl
                    border
                    px-4
                    py-3
                    ${bg}
                    ${border}
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                  `}
                >
                  <span
                    className="text-[1.6rem] font-bold leading-none"
                    style={{
                      color: valueColor,
                    }}
                  >
                    <AnimatedNumber target={value} />
                  </span>

                  <span className="mt-1 text-sm font-medium text-gray2 dark:text-gray3">
                    {label}
                  </span>

                  <span className="text-xs text-gray2 dark:text-gray3">
                    {sub}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Bug distribution */}
          <div className="mt-4">
            <div className="flex h-1.5 overflow-hidden rounded-full bg-grayBg1 dark:bg-secondary-500">
              {closedPercentage > 0 && (
                <div
                  className="transition-all duration-700"
                  style={{
                    width: `${closedPercentage}%`,
                    background: "#239A3C",
                  }}
                  title="Closed"
                />
              )}

              {openPercentage > 0 && (
                <>
                  <div className="w-[2px] shrink-0 bg-transparent" />

                  <div
                    className="transition-all duration-700"
                    style={{
                      width: `${openPercentage}%`,
                      background: "#C92438",
                    }}
                    title="Open"
                  />
                </>
              )}

              {inProgressPercentage > 0 && (
                <>
                  <div className="w-[2px] shrink-0 bg-transparent" />

                  <div
                    className="transition-all duration-700"
                    style={{
                      width: `${inProgressPercentage}%`,
                      background: "#ED6214",
                    }}
                    title="In Progress"
                  />
                </>
              )}
            </div>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {[
                {
                  label: "Closed",
                  color: "#239A3C",
                },
                {
                  label: "Open",
                  color: "#C92438",
                },
                {
                  label: "In Progress",
                  color: "#ED6214",
                },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: color,
                    }}
                  />

                  <span className="text-xs text-gray2 dark:text-gray3">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}