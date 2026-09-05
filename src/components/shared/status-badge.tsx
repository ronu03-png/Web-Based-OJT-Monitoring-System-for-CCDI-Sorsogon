import { Badge } from "@/components/ui/badge";
import { getStatusMeta } from "@/lib/status-meta";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = getStatusMeta(status);
  return (
    <Badge variant={meta.variant} className={cn("capitalize", className)}>
      {meta.label}
    </Badge>
  );
}
