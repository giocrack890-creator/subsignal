import type { RawPost } from "@/lib/monitors/types";
import type { FeatureSourceConfig } from "./types";

interface AppStoreReview {
  id: { label: string };
  title: { label: string };
  content: { label: string };
  author: { name: { label: string } };
  link: { attributes: { href: string } };
  updated: { label: string };
}

export async function fetchAppStorePosts(
  keyword: string,
  config: FeatureSourceConfig
): Promise<RawPost[]> {
  const appId = config.app_id?.trim();
  if (!appId) return [];

  const url = `https://itunes.apple.com/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    feed?: { entry?: AppStoreReview[] };
  };

  const entries = data.feed?.entry ?? [];
  const reviews = Array.isArray(entries) ? entries : [entries];
  const needle = keyword.toLowerCase();

  return reviews
    .filter((r) => r.id?.label && !r.id.label.startsWith("https://"))
    .filter((r) => {
      const hay = `${r.title?.label ?? ""} ${r.content?.label ?? ""}`.toLowerCase();
      return hay.includes(needle);
    })
    .slice(0, 15)
    .map((r) => ({
      externalId: `as_${r.id.label}`,
      title: r.title?.label ?? "App Store review",
      body: r.content?.label ?? null,
      author: r.author?.name?.label ?? null,
      url: r.link?.attributes?.href ?? `https://apps.apple.com/app/id${appId}`,
      createdAt: r.updated?.label ?? new Date().toISOString(),
      postType: "comment" as const,
    }));
}
