import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const TONE_CLASSES: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-status-success-bg text-status-success",
  warning: "bg-status-warning-bg text-status-warning",
  danger: "bg-status-danger-bg text-status-danger",
  info: "bg-status-info-bg text-status-info",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              TONE_CLASSES[tone]
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
