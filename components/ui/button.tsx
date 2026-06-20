import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-primary-foreground hover:bg-white/90 shadow-sm",
  secondary:
    "bg-primary text-primary-foreground hover:brightness-110 box-glow",
  outline:
    "border border-border-strong bg-transparent text-foreground hover:bg-white/5",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/5",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2.5",
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
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
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
