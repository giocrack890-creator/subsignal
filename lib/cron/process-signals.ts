/** Orquestador del pipeline: fetch → score → guardar → notificar */

import { getAppUrl } from "@/lib/auth/urls";
import { generateDraftReply, checkDraftLimit } from "@/lib/drafts";
import { isPlatformNotImplementedError } from "@/lib/monitors/errors";
import { getMonitor } from "@/lib/monitors";
import { ACTIVE_PLATFORMS } from "@/lib/monitors/types";
import type { RawPost } from "@/lib/monitors/types";
import { sendNotification, type NotificationPayload } from "@/lib/notifications";
import { scorePost } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase/admin";
import { truncate } from "@/lib/utils";
import type { Platform, Plan } from "@/types";

export interface ProcessSignalsResult {
  keywordsProcessed: number;
  postsFetched: number;
  postsScored: number;
  signalsCreated: number;
  notificationsSent: number;
  skippedAlreadyProcessed: number;
  errors: string[];
}

interface KeywordRow {
  id: string;
  user_id: string;
  product_id: string;
  term: string;
  platforms: Platform[];
  is_active: boolean;
  profiles: {
    email: string | null;
    plan: Plan;
    min_intent_score: number;
    notify_email: boolean;
    notify_slack: boolean;
    slack_webhook_url: string | null;
  };
  user_products: {
    name: string;
    description: string | null;
    target_customer: string | null;
    pain_points: string[];
  };
}

async function isAlreadyProcessed(
  userId: string,
  platform: Platform,
  externalId: string
): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: cached } = await supabase
    .from("processed_posts")
    .select("id")
    .eq("platform", platform)
    .eq("external_id", externalId)
    .eq("user_id", userId)
    .maybeSingle();

  if (cached) return true;

  const { data: existingSignal } = await supabase
    .from("signals")
    .select("id")
    .eq("user_id", userId)
    .eq("platform", platform)
    .eq("external_id", externalId)
    .maybeSingle();

  return Boolean(existingSignal);
}

async function markProcessed(
  userId: string,
  platform: Platform,
  externalId: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("processed_posts").upsert(
    {
      platform,
      external_id: externalId,
      user_id: userId,
    },
    { onConflict: "platform,external_id,user_id" }
  );
}

