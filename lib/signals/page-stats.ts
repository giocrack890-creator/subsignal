import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Plan } from "@/types";

type Client = SupabaseClient<Database>;

export interface SignalsPageStats {
  totalCount: number;
  signalsThisWeek: number;
  avgScore: number | null;
  draftsReady: number;
  repliedCount: number;
}

export interface SignalsEmptyContext {
  activeKeywords: number;
  monitoringActive: boolean;
  platformsLabel: string;
}

export async function fetchSignalsPageStats(
  supabase: Client,
  userId: string
): Promise<SignalsPageStats> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [
    { count: totalCount },
    { count: signalsThisWeek },
    { data: scoreRows },
    { count: draftsReady },
    { count: repliedCount },
  ] = await Promise.all([
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("found_at", weekAgo.toISOString()),
    supabase
      .from("signals")
      .select("intent_score")
      .eq("user_id", userId)
      .gte("found_at", monthAgo.toISOString())
      .not("intent_score", "is", null),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("draft_reply", "is", null)
      .neq("draft_reply", "")
      .neq("status", "replied")
      .neq("status", "dismissed"),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "replied"),
  ]);

  let avgScore: number | null = null;
  if (scoreRows && scoreRows.length > 0) {
    const sum = scoreRows.reduce((acc, row) => acc + (row.intent_score ?? 0), 0);
    avgScore = Math.round((sum / scoreRows.length) * 10) / 10;
  }

  return {
    totalCount: totalCount ?? 0,
    signalsThisWeek: signalsThisWeek ?? 0,
    avgScore,
    draftsReady: draftsReady ?? 0,
    repliedCount: repliedCount ?? 0,
  };
}

export async function fetchSignalsEmptyContext(
  supabase: Client,
  userId: string,
  plan: Plan
): Promise<SignalsEmptyContext> {
  const [{ count: activeKeywords }, { data: cronLog }] = await Promise.all([
    supabase
      .from("keywords")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),
    supabase
      .from("cron_logs")
      .select("ran_at")
      .order("ran_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const monitoringActive = cronLog?.ran_at
    ? Date.now() - new Date(cronLog.ran_at).getTime() < 2 * 60 * 60 * 1000
    : false;

  const platformsLabel =
    plan === "free"
      ? "HN activo · Reddit, X e IH en planes de pago"
      : "HN y Reddit activos";

  return {
    activeKeywords: activeKeywords ?? 0,
    monitoringActive,
    platformsLabel,
  };
}
