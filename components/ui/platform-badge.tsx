import { cn } from "@/lib/utils";
import type { Platform } from "@/types";

const PLATFORM_STYLES: Record<
  Platform,
  { label: string; className: string }
> = {
  hn: {
    label: "HN",
    className: "bg-platform-hn/15 text-platform-hn border-platform-hn/30",
  },
  reddit: {
    label: "Reddit",
    className: "bg-platform-reddit/15 text-platform-reddit border-platform-reddit/30",
  },
  twitter: {
    label: "X",
    className: "bg-platform-twitter/15 text-platform-twitter border-platform-twitter/30",
  },
  ih: {
    label: "IH",
    className: "bg-platform-ih/15 text-foreground-muted border-border-strong",
  },
  github: { label: "GH", className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  rss: { label: "RSS", className: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  google_alert: { label: "GA", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  app_store: { label: "App", className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  slack: { label: "Slack", className: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
};

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const { label, className: style } = PLATFORM_STYLES[platform];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
