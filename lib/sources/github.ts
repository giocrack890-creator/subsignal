import type { RawPost } from "@/lib/monitors/types";
import type { FeatureSourceConfig } from "./types";

interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  html_url: string;
  user: { login: string } | null;
  created_at: string;
}

export async function fetchGitHubPosts(
  keyword: string,
  config: FeatureSourceConfig
): Promise<RawPost[]> {
  const repo = config.github_repo?.trim();
  const q = repo
    ? `${keyword} repo:${repo} is:issue`
    : `${keyword} is:issue`;

  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=created&per_page=15`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "ThreadPulse",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { items?: GitHubIssue[] };

  return (data.items ?? []).map((issue) => ({
    externalId: `gh_${issue.id}`,
    title: issue.title,
    body: issue.body?.slice(0, 2000) ?? null,
    author: issue.user?.login ?? null,
    url: issue.html_url,
    createdAt: issue.created_at,
    postType: "ask" as const,
  }));
}
