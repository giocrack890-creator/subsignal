import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
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
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-border bg-background-card px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-muted-bg">
        <Icon className="h-7 w-7 text-primary/50" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary">
        {description}
      </p>
      {action && (
        <Link href={action.href} className="mt-6 cursor-pointer">
          <Button variant="accent" size="md">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
