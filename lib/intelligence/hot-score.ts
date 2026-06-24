/** Feed "caliente ahora" — score × velocidad de engagement */

import type { Platform } from "@/types";

const PLATFORM_VELOCITY: Partial<Record<Platform, number>> = {
  hn: 1.2,
  reddit: 1.0,
  twitter: 1.5,
  ih: 0.9,
  github: 1.0,
  rss: 0.85,
  google_alert: 0.9,
  app_store: 1.05,
  slack: 1.1,
};

export function computeHotScore(input: {
  intentScore: number;
  platform: Platform;
  foundAt: string;
  isBuyerIntent: boolean;
  engagementVelocity?: number | null;
}): number {
  const ageHours =
    (Date.now() - new Date(input.foundAt).getTime()) / (1000 * 60 * 60);
  const freshness = Math.max(0.1, 1 - ageHours / 48);
  const platformBoost = PLATFORM_VELOCITY[input.platform] ?? 1;
  const buyerBoost = input.isBuyerIntent ? 1.15 : 1;
  const velocity = input.engagementVelocity ?? 1;

  const hot =
    input.intentScore * freshness * platformBoost * buyerBoost * velocity;

  return Math.round(hot * 100) / 100;
}
