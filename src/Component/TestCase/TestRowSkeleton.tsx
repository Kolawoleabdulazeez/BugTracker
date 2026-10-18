export const TestRowSkeleton = () => (
  <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.04] animate-pulse">
    <div className="hidden sm:block h-3 w-6 mt-1 rounded bg-slate-200 dark:bg-white/[0.06]" />
    <div className="h-6 w-20 mt-0.5 rounded-md bg-slate-200 dark:bg-white/[0.06]" />
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <div className="h-2.5 w-12 rounded bg-slate-200 dark:bg-white/[0.06]" />
        <div className="h-4 w-10 rounded bg-slate-200 dark:bg-white/[0.06]" />
      </div>
      <div className="h-3.5 w-2/3 rounded bg-slate-200 dark:bg-white/[0.06]" />
      <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-white/[0.06]" />
    </div>
  </div>
);