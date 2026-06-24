import type { RawPost } from "@/lib/monitors/types";
import type { FeatureSourceConfig } from "./types";

function parseRssItems(xml: string): { title: string; link: string; description: string }[] {
  const items: { title: string; link: string; description: string }[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of blocks) {
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() ?? "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? "";
    const description =
      block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() ?? "";
    if (title && link) items.push({ title, link, description });
  }

  if (items.length === 0) {
    const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
    for (const block of entries) {
      const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
      const link =
        block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]?.trim() ??
        block.match(/<id[^>]*>([\s\S]*?)<\/id>/i)?.[1]?.trim() ??
        "";
      const description =
        block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1]?.trim() ?? "";
      if (title && link) items.push({ title, link, description });
    }
  }

  return items.slice(0, 20);
}

export async function fetchRssPosts(
  keyword: string,
  config: FeatureSourceConfig
): Promise<RawPost[]> {
  const feedUrl = config.feed_url?.trim();
  if (!feedUrl) return [];

  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "ThreadPulse/1.0" },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return [];

  const xml = await res.text();
  const needle = keyword.toLowerCase();
  const items = parseRssItems(xml);

  return items
    .filter((item) => {
      const hay = `${item.title} ${item.description}`.toLowerCase();
      return hay.includes(needle);
    })
    .map((item, i) => ({
      externalId: `rss_${Buffer.from(item.link).toString("base64url").slice(0, 32)}_${i}`,
      title: item.title.replace(/<[^>]+>/g, "").slice(0, 300),
      body: item.description.replace(/<[^>]+>/g, "").slice(0, 2000),
      author: null,
      url: item.link,
      createdAt: new Date().toISOString(),
      postType: "story" as const,
    }));
}
