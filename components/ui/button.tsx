import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 cursor-pointer transition-all duration-200 shadow-sm",
  accent:
    "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-200 shadow-[0_0_24px_var(--primary-glow)]",
  secondary:
    "bg-background-elevated text-foreground border border-border hover:border-primary/40 cursor-pointer transition-colors duration-200",
  outline:
    "border border-border-strong bg-transparent text-foreground hover:bg-white/5 cursor-pointer transition-colors duration-200",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/5 cursor-pointer transition-colors duration-200",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 cursor-pointer transition-colors duration-200",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-2 rounded-full",
  md: "h-10 px-5 text-sm gap-2 rounded-full",
  lg: "h-12 px-7 text-sm gap-2.5 rounded-full",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  showArrow = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black"
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6h7M6.5 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
