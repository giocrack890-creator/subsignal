import { cn } from "@/lib/utils";

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  /** Resalta el valor con color accent */
  accent?: boolean;
  className?: string;
}

export function StatCard({ value, label, accent, className }: StatCardProps) {
  return (
    <div className={cn("dash-stat p-5", accent && "dash-stat-accent", className)}>
      <p
        className={cn(
          "relative text-3xl font-black tracking-tight",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="relative mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
        {label}
      </p>
    </div>
  );
}
