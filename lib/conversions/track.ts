import { createAdminClient } from "@/lib/supabase/admin";

export async function recordSignalClick(signalId: string): Promise<string | null> {
  const supabase = createAdminClient();

  const { data: signal } = await supabase
    .from("signals")
    .select("id, user_id, url")
    .eq("id", signalId)
    .maybeSingle();

  if (!signal?.url) return null;

  const { data: existing } = await supabase
    .from("conversions")
    .select("id, clicks")
    .eq("signal_id", signalId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("conversions")
      .update({ clicks: (existing.clicks ?? 0) + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("conversions").insert({
      user_id: signal.user_id,
      signal_id: signalId,
      utm_campaign: "threadpulse",
      clicks: 1,
    });
  }

  return signal.url;
}
