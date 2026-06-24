/** Webhook outbound cuando score ≥ umbral */

import { createAdminClient } from "@/lib/supabase/admin";

export async function fireOutboundWebhook(input: {
  userId: string;
  signalId: string;
  score: number;
  title: string | null;
  platform: string;
  url: string;
}): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("api_webhook_url, api_webhook_min_score")
    .eq("id", input.userId)
    .single();

  const webhookUrl = profile?.api_webhook_url;
  const minScore = profile?.api_webhook_min_score ?? 9;

  if (!webhookUrl || input.score < minScore) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "signal.high_intent",
        signal_id: input.signalId,
        score: input.score,
        title: input.title,
        platform: input.platform,
        url: input.url,
        timestamp: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("[webhook-outbound] Error:", error);
    return false;
  }
}
