import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/25 bg-primary-muted-bg px-2.5 py-0.5 text-xs font-semibold capitalize text-primary",
        className
      )}
    >
      {PLAN_LABELS[plan]}
    </span>
  );
}
