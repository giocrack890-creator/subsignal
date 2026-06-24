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
      "Requiere GETXAPI_API_KEY de getxapi.com. Búsqueda vía /twitter/tweet/advanced_search (~$0.001 por llamada).",
    requiredEnvVars: ["GETXAPI_API_KEY"],
    dataSource: "GetXAPI — twitter/tweet/advanced_search",
  },
  ih: {
    platform: "ih",
    label: "Indie Hackers",
    status: "active",
    blockers: ["Índice Algolia puede requerir actualización de credenciales"],
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
