import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadarIcon } from "@/components/dashboard/radar-icon";

interface EmptyStateProps {
  icon?: LucideIcon;
  variant?: "default" | "radar" | "chart";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  variant = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[14px] px-6 py-14 text-center",
        variant === "chart" ? "dash-empty-glow dash-ghost-chart" : "dash-empty-glow",
        className
      )}
    >
      {variant === "radar" ? (
        <RadarIcon />
      ) : Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary-muted-bg">
          <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden="true" />
        </div>
      ) : null}
      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary">
        {description}
      </p>
      {action && (
        <Link href={action.href} className="mt-6 cursor-pointer">
          <Button variant="accent" size="md" className="dash-btn-neon">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
