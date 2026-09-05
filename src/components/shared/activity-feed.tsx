import { formatRelativeTime } from "@/lib/format";
import { EmptyState } from "@/components/shared/empty-state";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        description="Activity will appear here as logs, requirements, and evaluations are updated."
      />
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 pb-4 last:pb-0">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">{item.description}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {formatRelativeTime(item.date)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
