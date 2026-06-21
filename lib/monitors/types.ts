import type { Platform } from "@/types";

export interface RawPost {
  externalId: string;
  title: string | null;
  body: string | null;
  author: string | null;
  url: string;
  subreddit?: string | null;
  createdAt: string;
  postType?: "story" | "comment" | "ask" | "show" | "tweet" | "thread";
}

export interface PlatformConfig {
  /** Subreddits a monitorear (solo Reddit) */
  subreddits?: string[];
  maxResults?: number;
}

export type PlatformImplementationStatus = "active" | "coming_soon";

export interface PlatformMeta {
  platform: Platform;
  label: string;
  status: PlatformImplementationStatus;
  /** Decisiones pendientes antes de implementar fetch real */
  blockers: string[];
  /** Alternativas a evaluar */
  optionsToEvaluate: string[];
  /** Notas para quien implemente el adapter */
  implementationNotes: string;
  /** Fuente de datos planificada o actual */
  dataSource: string;
  /** Variables de entorno necesarias (si aplica) */
  requiredEnvVars?: string[];
}

export interface PlatformMonitor {
  platform: Platform;
  meta: PlatformMeta;
  fetchNewPosts(
    keyword: string,
    config?: PlatformConfig
  ): Promise<RawPost[]>;
  /** Retorna mensaje de error si la config es inválida, null si OK */
  validateConfig?: (config?: PlatformConfig) => string | null;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  hn: "Hacker News",
  reddit: "Reddit",
  twitter: "Twitter/X",
  ih: "Indie Hackers",
};

/** Plataformas con monitor implementado y operativo en el pipeline */
export const ACTIVE_PLATFORMS: Platform[] = ["hn", "reddit", "twitter", "ih"];

/** Plataformas planificadas pero aún no implementadas */
export const COMING_SOON_PLATFORMS: Platform[] = [];

export function isPlatformActive(platform: Platform): boolean {
  return ACTIVE_PLATFORMS.includes(platform);
}
