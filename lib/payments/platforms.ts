/** Reglas de acceso por plataforma y plan */

import type { Plan, Platform } from "@/types";
import { isPlanAtLeast } from "./plans";

/** Plataformas que requieren plan Starter o superior */
export const PREMIUM_ONLY_PLATFORMS: Platform[] = ["twitter"];

export const STARTER_MAX_TWITTER_KEYWORDS = 3;

/** Máximo de keywords activas con Twitter/X por plan (`null` = sin límite extra) */
export function getMaxTwitterKeywords(plan: Plan): number | null {
  if (plan === "free") return 0;
  if (plan === "starter") return STARTER_MAX_TWITTER_KEYWORDS;
  return null;
}

export function canUsePlatform(plan: Plan, platform: Platform): boolean {
  if (plan === "free" && platform !== "hn") return false;
  if (
    PREMIUM_ONLY_PLATFORMS.includes(platform) &&
    !isPlanAtLeast(plan, "starter")
  ) {
    return false;
  }
  return true;
}

export function filterPlatformsForPlan(
  plan: Plan,
  platforms: Platform[]
): Platform[] {
  return platforms.filter((p) => canUsePlatform(plan, p));
}
