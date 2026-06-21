import type { RawPost } from "./types";

export function dedupePostsByExternalId(posts: RawPost[]): RawPost[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.externalId)) return false;
    seen.add(post.externalId);
    return true;
  });
}
