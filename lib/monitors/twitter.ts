/** Monitor de Twitter/X vía GetXAPI (https://www.getxapi.com) */

import { withRetry } from "@/lib/utils/retry";
import { PLATFORM_META } from "./status";
import type { PlatformConfig, PlatformMonitor, RawPost } from "./types";
import {
  buildGetXApiSearchQuery,
  getGetXApiKey,
  getGetXApiSearchUrl,
  isTwitterConfigured,
} from "./twitter-shared";

interface GetXApiAuthor {
  userName?: string;
  screen_name?: string;
  name?: string;
}

interface GetXApiTweet {
  id: string;
  text?: string;
  url?: string;
  createdAt?: string;
  conversationId?: string;
  isReply?: boolean;
  author?: GetXApiAuthor;
}

interface GetXApiSearchResponse {
  tweets?: GetXApiTweet[];
  next_cursor?: string | null;
  has_more?: boolean;
  message?: string;
  error?: string;
}

function parseTweetDate(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function getAuthorUsername(author?: GetXApiAuthor): string | null {
  if (!author) return null;
  return author.userName ?? author.screen_name ?? null;
}

function tweetToRawPost(tweet: GetXApiTweet): RawPost {
  const author = getAuthorUsername(tweet.author);
  const isThread =
    tweet.isReply === true ||
    (tweet.conversationId != null && tweet.conversationId !== tweet.id);

  return {
    externalId: tweet.id,
    title: null,
    body: tweet.text ?? null,
    author,
    url:
      tweet.url ??
      (author
        ? `https://x.com/${author}/status/${tweet.id}`
        : `https://x.com/i/status/${tweet.id}`),
    createdAt: parseTweetDate(tweet.createdAt),
    postType: isThread ? "thread" : "tweet",
  };
}

async function fetchGetXApiSearchPage(
  query: string,
  cursor?: string
): Promise<GetXApiSearchResponse> {
  const apiKey = getGetXApiKey();
  const response = await fetch(
    getGetXApiSearchUrl({ query, product: "Latest", cursor }),
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    }
  );

  const body = (await response.json()) as GetXApiSearchResponse;

  if (!response.ok) {
    const detail =
      body.message ?? body.error ?? JSON.stringify(body).slice(0, 200);
    throw new Error(`GetXAPI error: ${response.status} — ${detail}`);
  }

  return body;
}

async function searchTwitterPosts(
  keyword: string,
  config?: PlatformConfig
): Promise<RawPost[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const maxResults = Math.min(config?.maxResults ?? 20, 60);
  const query = buildGetXApiSearchQuery(trimmed);
  const posts: RawPost[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  let page = 0;
  const maxPages = Math.max(1, Math.ceil(maxResults / 20));

  while (posts.length < maxResults && page < maxPages) {
    const data = await fetchGetXApiSearchPage(query, cursor);

    for (const tweet of data.tweets ?? []) {
      if (!tweet.id || seen.has(tweet.id)) continue;
      seen.add(tweet.id);
      posts.push(tweetToRawPost(tweet));
      if (posts.length >= maxResults) break;
    }

    if (!data.has_more || !data.next_cursor) break;
    cursor = data.next_cursor;
    page += 1;
  }

  return posts.slice(0, maxResults);
}

export function validateTwitterConfig(_config?: PlatformConfig): string | null {
  if (!isTwitterConfigured()) {
    return "Definí GETXAPI_API_KEY para monitorear Twitter/X.";
  }
  return null;
}

export const twitterMonitor: PlatformMonitor = {
  platform: "twitter",
  meta: PLATFORM_META.twitter,
  validateConfig: validateTwitterConfig,

  async fetchNewPosts(keyword, config) {
    return withRetry(() => searchTwitterPosts(keyword, config), {
      label: `Twitter/GetXAPI search "${keyword.trim()}"`,
    });
  },
};
