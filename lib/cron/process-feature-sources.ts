/** Pipeline de feature_sources (RSS, GitHub, App Store, Slack) */

import { enrichSignalFromPost } from "@/lib/intelligence/enrich-signal";
import { ACTIVE_PLATFORMS } from "@/lib/monitors/types";
import { scorePost } from "@/lib/scoring";
import {
  fetchFromSource,
  sourceTypeToPlatform,
  type FeatureSourceConfig,
  type FeatureSourceType,
} from "@/lib/sources";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Platform } from "@/types";

export interface ProcessFeatureSourcesResult {
  sourcesProcessed: number;
  postsFetched: number;
  signalsCreated: number;
  errors: string[];
}

export async function processFeatureSources(): Promise<ProcessFeatureSourcesResult> {
  const supabase = createAdminClient();
  const result: ProcessFeatureSourcesResult = {
    sourcesProcessed: 0,
    postsFetched: 0,
    signalsCreated: 0,
    errors: [],
  };

  const { data: sources, error } = await supabase
    .from("feature_sources")
    .select("id, user_id, source_type, config, is_active")
    .eq("is_active", true);

  if (error || !sources?.length) return result;

  for (const source of sources) {
    result.sourcesProcessed++;
    const sourceType = source.source_type as FeatureSourceType;
    const config = (source.config ?? {}) as FeatureSourceConfig;
    const platform = sourceTypeToPlatform(sourceType) as Platform;

    const { data: keywords } = await supabase
      .from("keywords")
      .select(
        `
        id, term, exclude_terms, keyword_type, language, synonyms,
        profiles!inner (min_intent_score, language_filter, sandbox_mode),
        user_products!inner (name, description, target_customer, pain_points)
      `
      )
      .eq("user_id", source.user_id)
      .eq("is_active", true);

    if (!keywords?.length) continue;

    for (const kw of keywords) {
      const profile = kw.profiles as {
        min_intent_score: number;
        language_filter: string;
        sandbox_mode: boolean;
      };
      const product = kw.user_products as {
        name: string;
        description: string | null;
        target_customer: string | null;
        pain_points: string[];
      };

      if (profile.sandbox_mode) continue;

      let posts;
      try {
        posts = await fetchFromSource(sourceType, kw.term, config);
        result.postsFetched += posts.length;
      } catch (e) {
        result.errors.push(`${sourceType}: ${e instanceof Error ? e.message : String(e)}`);
        continue;
      }

      for (const post of posts) {
        const { data: existing } = await supabase
          .from("signals")
          .select("id")
          .eq("user_id", source.user_id)
          .eq("platform", platform)
          .eq("external_id", post.externalId)
          .maybeSingle();

        if (existing) continue;

        let scoreResult;
        try {
          scoreResult = await scorePost({
            post,
            product,
            keyword: kw.term,
            platform: ACTIVE_PLATFORMS.includes(platform) ? platform : "hn",
          });
        } catch {
          continue;
        }

        const enriched = enrichSignalFromPost({
          post,
          platform: ACTIVE_PLATFORMS.includes(platform) ? platform : "hn",
          keyword: {
            term: kw.term,
            keywordType: (kw.keyword_type as "product" | "competitor") ?? "product",
            excludeTerms: (kw.exclude_terms as string[]) ?? [],
            synonyms: (kw.synonyms as string[]) ?? [],
            language: (kw.language as "any" | "en" | "es") ?? "any",
          },
          scoreResult,
        });

        if ("skip" in enriched) continue;
        if (enriched.intent_score < profile.min_intent_score) continue;

        const { error: insertError } = await supabase.from("signals").insert({
          user_id: source.user_id,
          keyword_id: kw.id,
          platform,
          external_id: post.externalId,
          title: post.title,
          body: post.body,
          author: post.author,
          url: post.url,
          intent_score: enriched.intent_score,
          intent_reason: enriched.intent_reason,
          intent_type: enriched.intent_type,
          is_buyer_intent: enriched.is_buyer_intent,
          semantic_cluster: enriched.semantic_cluster,
          hot_score: enriched.hot_score,
          reply_window_ends_at: enriched.reply_window_ends_at,
          reply_window_hours: enriched.reply_window_hours,
          status: "new",
        });

        if (!insertError) result.signalsCreated++;
      }
    }
  }

  return result;
}

/** Ingest manual desde Google Alerts email forward */
export async function ingestGoogleAlert(input: {
  userId: string;
  title: string;
  body: string;
  url: string;
}): Promise<{ created: boolean; signalId?: string }> {
  const supabase = createAdminClient();
  const externalId = `ga_${Buffer.from(input.url).toString("base64url").slice(0, 40)}`;

  const { data: dup } = await supabase
    .from("source_ingest_log")
    .select("id")
    .eq("user_id", input.userId)
    .eq("source_type", "google_alerts")
    .eq("external_id", externalId)
    .maybeSingle();

  if (dup) return { created: false };

  const { data: keyword } = await supabase
    .from("keywords")
    .select("id")
    .eq("user_id", input.userId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const { data: signal, error } = await supabase
    .from("signals")
    .insert({
      user_id: input.userId,
      keyword_id: keyword?.id ?? null,
      platform: "google_alert",
      external_id: externalId,
      title: input.title,
      body: input.body,
      url: input.url,
      intent_score: 7,
      intent_reason: "Ingestado desde Google Alerts",
      status: "new",
      is_buyer_intent: true,
    })
    .select("id")
    .single();

  if (error || !signal) return { created: false };

  await supabase.from("source_ingest_log").insert({
    user_id: input.userId,
    source_type: "google_alerts",
    external_id: externalId,
  });

  return { created: true, signalId: signal.id };
}
