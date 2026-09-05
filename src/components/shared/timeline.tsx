import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TimelineStep {
  label: string;
  date?: string;
  state: "done" | "current" | "upcoming";
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol>
      {steps.map((step, index) => (
        <li key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                step.state === "done" && "border-status-success bg-status-success text-white",
                step.state === "current" && "border-primary bg-primary text-white",
                step.state === "upcoming" && "border-border bg-muted text-muted-foreground"
              )}
            >
              {step.state === "done" ? <Check className="size-3.5" /> : index + 1}
            </span>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  "my-0.5 w-px flex-1",
                  step.state === "done" ? "bg-status-success" : "bg-border"
                )}
              />
            )}
          </div>
          <div className="pb-5">
            <p
              className={cn(
                "text-sm font-medium",
                step.state === "upcoming" ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {step.label}
            </p>
            {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
