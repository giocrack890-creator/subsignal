"use client";

import { Badge } from "@/components/ui/badge";
import {
  ACTIVE_PLATFORMS,
  COMING_SOON_PLATFORMS,
  PLATFORM_LABELS,
} from "@/lib/monitors/types";
import {
  canUsePlatform,
  getMaxTwitterKeywords,
} from "@/lib/payments/platforms";
import { cn } from "@/lib/utils";
import type { Plan, Platform } from "@/types";

interface PlatformSelectorProps {
  plan: Plan;
  defaultPlatforms?: Platform[];
  showSubreddits?: boolean;
  subredditsDefault?: string;
}

export function PlatformSelector({
  plan,
  defaultPlatforms = ["hn"],
  showSubreddits = false,
  subredditsDefault = "",
}: PlatformSelectorProps) {
  const allPlatforms: Platform[] = ["hn", "reddit", "twitter", "ih"];
  const redditActive = ACTIVE_PLATFORMS.includes("reddit");
  const twitterKeywordLimit = getMaxTwitterKeywords(plan);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-foreground-muted">Plataformas</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {allPlatforms.map((platform) => {
          const isActive = ACTIVE_PLATFORMS.includes(platform);
          const isComingSoon = COMING_SOON_PLATFORMS.includes(platform);
          const isPlanLocked = !canUsePlatform(plan, platform);
          const isDisabled = !isActive || isPlanLocked;

          return (
            <label
              key={platform}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition",
                isDisabled
                  ? "cursor-not-allowed border-border opacity-50"
                  : "border-border hover:border-border-glow hover:bg-background-card-hover"
              )}
            >
              <input
                type="checkbox"
                name={`platform_${platform}`}
                value="on"
                defaultChecked={
                  defaultPlatforms.includes(platform) && !isDisabled
                }
                disabled={isDisabled}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="flex-1 text-sm text-foreground">
                {PLATFORM_LABELS[platform]}
              </span>
              {isComingSoon && (
                <Badge variant="outline" className="text-[10px]">
                  Próximamente
                </Badge>
              )}
              {isPlanLocked && isActive && platform === "twitter" && (
                <Badge variant="outline" className="text-[10px]">
                  Starter+
                </Badge>
              )}
              {isPlanLocked && isActive && platform !== "twitter" && (
                <Badge variant="outline" className="text-[10px]">
                  Plan pago
                </Badge>
              )}
              {!isPlanLocked && platform === "twitter" && twitterKeywordLimit === 1 && (
                <Badge variant="outline" className="text-[10px]">
                  1 keyword
                </Badge>
              )}
            </label>
          );
        })}
      </div>

      {plan === "free" && (
        <p className="text-xs text-foreground-muted">
          Plan free: solo Hacker News. Twitter/X y el resto requieren Starter o
          Pro.
        </p>
      )}
      {plan === "starter" && (
        <p className="text-xs text-foreground-muted">
          Starter incluye 1 keyword con Twitter/X. Pro desbloquea X en todas tus
          keywords.
        </p>
      )}

      {showSubreddits && redditActive && (
        <div>
          <label
            htmlFor="subreddits"
            className="mb-1.5 block text-xs font-medium text-foreground-muted"
          >
            Subreddits (opcional)
          </label>
          <input
            id="subreddits"
            name="subreddits"
            defaultValue={subredditsDefault}
            placeholder="SaaS, startups, entrepreneur"
            className="w-full rounded-xl border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
    </div>
  );
}

export function KeywordPreview({ term }: { term: string }) {
  const preview = term.trim() || "tu keyword";

  return (
    <div className="rounded-xl border border-primary/20 bg-primary-muted-bg px-4 py-3">
      <p className="text-xs font-medium text-primary">Preview</p>
      <p className="mt-1 text-sm text-foreground-secondary">
        Encontraríamos posts en{" "}
        <span className="text-foreground">Ask HN</span>,{" "}
        <span className="text-foreground">Show HN</span> y comentarios que
        mencionen &ldquo;{preview}&rdquo; en las últimas 24 horas.
      </p>
    </div>
  );
}
