/** Monitor de Reddit vía OAuth API (app en reddit.com/prefs/apps) */

import { withRetry } from "@/lib/utils/retry";
import { dedupePostsByExternalId } from "./dedupe";
import { PLATFORM_META } from "./status";
import {
  getRedditAccessToken,
  getRedditLookbackHours,
  getRedditUserAgent,
} from "./reddit-shared";
import type { PlatformConfig, PlatformMonitor, RawPost } from "./types";

const DEFAULT_SUBREDDITS = [
  "startups",
  "SaaS",
  "Entrepreneur",
  "smallbusiness",
  "SideProject",
];

interface RedditListingChild {
  data: {
    id: string;
    title: string;
    selftext?: string;
    author: string;
    permalink: string;
    url: string;
    created_utc: number;
    subreddit: string;
    is_self: boolean;
  };
}

interface RedditListing {
  data?: {
    children?: RedditListingChild[];
  };
}

function listingToPosts(listing: RedditListing, sinceUnix: number): RawPost[] {
  const children = listing.data?.children ?? [];

  return children
    .map((child) => child.data)
    .filter((data) => data.created_utc >= sinceUnix)
    .map((data) => ({
      externalId: data.id,
      title: data.title,
      body: data.selftext?.trim() ? data.selftext : null,
      author: data.author,
      url: data.url.startsWith("http")
        ? data.url
        : `https://www.reddit.com${data.permalink}`,
      subreddit: data.subreddit,
      createdAt: new Date(data.created_utc * 1000).toISOString(),
      postType: "story" as const,
    }));
}

async function searchSubreddit(
  accessToken: string,
  subreddit: string,
  keyword: string,
  limit: number,
  sinceUnix: number
): Promise<RawPost[]> {
  const path = `/r/${encodeURIComponent(subreddit)}/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=on&sort=new&t=day&limit=${limit}`;

  const response = await fetch(`https://oauth.reddit.com${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": getRedditUserAgent(),
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(
      `Reddit search r/${subreddit} error: ${response.status} ${response.statusText}`
    );
  }

  const listing = (await response.json()) as RedditListing;
  return listingToPosts(listing, sinceUnix);
}

async function searchRedditPosts(
  keyword: string,
  config?: PlatformConfig
): Promise<RawPost[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const accessToken = await getRedditAccessToken();
  const maxResults = config?.maxResults ?? 20;
  const lookbackHours = getRedditLookbackHours();
  const sinceUnix = Math.floor(Date.now() / 1000) - lookbackHours * 3600;
  const subreddits =
    config?.subreddits?.length && config.subreddits.length > 0
      ? config.subreddits
      : DEFAULT_SUBREDDITS;

  const perSubLimit = Math.max(5, Math.ceil(maxResults / subreddits.length));
  const allPosts: RawPost[] = [];

  for (const subreddit of subreddits.slice(0, 10)) {
    const posts = await searchSubreddit(
      accessToken,
      subreddit,
      trimmed,
      perSubLimit,
      sinceUnix
    );
    allPosts.push(...posts);
  }

  return dedupePostsByExternalId(allPosts).slice(0, maxResults);
}

export function validateRedditConfig(config?: PlatformConfig): string | null {
  const subreddits = config?.subreddits ?? [];

  if (subreddits.some((s) => !/^[a-zA-Z0-9_]{2,21}$/.test(s))) {
    return "Nombre de subreddit inválido (2-21 caracteres alfanuméricos)";
  }

  return null;
}

export const redditMonitor: PlatformMonitor = {
  platform: "reddit",
  meta: PLATFORM_META.reddit,
  validateConfig: validateRedditConfig,

  async fetchNewPosts(keyword, config) {
    return withRetry(() => searchRedditPosts(keyword, config), {
      label: `Reddit search "${keyword.trim()}"`,
    });
  },
};
