/** Monitor de Twitter/X vía API v2 (requiere TWITTER_BEARER_TOKEN) */

import { withRetry } from "@/lib/utils/retry";
import { PLATFORM_META } from "./status";
import type { PlatformConfig, PlatformMonitor, RawPost } from "./types";

const TWITTER_LOOKBACK_HOURS = 24;
const SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent";

interface TwitterUser {
  id: string;
  username: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  author_id?: string;
  conversation_id?: string;
  created_at?: string;
}

interface TwitterSearchResponse {
  data?: TwitterTweet[];
  includes?: {
    users?: TwitterUser[];
  };
  errors?: Array<{ message: string }>;
}

function getTwitterBearerToken(): string {
  const token = process.env.TWITTER_BEARER_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Twitter/X no configurado. Definí TWITTER_BEARER_TOKEN (developer.x.com → App → Bearer Token)."
    );
  }
  return token;
}

function buildTwitterQuery(keyword: string): string {
  const escaped = keyword.trim().replace(/"/g, "");
  return `${escaped} -is:retweet lang:en`;
}

function tweetToRawPost(tweet: TwitterTweet, usersById: Map<string, TwitterUser>): RawPost {
  const author = tweet.author_id
    ? (usersById.get(tweet.author_id)?.username ?? null)
    : null;

  const isThread =
    tweet.conversation_id && tweet.conversation_id !== tweet.id;

  return {
    externalId: tweet.id,
    title: null,
    body: tweet.text,
    author,
    url: `https://x.com/i/status/${tweet.id}`,
    createdAt: tweet.created_at ?? new Date().toISOString(),
    postType: isThread ? "thread" : "tweet",
  };
}

async function searchTwitterPosts(
  keyword: string,
  config?: PlatformConfig
): Promise<RawPost[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const bearer = getTwitterBearerToken();
  const maxResults = Math.min(config?.maxResults ?? 20, 100);
  const startTime = new Date(
    Date.now() - TWITTER_LOOKBACK_HOURS * 3600 * 1000
  ).toISOString();

  const url = new URL(SEARCH_URL);
  url.searchParams.set("query", buildTwitterQuery(trimmed));
  url.searchParams.set("max_results", String(Math.max(10, maxResults)));
  url.searchParams.set("start_time", startTime);
  url.searchParams.set("tweet.fields", "created_at,author_id,conversation_id");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${bearer}`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Twitter API error: ${response.status} — ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as TwitterSearchResponse;

  if (data.errors?.length) {
    throw new Error(`Twitter API: ${data.errors[0]?.message ?? "error desconocido"}`);
  }

  const usersById = new Map<string, TwitterUser>();
  for (const user of data.includes?.users ?? []) {
    usersById.set(user.id, user);
  }

  return (data.data ?? [])
    .map((tweet) => tweetToRawPost(tweet, usersById))
    .slice(0, maxResults);
}

export function validateTwitterConfig(_config?: PlatformConfig): string | null {
  return null;
}

export const twitterMonitor: PlatformMonitor = {
  platform: "twitter",
  meta: PLATFORM_META.twitter,
  validateConfig: validateTwitterConfig,

  async fetchNewPosts(keyword, config) {
    return withRetry(() => searchTwitterPosts(keyword, config), {
      label: `Twitter search "${keyword.trim()}"`,
    });
  },
};
