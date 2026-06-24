import {
  getRedditAccessToken,
  getRedditCredentials,
  getRedditUserAgent,
} from "@/lib/monitors/reddit-shared";

export interface RedditAuthorProfile {
  username: string;
  linkKarma: number;
  commentKarma: number;
  totalKarma: number;
  accountAgeDays: number;
  isSuspended: boolean;
  hasVerifiedEmail: boolean;
  createdUtc: number;
}

const profileCache = new Map<
  string,
  { profile: RedditAuthorProfile | null; expiresAt: number }
>();

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export async function fetchRedditAuthorProfile(
  username: string
): Promise<RedditAuthorProfile | null> {
  const name = username.trim().replace(/^\/?u\//i, "");
  if (!name || name === "[deleted]" || name.toLowerCase() === "automoderator") {
    return null;
  }
  if (!getRedditCredentials()) return null;

  const cached = profileCache.get(name.toLowerCase());
  if (cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  try {
    const accessToken = await getRedditAccessToken();
    const response = await fetch(
      `https://oauth.reddit.com/user/${encodeURIComponent(name)}/about.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": getRedditUserAgent(),
          Accept: "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      profileCache.set(name.toLowerCase(), {
        profile: null,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return null;
    }

    const data = (await response.json()) as {
      data?: {
        name?: string;
        link_karma?: number;
        comment_karma?: number;
        total_karma?: number;
        created_utc?: number;
        is_suspended?: boolean;
        has_verified_email?: boolean;
      };
    };

    const row = data.data;
    if (!row?.name) return null;

    const createdUtc = row.created_utc ?? 0;
    const accountAgeDays = createdUtc
      ? Math.floor((Date.now() / 1000 - createdUtc) / 86400)
      : 0;

    const profile: RedditAuthorProfile = {
      username: row.name,
      linkKarma: row.link_karma ?? 0,
      commentKarma: row.comment_karma ?? 0,
      totalKarma:
        row.total_karma ?? (row.link_karma ?? 0) + (row.comment_karma ?? 0),
      accountAgeDays,
      isSuspended: Boolean(row.is_suspended),
      hasVerifiedEmail: Boolean(row.has_verified_email),
      createdUtc,
    };

    profileCache.set(name.toLowerCase(), {
      profile,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return profile;
  } catch {
    return null;
  }
}