async function processPostForKeyword(
  post: RawPost,
  keyword: KeywordRow,
  platform: Platform,
  result: ProcessSignalsResult,
  pendingNotifications: Map<string, NotificationPayload>
): Promise<void> {
  const alreadyProcessed = await isAlreadyProcessed(
    keyword.user_id,
    platform,
    post.externalId
  );

  if (alreadyProcessed) {
    result.skippedAlreadyProcessed++;
    return;
  }

  result.postsScored++;

  let scoreResult;
  try {
    scoreResult = await scorePost({
      post,
      product: keyword.user_products,
      keyword: keyword.term,
      platform,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    result.errors.push(
      `Scoring falló (${keyword.term}/${post.externalId}): ${msg}`
    );
    return;
  }

  await markProcessed(keyword.user_id, platform, post.externalId);

  if (scoreResult.score < keyword.profiles.min_intent_score) {
    return;
  }

  const supabase = createAdminClient();
  const { data: signal, error: insertError } = await supabase
    .from("signals")
    .insert({
      user_id: keyword.user_id,
      keyword_id: keyword.id,
      platform,
      external_id: post.externalId,
      title: post.title,
      body: post.body,
      author: post.author,
      url: post.url,
      intent_score: scoreResult.score,
      intent_reason: scoreResult.reason,
      status: "new",
    })
    .select("id")
    .single();

  if (insertError || !signal?.id) {
    result.errors.push(
      `Insert signal falló (${post.externalId}): ${insertError?.message ?? "sin id"}`
    );
    return;
  }

  result.signalsCreated++;

  const profile = keyword.profiles;
  let draftUrl = `${getAppUrl()}/drafts?signal=${signal.id}`;

  const draftLimit = await checkDraftLimit(profile.plan, keyword.user_id);
  if (draftLimit.allowed) {
    try {
      const draft = await generateDraftReply({
        post: {
          title: post.title,
          body: post.body,
          platform,
          intent_reason: scoreResult.reason,
        },
        product: keyword.user_products,
      });

      await supabase
        .from("signals")
        .update({ draft_reply: draft })
        .eq("id", signal.id);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Draft falló (${post.externalId}): ${msg}`);
      draftUrl = `${getAppUrl()}/dashboard`;
    }
  } else {
    draftUrl = `${getAppUrl()}/dashboard`;
  }

  const wantsEmail = profile.notify_email && Boolean(profile.email);
  const wantsSlack =
    profile.notify_slack && Boolean(profile.slack_webhook_url?.trim());

  if (!wantsEmail && !wantsSlack) return;

  const excerpt = truncate(post.body ?? post.title ?? "", 160);

  const existing = pendingNotifications.get(keyword.user_id);
  const signalEntry = {
    signalId: signal.id,
    title: post.title,
    platform,
    score: scoreResult.score,
    excerpt,
    draftUrl,
    originalUrl: post.url,
  };

  if (existing) {
    existing.signals.push(signalEntry);
  } else {
    pendingNotifications.set(keyword.user_id, {
      userId: keyword.user_id,
      email: profile.email,
      plan: profile.plan,
      notifyEmail: profile.notify_email,
      notifySlack: profile.notify_slack,
      slackWebhookUrl: profile.slack_webhook_url,
      signals: [signalEntry],
    });
  }
}

export async function processSignals(): Promise<ProcessSignalsResult> {
  const supabase = createAdminClient();
  const result: ProcessSignalsResult = {
    keywordsProcessed: 0,
    postsFetched: 0,
    postsScored: 0,
    signalsCreated: 0,
    notificationsSent: 0,
    skippedAlreadyProcessed: 0,
    errors: [],
  };

  const pendingNotifications = new Map<string, NotificationPayload>();

  const { data: keywords, error: keywordsError } = await supabase
    .from("keywords")
    .select(
      `
      id,
      user_id,
      product_id,
      term,
      platforms,
      is_active,
      profiles!inner (
        email,
        plan,
        min_intent_score,
        notify_email,
        notify_slack,
        slack_webhook_url
      ),
      user_products!inner (
        name,
        description,
        target_customer,
        pain_points
      )
    `
    )
    .eq("is_active", true);

  if (keywordsError) {
    result.errors.push(`Error cargando keywords: ${keywordsError.message}`);
    return result;
  }

  if (!keywords?.length) {
    return result;
  }

  for (const rawKeyword of keywords) {
    const keyword = rawKeyword as unknown as KeywordRow;
    result.keywordsProcessed++;

    const platforms = keyword.platforms.filter((p) =>
      ACTIVE_PLATFORMS.includes(p)
    );

    for (const platform of platforms) {
      let posts: RawPost[] = [];

      try {
        const monitor = getMonitor(platform);
        posts = await monitor.fetchNewPosts(keyword.term, { maxResults: 15 });
        result.postsFetched += posts.length;
      } catch (error) {
        if (isPlatformNotImplementedError(error)) {
          result.errors.push(
            `${platform}: ${error.meta.implementationNotes}`
          );
          continue;
        }
        const msg = error instanceof Error ? error.message : String(error);
        result.errors.push(
          `Fetch ${platform} falló (keyword "${keyword.term}"): ${msg}`
        );
        continue;
      }

      for (const post of posts) {
        try {
          await processPostForKeyword(
            post,
            keyword,
            platform,
            result,
            pendingNotifications
          );
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          result.errors.push(
            `Post ${post.externalId} falló: ${msg}`
          );
        }
      }
    }
  }

  for (const payload of pendingNotifications.values()) {
    try {
      const sendResult = await sendNotification(payload);

      if (
        sendResult.emailSent ||
        sendResult.slackSent ||
        sendResult.consoleLogged
      ) {
        result.notificationsSent++;

        const alertedAt = new Date().toISOString();
        const supabase = createAdminClient();
        for (const s of payload.signals) {
          await supabase
            .from("signals")
            .update({ alerted_at: alertedAt })
            .eq("id", s.signalId);
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const recipient = payload.email ?? payload.userId;
      result.errors.push(`Notificación falló (${recipient}): ${msg}`);
    }
  }

  return result;
}
