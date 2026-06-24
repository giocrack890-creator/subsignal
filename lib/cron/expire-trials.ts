/** Baja a free los trials Starter del survey que ya vencieron */

import { createAdminClient } from "@/lib/supabase/admin";

export interface ExpireTrialsResult {
  expiredCount: number;
}

export async function expireTrials(): Promise<ExpireTrialsResult> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update({ plan: "free", trial_ends_at: null })
    .eq("plan", "starter")
    .is("payment_subscription_id", null)
    .not("trial_ends_at", "is", null)
    .lt("trial_ends_at", now)
    .select("id");

  if (error) {
    throw new Error(`Error expirando trials: ${error.message}`);
  }

  return { expiredCount: data?.length ?? 0 };
}
