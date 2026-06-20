import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "platform" | "score" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-primary/10 text-primary border border-primary/20",
        variant === "outline" &&
          "border border-border-strong text-foreground-muted bg-transparent",
        variant === "score" &&
          "bg-primary/15 text-primary border border-primary/30 font-semibold",
        variant === "platform" &&
          "bg-muted text-foreground-muted border border-border",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
