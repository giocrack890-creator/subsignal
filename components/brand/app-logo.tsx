import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ICON_SIZES = {
  xs: 24,
  sm: 28,
  md: 32,
  lg: 40,
} as const;

type LogoSize = keyof typeof ICON_SIZES;

export type AppLogoVariant = "icon" | "sidebar" | "wordmark";

interface AppLogoProps {
  variant?: AppLogoVariant;
  size?: LogoSize;
  showMonitoring?: boolean;
  className?: string;
  href?: string;
}

function TpMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-black",
        className
      )}
      aria-hidden="true"
    >
      TP
    </span>
  );
}

export function AppIcon({
  size = "md",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  const px = ICON_SIZES[size];

  return (
    <Image
      src="/branding/icon-mark.png"
      alt=""
      width={px}
      height={px}
      className={cn("shrink-0 rounded-lg", className)}
      priority
      aria-hidden
    />
  );
}

function MonitoringBadge() {
  return (
    <span className="flex items-center gap-1">
      <span
        className="h-[5px] w-[5px] rounded-full bg-accent opacity-80 animate-pulse"
        aria-hidden="true"
      />
      <span className="text-[10px] text-accent opacity-60">monitoring</span>
    </span>
  );
}

export function AppLogo({
  variant = "icon",
  size = "md",
  showMonitoring = false,
  className,
  href,
}: AppLogoProps) {
  const content =
    variant === "sidebar" ? (
      <span className={cn("flex items-center gap-2.5", className)}>
        <TpMark />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-foreground">
            ThreadPulse
          </span>
          {showMonitoring && <MonitoringBadge />}
        </span>
      </span>
    ) : variant === "wordmark" ? (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <TpMark />
        <span className="text-sm font-semibold text-foreground">ThreadPulse</span>
      </span>
    ) : (
      <span className={cn("inline-flex", className)}>
        <AppIcon size={size} />
        <span className="sr-only">ThreadPulse</span>
      </span>
    );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {content}
      </Link>
    );
  }

  return content;
}
