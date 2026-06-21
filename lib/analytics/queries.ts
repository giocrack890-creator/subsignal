import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export interface AnalyticsData {
  totalSignals: number;
  repliedCount: number;
  responseRate: number;
  signalsByDay: { date: string; label: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  topKeywords: { term: string; count: number }[];
  conversions: { clicks: number; signups: number; paid: number } | null;
  hasEnoughData: boolean;
}

type Client = SupabaseClient<Database>;

function formatDayLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function last30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function fetchAnalytics(
  supabase: Client,
  userId: string
): Promise<{ data: AnalyticsData | null; error: string | null }> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [signalsResult, keywordsResult, conversionsResult] = await Promise.all([
    supabase
      .from("signals")
      .select("id, found_at, intent_score, status, keyword_id")
      .eq("user_id", userId)
      .gte("found_at", since.toISOString()),
    supabase.from("keywords").select("id, term").eq("user_id", userId),
    supabase
      .from("conversions")
      .select("clicks, signups, paid_conversions")
      .eq("user_id", userId),
  ]);

  const queryError =
    signalsResult.error?.message ??
    keywordsResult.error?.message ??
    conversionsResult.error?.message ??
    null;

  if (queryError) {
    return { data: null, error: queryError };
  }

  const signals = signalsResult.data ?? [];
  const keywords = keywordsResult.data ?? [];
  const conversionsRows = conversionsResult.data ?? [];

  const totalSignals = signals.length;
  const repliedCount = signals.filter((s) => s.status === "replied").length;
  const responseRate =
    totalSignals > 0 ? Math.round((repliedCount / totalSignals) * 100) : 0;

  const dayMap = new Map<string, number>();
  for (const day of last30Days()) {
    dayMap.set(day, 0);
  }
  for (const s of signals) {
    const day = s.found_at.slice(0, 10);
    if (dayMap.has(day)) {
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    }
  }
  const signalsByDay = last30Days().map((date) => ({
    date,
    label: formatDayLabel(date),
    count: dayMap.get(date) ?? 0,
  }));

  const scoreBuckets = [
    { range: "1-3", min: 1, max: 3, count: 0 },
    { range: "4-6", min: 4, max: 6, count: 0 },
    { range: "7-8", min: 7, max: 8, count: 0 },
    { range: "9-10", min: 9, max: 10, count: 0 },
  ];
  for (const s of signals) {
    const score = s.intent_score;
    if (score == null) continue;
    const bucket = scoreBuckets.find((b) => score >= b.min && score <= b.max);
    if (bucket) bucket.count++;
  }
  const scoreDistribution = scoreBuckets.map(({ range, count }) => ({
    range,
    count,
  }));

  const keywordTerms = new Map(keywords.map((k) => [k.id, k.term]));
  const keywordCounts = new Map<string, number>();
  for (const s of signals) {
    if (!s.keyword_id) continue;
    const term = keywordTerms.get(s.keyword_id) ?? "Sin keyword";
    keywordCounts.set(term, (keywordCounts.get(term) ?? 0) + 1);
  }
  const topKeywords = [...keywordCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let conversions: AnalyticsData["conversions"] = null;
  if (conversionsRows.length > 0) {
    conversions = conversionsRows.reduce(
      (acc, row) => ({
        clicks: acc.clicks + row.clicks,
        signups: acc.signups + row.signups,
        paid: acc.paid + row.paid_conversions,
      }),
      { clicks: 0, signups: 0, paid: 0 }
    );
    if (
      conversions.clicks === 0 &&
      conversions.signups === 0 &&
      conversions.paid === 0
    ) {
      conversions = null;
    }
  }

  const hasEnoughData = totalSignals >= 3;

  return {
    data: {
      totalSignals,
      repliedCount,
      responseRate,
      signalsByDay,
      scoreDistribution,
      topKeywords,
      conversions,
      hasEnoughData,
    },
    error: null,
  };
}
