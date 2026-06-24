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
  selectedPlatforms: Platform[];
  onPlatformsChange: (platforms: Platform[]) => void;
  showSubreddits?: boolean;
  subreddits?: string;
  onSubredditsChange?: (value: string) => void;
  activeTwitterCount?: number;
  editingHasTwitter?: boolean;
}

export function PlatformSelector({
  plan,
  selectedPlatforms,
  onPlatformsChange,
  showSubreddits = false,
  subreddits = "",
  onSubredditsChange,
  activeTwitterCount = 0,
  editingHasTwitter = false,
}: PlatformSelectorProps) {
  const allPlatforms: Platform[] = ["hn", "reddit", "twitter", "ih"];
  const redditActive = ACTIVE_PLATFORMS.includes("reddit");
  const twitterKeywordLimit = getMaxTwitterKeywords(plan);
  const twitterAtLimit =
    twitterKeywordLimit !== null &&
    !editingHasTwitter &&
    activeTwitterCount >= twitterKeywordLimit;

  function togglePlatform(platform: Platform) {
    if (!ACTIVE_PLATFORMS.includes(platform)) return;
    if (!canUsePlatform(plan, platform)) return;

    if (platform === "twitter" && twitterAtLimit && !selectedPlatforms.includes("twitter")) {
      return;
    }

    const next = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    if (next.length === 0) {
      onPlatformsChange(["hn"]);
      return;
    }

    onPlatformsChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-foreground-muted">Plataformas</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {allPlatforms.map((platform) => {
          const isActive = ACTIVE_PLATFORMS.includes(platform);
          const isComingSoon = COMING_SOON_PLATFORMS.includes(platform);
          const isPlanLocked = !canUsePlatform(plan, platform);
          const isChecked = selectedPlatforms.includes(platform);
          const twitterBlocked =
            platform === "twitter" && twitterAtLimit && !isChecked;
          const isDisabled = !isActive || isPlanLocked || twitterBlocked;

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
                checked={isChecked && !isPlanLocked}
                disabled={isDisabled}
                onChange={() => togglePlatform(platform)}
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
              {!isPlanLocked &&
                platform === "twitter" &&
                twitterKeywordLimit !== null && (
                  <Badge variant="outline" className="text-[10px]">
                    {activeTwitterCount}/{twitterKeywordLimit}
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
          Starter incluye hasta {twitterKeywordLimit} keywords activas con
          Twitter/X. Pro desbloquea X en todas tus keywords.
        </p>
      )}
      {twitterAtLimit && (
        <p className="text-xs text-amber-400/90">
          Ya usaste tus {twitterKeywordLimit} slots de Twitter/X en Starter.
          Editá una keyword existente o pasá a Pro.
        </p>
      )}

      {showSubreddits && redditActive && selectedPlatforms.includes("reddit") && (
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
            value={subreddits}
            onChange={(e) => onSubredditsChange?.(e.target.value)}
            placeholder="SaaS, startups, entrepreneur"
            className="w-full rounded-xl border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1.5 text-[11px] text-foreground-muted">
            Separados por coma. Si no ponés ninguno, usamos subreddits por
            defecto (startups, SaaS, etc.).
          </p>
        </div>
      )}
    </div>
  );
}

export function KeywordPreview({
  term,
  platforms,
}: {
  term: string;
  platforms: Platform[];
}) {
  const preview = term.trim() || "tu keyword";
  const labels = platforms
    .filter((p) => ACTIVE_PLATFORMS.includes(p))
    .map((p) => PLATFORM_LABELS[p]);

  return (
    <div className="rounded-xl border border-primary/20 bg-primary-muted-bg px-4 py-3">
      <p className="text-xs font-medium text-primary">Preview</p>
      <p className="mt-1 text-sm text-foreground-secondary">
        Monitoreamos &ldquo;{preview}&rdquo; en{" "}
        <span className="text-foreground">
          {labels.length > 0 ? labels.join(", ") : "Hacker News"}
        </span>{" "}
        en las últimas 24 horas.
      </p>
    </div>
  );
}
