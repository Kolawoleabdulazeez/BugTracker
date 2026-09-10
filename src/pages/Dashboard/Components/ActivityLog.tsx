import { ActivityEvent } from "@/services/user/user.api";
import ActivityLogRow from "./ActivityLogRow";

export default function ActivityLog({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="rounded-md bg-surface-1 border border-hairline flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3 border-b border-hairline">
        <p className="text-ink font-bold text-sm">Activity</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <p className="px-5 py-8 text-center text-ink-muted text-sm">No activity yet.</p>
        ) : (
          events.map((e) => <ActivityLogRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  );
}