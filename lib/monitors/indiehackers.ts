/** Monitor de Indie Hackers vía Algolia (search-only key pública del sitio) */

import { withRetry } from "@/lib/utils/retry";
import { dedupePostsByExternalId } from "./dedupe";
import { PLATFORM_META } from "./status";
import type { PlatformConfig, PlatformMonitor, RawPost } from "./types";

const IH_LOOKBACK_HOURS = 48;
const IH_ALGOLIA_APP_ID = "N86T1R3OWZ";
/** Search-only key expuesta en el frontend de indiehackers.com */
const IH_ALGOLIA_SEARCH_KEY = "5140dac5e87f47346abbda1a34ee70c3";
const IH_ALGOLIA_INDEX = "Post";
const IH_ALGOLIA_URL = `https://${IH_ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${IH_ALGOLIA_INDEX}/query`;

interface IndieHackersHit {
  objectID: string;
  title?: string | null;
  body?: string | null;
  description?: string | null;
  username?: string | null;
  path?: string | null;
  url?: string | null;
  createdAt?: number | null;
  createdAtMs?: number | null;
  publishedAt?: number | null;
}

interface IndieHackersSearchResponse {
  hits: IndieHackersHit[];
}

function hitTimestampMs(hit: IndieHackersHit): number | null {
  if (typeof hit.createdAtMs === "number") return hit.createdAtMs;
  if (typeof hit.createdAt === "number") {
    return hit.createdAt > 1_000_000_000_000
      ? hit.createdAt
      : hit.createdAt * 1000;
  }
  if (typeof hit.publishedAt === "number") {
    return hit.publishedAt > 1_000_000_000_000
      ? hit.publishedAt
      : hit.publishedAt * 1000;
  }
  return null;
}

function hitToRawPost(hit: IndieHackersHit): RawPost | null {
  if (!hit.objectID) return null;

  const timestampMs = hitTimestampMs(hit);
  const path = hit.path ?? hit.url;
  const url = path
    ? path.startsWith("http")
      ? path
      : `https://www.indiehackers.com${path.startsWith("/") ? path : `/${path}`}`
    : `https://www.indiehackers.com/post/${hit.objectID}`;

  const body = hit.body ?? hit.description ?? null;

  return {
    externalId: hit.objectID,
    title: hit.title ?? null,
    body,
    author: hit.username ?? null,
    url,
    createdAt: timestampMs
      ? new Date(timestampMs).toISOString()
      : new Date().toISOString(),
    postType: "story",
  };
}

async function searchIndieHackersPosts(
  keyword: string,
  config?: PlatformConfig
): Promise<RawPost[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const maxResults = config?.maxResults ?? 20;
  const sinceMs = Date.now() - IH_LOOKBACK_HOURS * 3600 * 1000;

  const params = new URLSearchParams({
    query: trimmed,
    hitsPerPage: String(maxResults),
  });

  const response = await fetch(IH_ALGOLIA_URL, {
    method: "POST",
    headers: {
      "X-Algolia-Application-Id": IH_ALGOLIA_APP_ID,
      "X-Algolia-API-Key": IH_ALGOLIA_SEARCH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ params: params.toString() }),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(
        "[indiehackers] Algolia index no disponible (404) — omitiendo IH hasta actualizar credenciales"
      );
      return [];
    }
    throw new Error(
      `Indie Hackers Algolia error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as IndieHackersSearchResponse;

  const posts = data.hits
    .map(hitToRawPost)
    .filter((post): post is RawPost => post !== null)
    .filter((post) => new Date(post.createdAt).getTime() >= sinceMs);

  return dedupePostsByExternalId(posts).slice(0, maxResults);
}

export const indieHackersMonitor: PlatformMonitor = {
  platform: "ih",
  meta: PLATFORM_META.ih,

  async fetchNewPosts(keyword, config) {
    return withRetry(() => searchIndieHackersPosts(keyword, config), {
      label: `Indie Hackers search "${keyword.trim()}"`,
    });
  },
};
