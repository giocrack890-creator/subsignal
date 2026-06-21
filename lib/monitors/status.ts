import type { Platform } from "@/types";
import type { PlatformMeta } from "./types";

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  hn: {
    platform: "hn",
    label: "Hacker News",
    status: "active",
    blockers: [],
    optionsToEvaluate: [],
    implementationNotes:
      "Operativo vía Algolia API (search_by_date). Sin credenciales.",
    dataSource: "Algolia HN Search API",
  },
  reddit: {
    platform: "reddit",
    label: "Reddit",
    status: "active",
    blockers: [],
    optionsToEvaluate: [],
    implementationNotes:
      "OAuth app en reddit.com/prefs/apps (tipo script). Busca en subreddits configurados o defaults (startups, SaaS, etc.).",
    requiredEnvVars: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USER_AGENT"],
    dataSource: "Reddit OAuth API",
  },
  twitter: {
    platform: "twitter",
    label: "Twitter/X",
    status: "active",
    blockers: [],
    optionsToEvaluate: [],
    implementationNotes:
      "Requiere TWITTER_BEARER_TOKEN de developer.x.com. API Basic tiene costo mensual.",
    requiredEnvVars: ["TWITTER_BEARER_TOKEN"],
    dataSource: "X API v2 — tweets/search/recent",
  },
  ih: {
    platform: "ih",
    label: "Indie Hackers",
    status: "active",
    blockers: [],
    optionsToEvaluate: [],
    implementationNotes:
      "Operativo vía Algolia (search-only key pública de indiehackers.com).",
    dataSource: "Algolia — índice Post",
  },
};

export function getPlatformMeta(platform: Platform): PlatformMeta {
  return PLATFORM_META[platform];
}

export function getComingSoonPlatforms(): PlatformMeta[] {
  return Object.values(PLATFORM_META).filter((m) => m.status === "coming_soon");
}
