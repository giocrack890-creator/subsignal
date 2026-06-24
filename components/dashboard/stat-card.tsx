import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  /** Resalta el valor con color accent */
  accent?: boolean;
  className?: string;
  locked?: boolean;
  description?: string;
  footerLink?: {
    label: string;
    href: string;
  };
}

export function StatCard({
  value,
  label,
  accent,
  className,
  locked,
  description,
  footerLink,
}: StatCardProps) {
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
        {locked && <span className="mr-1" aria-hidden="true">🔒</span>}
        {label}
      </p>
      {description && (
        <p className="relative mt-2 text-xs leading-relaxed text-[#B4B4B4] normal-case tracking-normal">
          {description}
        </p>
      )}
      {footerLink && (
        <Link
          href={footerLink.href}
          className="relative mt-2 inline-block text-xs font-medium text-[#34D399] hover:underline"
        >
          {footerLink.label}
        </Link>
      )}
    </div>
  );
}
