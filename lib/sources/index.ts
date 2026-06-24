import type { RawPost } from "@/lib/monitors/types";
import { fetchAppStorePosts } from "./app-store";
import { fetchGitHubPosts } from "./github";
import { fetchRssPosts } from "./rss";
import { fetchSlackCommunityPosts } from "./slack";
import type { FeatureSourceConfig, FeatureSourceType } from "./types";

export * from "./types";

const SOURCE_PLATFORM: Record<FeatureSourceType, string> = {
  google_alerts: "google_alert",
  rss: "rss",
  github: "github",
  app_store: "app_store",
  slack_community: "slack",
  devto: "rss",
  medium: "rss",
};

export function sourceTypeToPlatform(sourceType: FeatureSourceType): string {
  return SOURCE_PLATFORM[sourceType] ?? "rss";
}

export async function fetchFromSource(
  sourceType: FeatureSourceType,
  keyword: string,
  config: FeatureSourceConfig
): Promise<RawPost[]> {
  switch (sourceType) {
    case "rss":
    case "devto":
    case "medium":
      return fetchRssPosts(keyword, {
        ...config,
        feed_url:
          config.feed_url ??
          (sourceType === "devto"
            ? `https://dev.to/feed/tag/${encodeURIComponent(keyword)}`
            : undefined),
      });
    case "github":
      return fetchGitHubPosts(keyword, config);
    case "app_store":
      return fetchAppStorePosts(keyword, config);
    case "slack_community":
      return fetchSlackCommunityPosts(keyword, config);
    case "google_alerts":
      return [];
    default:
      return [];
  }
}
