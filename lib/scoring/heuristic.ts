/** Scoring heurístico de respaldo cuando Claude no está disponible */

import type { RawPost } from "@/lib/monitors/types";
import type { IntentScoreResult, Platform } from "@/types";

const INTENT_PHRASES = [
  "looking for",
  "recommend",
  "alternative",
  "anyone know",
  "what do you use",
  "how do you",
  "need a tool",
  "best way to",
  "struggling with",
  "busco",
  "recomend",
  "alternativa",
  "alguna herramienta",
];

export function scorePostHeuristic(input: {
  post: RawPost;
  keyword: string;
  platform: Platform;
}): IntentScoreResult {
  const { post, keyword, platform } = input;
  const haystack = `${post.title ?? ""} ${post.body ?? ""}`.toLowerCase();
  const needle = keyword.trim().toLowerCase();
  const tokens = needle.split(/\s+/).filter((t) => t.length > 2);

  let score = 4;

  if (needle && haystack.includes(needle)) score += 2;
  else if (tokens.some((t) => haystack.includes(t))) score += 1;

  if (post.postType === "ask") score += 2;
  else if (post.postType === "show") score += 1;
  else if (post.postType === "comment") score += 1;

  if (INTENT_PHRASES.some((p) => haystack.includes(p))) score += 1;

  if (platform === "hn" && haystack.includes("ask hn")) score += 1;

  score = Math.max(1, Math.min(8, score));

  return {
    score,
    reason:
      "Puntuación estimada automática (IA no disponible). Revisá el post para confirmar intención.",
    intent_type: score >= 7 ? "seeking_solution" : "other",
  };
}
