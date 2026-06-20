import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  max?: number;
  className?: string;
}

export function ScoreBar({ score, max = 10, className }: ScoreBarProps) {
  const pct = Math.min(100, Math.round((score / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[2rem] text-right text-xs font-semibold text-primary">
        {score}/{max}
      </span>
    </div>
  );
}
