import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getPlanLimits } from "@/lib/payments/plans";
import type { Plan } from "@/types";

type Client = SupabaseClient<Database>;

export interface DashboardHomeStats {
  newCount: number;
  keywordCount: number;
  maxKeywords: number;
  signalsLast24h: number;
  totalSignals: number;
  draftsReady: number;
}

export async function fetchDashboardHomeStats(
  supabase: Client,
  userId: string,
  plan: Plan
): Promise<DashboardHomeStats> {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const limits = getPlanLimits(plan);

  const [
    { count: newCount },
    { count: keywordCount },
    { count: signalsLast24h },
    { count: totalSignals },
    { count: draftsReady },
  ] = await Promise.all([
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "new"),
    supabase
      .from("keywords")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("found_at", since24h),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("draft_reply", "is", null)
      .neq("draft_reply", "")
      .neq("status", "replied")
      .neq("status", "dismissed"),
  ]);

  return {
    newCount: newCount ?? 0,
    keywordCount: keywordCount ?? 0,
    maxKeywords: limits.maxKeywords === Infinity ? 999 : limits.maxKeywords,
    signalsLast24h: signalsLast24h ?? 0,
    totalSignals: totalSignals ?? 0,
    draftsReady: draftsReady ?? 0,
  };
}
