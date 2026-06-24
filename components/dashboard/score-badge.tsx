import { getScoreTier, scoreTierClass } from "@/lib/dashboard/score";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, className, size = "md" }: ScoreBadgeProps) {
  const tier = getScoreTier(score);
  return (
    <span
      className={cn(
        "dash-score-badge",
        scoreTierClass(tier),
        size === "sm" && "!min-w-[1.75rem] !h-[1.75rem] !text-xs",
        size === "lg" && "!min-w-[2.75rem] !h-[2.75rem] !text-base",
        className
      )}
      title={`Intent score: ${score}/10`}
    >
      {score}
    </span>
  );
}
