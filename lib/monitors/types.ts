import type { Platform } from "@/types";

export interface RawPost {
  externalId: string;
  title: string | null;
  body: string | null;
  author: string | null;
  url: string;
  subreddit?: string | null;
  createdAt: string;
  postType?: "story" | "comment" | "ask" | "show";
}

export interface PlatformConfig {
  subreddits?: string[];
  maxResults?: number;
}

export interface PlatformMonitor {
  platform: Platform;
  fetchNewPosts(
    keyword: string,
    config?: PlatformConfig
  ): Promise<RawPost[]>;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  hn: "Hacker News",
  reddit: "Reddit",
  twitter: "Twitter/X",
  ih: "Indie Hackers",
};

/** Plataformas con monitor implementado y operativo */
export const ACTIVE_PLATFORMS: Platform[] = ["hn"];

/** Plataformas planificadas pero aún no implementadas */
export const COMING_SOON_PLATFORMS: Platform[] = ["reddit", "twitter", "ih"];
