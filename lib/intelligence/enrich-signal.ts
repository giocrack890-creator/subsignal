/** Enriquecimiento de señales — aplica toda la inteligencia al pipeline */

import type { RawPost } from "@/lib/monitors/types";
import type { IntentScoreResult, Platform } from "@/types";
import { detectBuyerIntent, buyerIntentBoost } from "./buyer-intent";
import { matchesNegativeTerms } from "./negative-keywords";
import { detectCompetitorMention } from "./competitor-radar";
import { computeReplyWindow } from "./reply-window";
import { computeHotScore } from "./hot-score";
import { detectSemanticCluster } from "./semantic-clusters";
import { detectLanguage, detectGeoRegion } from "./language-geo";

export interface KeywordIntelConfig {
  term: string;
  keywordType: "product" | "competitor";
  excludeTerms: string[];
  synonyms: string[];
  language: "any" | "en" | "es";
}

export interface EnrichedSignalMeta {
  intent_score: number;
  intent_reason: string;
  intent_type: string;
  is_buyer_intent: boolean;
  semantic_cluster: string | null;
  detected_language: string;
  geo_region: string | null;
  churn_detected: boolean;
  competitor_mentioned: string | null;
  reply_window_ends_at: string;
  reply_window_hours: number;
  hot_score: number;
  skip_reason: string | null;
}

export function enrichSignalFromPost(input: {
  post: RawPost;
  platform: Platform;
  keyword: KeywordIntelConfig;
  scoreResult: IntentScoreResult;
  foundAt?: string;
}): EnrichedSignalMeta | { skip: true; reason: string } {
  const fullText = `${input.post.title ?? ""} ${input.post.body ?? ""}`;
  const foundAt = input.foundAt ?? new Date().toISOString();

  const negative = matchesNegativeTerms(fullText, input.keyword.excludeTerms);
  if (negative.excluded) {
    return { skip: true, reason: `Excluido por keyword negativa: "${negative.matchedTerm}"` };
  }

  const buyer = detectBuyerIntent(fullText);
  const competitor = detectCompetitorMention({
    text: fullText,
    competitorTerm: input.keyword.term,
    keywordType: input.keyword.keywordType,
  });

  let score = input.scoreResult.score;
  score += buyerIntentBoost(buyer.matchedPhrases.length);
  if (competitor.churnDetected) score += 1;
  if (input.keyword.keywordType === "competitor" && competitor.isNegative) score += 1;
  score = Math.min(10, Math.max(1, score));

  const language = detectLanguage(fullText);
  const replyWindow = computeReplyWindow(input.platform, new Date(foundAt));

  const enriched: EnrichedSignalMeta = {
    intent_score: score,
    intent_reason: input.scoreResult.reason,
    intent_type: input.scoreResult.intent_type,
    is_buyer_intent: buyer.isBuyer,
    semantic_cluster: detectSemanticCluster(fullText),
    detected_language: language,
    geo_region: detectGeoRegion(fullText),
    churn_detected: competitor.churnDetected,
    competitor_mentioned: competitor.mentioned ? competitor.competitorName : null,
    reply_window_ends_at: replyWindow.endsAt,
    reply_window_hours: replyWindow.hours,
    hot_score: computeHotScore({
      intentScore: score,
      platform: input.platform,
      foundAt,
      isBuyerIntent: buyer.isBuyer,
    }),
    skip_reason: null,
  };

  return enriched;
}
