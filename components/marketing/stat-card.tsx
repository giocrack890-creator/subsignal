import { cn } from "@/lib/utils";

type StatVariant = "chevron" | "chart" | "plain";

interface StatCardProps {
  value: string;
  label: string;
  variant?: StatVariant;
  className?: string;
}

function Sparkline() {
  return (
    <svg
      className="absolute bottom-0 right-0 h-16 w-32 opacity-80"
      viewBox="0 0 128 64"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(52,211,153,0.4)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0 48 C20 44, 30 20, 50 28 S80 52, 128 12"
        stroke="#34D399"
        strokeWidth="2"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.6))" }}
      />
      <path
        d="M0 48 C20 44, 30 20, 50 28 S80 52, 128 12 V64 H0 Z"
        fill="url(#sparkGrad)"
      />
    </svg>
  );
}

export function StatCard({
  value,
  label,
  variant = "plain",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bento-card relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-8 text-center",
        variant === "chevron" && "bg-chevron-pattern",
        className
      )}
    >
      {variant === "chart" && <Sparkline />}

      <p className="relative z-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {value}
      </p>
      <p className="relative z-10 mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
        {label}
      </p>
    </div>
  );
}
