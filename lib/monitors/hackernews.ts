/** Monitor de Hacker News vía Algolia (API pública, sin credenciales) */

import { withRetry } from "@/lib/utils/retry";
import { PLATFORM_META } from "./status";
import type { PlatformMonitor, RawPost } from "./types";

const ALGOLIA_SEARCH_URL = "https://hn.algolia.com/api/v1/search_by_date";
const HN_ITEM_URL = "https://news.ycombinator.com/item?id=";
const LOOKBACK_HOURS = 24;

interface AlgoliaHit {
  objectID: string;
  title?: string | null;
  story_text?: string | null;
  comment_text?: string | null;
  author?: string | null;
  url?: string | null;
  created_at_i?: number;
  _tags?: string[];
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
}

function detectPostType(hit: AlgoliaHit): RawPost["postType"] {
  const tags = hit._tags ?? [];
  if (tags.includes("ask_hn")) return "ask";
  if (tags.includes("show_hn")) return "show";
  if (tags.includes("comment")) return "comment";
  return "story";
}

function hitToRawPost(hit: AlgoliaHit): RawPost | null {
  if (!hit.objectID || !hit.created_at_i) return null;

  const postType = detectPostType(hit);
  const isComment = postType === "comment";
  const body = isComment ? hit.comment_text : hit.story_text;
  const title = hit.title ?? (isComment ? "Comentario en HN" : null);
  const url = hit.url?.startsWith("http")
    ? hit.url
    : `${HN_ITEM_URL}${hit.objectID}`;

  return {
    externalId: hit.objectID,
    title,
    body: body ?? null,
    author: hit.author ?? null,
    url,
    createdAt: new Date(hit.created_at_i * 1000).toISOString(),
    postType,
  };
}

function prioritizePosts(posts: RawPost[]): RawPost[] {
  const priority = (post: RawPost) => {
    if (post.postType === "ask") return 0;
    if (post.postType === "show") return 1;
    if (post.postType === "comment") return 2;
    return 3;
  };

  return [...posts].sort((a, b) => priority(a) - priority(b));
}

async function searchAlgolia(
  keyword: string,
  maxResults: number
): Promise<RawPost[]> {
  const since = Math.floor(Date.now() / 1000) - LOOKBACK_HOURS * 3600;
  const url = new URL(ALGOLIA_SEARCH_URL);
  url.searchParams.set("query", keyword);
  url.searchParams.set("tags", "(story,comment)");
  url.searchParams.set("numericFilters", `created_at_i>${since}`);
  url.searchParams.set("hitsPerPage", String(maxResults));

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(
      `Algolia HN API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as AlgoliaResponse;
  const posts = data.hits
    .map(hitToRawPost)
    .filter((post): post is RawPost => post !== null);

  return prioritizePosts(posts);
}

export const hackerNewsMonitor: PlatformMonitor = {
  platform: "hn",
  meta: PLATFORM_META.hn,

  async fetchNewPosts(keyword, config) {
    const maxResults = config?.maxResults ?? 20;
    const trimmed = keyword.trim();

    if (!trimmed) {
      return [];
    }

    return withRetry(() => searchAlgolia(trimmed, maxResults), {
      label: `HN Algolia search "${trimmed}"`,
    });
  },
};
