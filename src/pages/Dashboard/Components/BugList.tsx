import StatusTag from "@/Component/shared/StatusTag";

interface Bug {
  id: string;
  title: string;
  status: "open" | "inProgress" | "closed" | "wontFix" | "duplicate";
}

export default function BugList({ bugs }: { bugs: Bug[] }) {
  return (
    <div className="rounded-md bg-surface-1 border border-hairline flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3 border-b border-hairline">
        <p className="text-ink font-bold text-sm">Open bugs</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {bugs.length === 0 ? (
          <p className="px-5 py-8 text-center text-ink-muted text-sm">No bugs yet.</p>
        ) : (
          bugs.map((bug) => (
            <div
              key={bug.id}
              className="flex items-center gap-4 px-5 py-2.5 border-b border-hairline last:border-0"
            >
              <span className=" text-xs text-ink-muted w-16 flex-shrink-0">
                {bug.id}
              </span>
              <span className="text-sm text-ink truncate flex-1 min-w-0">
                {bug.title}
              </span>
              <StatusTag status={bug.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}