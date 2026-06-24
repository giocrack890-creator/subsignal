import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md";
}

function getScoreStyles(score: number): {
  color: string;
  background: string;
  border: string;
  boxShadow: string;
} {
  if (score >= 9) {
    return {
      color: "#34D399",
      background: "rgba(52,211,153,0.15)",
      border: "rgba(52,211,153,0.3)",
      boxShadow: "0 0 12px rgba(52,211,153,0.5)",
    };
  }
  if (score >= 7) {
    return {
      color: "#86EFAC",
      background: "rgba(134,239,172,0.1)",
      border: "rgba(134,239,172,0.3)",
      boxShadow: "0 0 6px rgba(134,239,172,0.3)",
    };
  }
  if (score >= 5) {
    return {
      color: "#FBBF24",
      background: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.3)",
      boxShadow: "0 0 6px rgba(251,191,36,0.2)",
    };
  }
  return {
    color: "#6B6B6B",
    background: "rgba(107,107,107,0.1)",
    border: "rgba(107,107,107,0.3)",
    boxShadow: "none",
  };
}

export function getScoreColor(score: number): string {
  if (score >= 9) return "#34D399";
  if (score >= 7) return "#86EFAC";
  if (score >= 5) return "#FBBF24";
  return "#6B6B6B";
}

export function ScoreBadge({ score, className, size = "md" }: ScoreBadgeProps) {
  const styles = getScoreStyles(score);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-bold transition-all duration-200",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className
      )}
      style={{
        color: styles.color,
        backgroundColor: styles.background,
        borderColor: styles.border,
        boxShadow: styles.boxShadow,
      }}
      title={`Intent score: ${score}/10`}
    >
      {score}/10
    </span>
  );
}
