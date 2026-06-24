import type { RawPost } from "@/lib/monitors/types";
import type { FeatureSourceConfig } from "./types";

/** Slack communities públicas vía archivo exportado o webhook de ingest */
export async function fetchSlackCommunityPosts(
  keyword: string,
  config: FeatureSourceConfig
): Promise<RawPost[]> {
  const archiveUrl = config.feed_url?.trim();
  if (!archiveUrl) return [];

  const res = await fetch(archiveUrl, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return [];

  const text = await res.text();
  const needle = keyword.toLowerCase();
  const lines = text.split("\n").filter((l) => l.toLowerCase().includes(needle));

  return lines.slice(0, 10).map((line, i) => ({
    externalId: `slack_${Buffer.from(line).toString("base64url").slice(0, 24)}_${i}`,
    title: line.slice(0, 120),
    body: line,
    author: null,
    url: archiveUrl,
    createdAt: new Date().toISOString(),
    postType: "comment" as const,
  }));
}
