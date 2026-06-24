import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;

export interface KeywordPerformance {
  keywordId: string;
  term: string;
  signals7d: number;
  signals30d: number;
  avgScore: number | null;
  createdAt: string;
}

export async function fetchKeywordPerformance(
  supabase: Client,
  userId: string
): Promise<KeywordPerformance[]> {
  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);

  const [{ data: keywords }, { data: signals }] = await Promise.all([
    supabase
      .from("keywords")
      .select("id, term, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("signals")
      .select("keyword_id, found_at, intent_score")
      .eq("user_id", userId)
      .gte("found_at", since30.toISOString())
      .not("keyword_id", "is", null),
  ]);

  if (!keywords?.length) return [];

  const since7Iso = since7.toISOString();
  const stats = new Map<
    string,
    { signals7d: number; signals30d: number; scoreTotal: number; scoreCount: number }
  >();

  for (const signal of signals ?? []) {
    if (!signal.keyword_id) continue;
    const row = stats.get(signal.keyword_id) ?? {
      signals7d: 0,
      signals30d: 0,
      scoreTotal: 0,
      scoreCount: 0,
    };
    row.signals30d += 1;
    if (signal.found_at >= since7Iso) row.signals7d += 1;
    if (signal.intent_score != null) {
      row.scoreTotal += signal.intent_score;
      row.scoreCount += 1;
    }
    stats.set(signal.keyword_id, row);
  }

  return keywords.map((keyword) => {
    const row = stats.get(keyword.id);
    return {
      keywordId: keyword.id,
      term: keyword.term,
      signals7d: row?.signals7d ?? 0,
      signals30d: row?.signals30d ?? 0,
      avgScore:
        row && row.scoreCount > 0
          ? Math.round((row.scoreTotal / row.scoreCount) * 10) / 10
          : null,
      createdAt: keyword.created_at,
    };
  });
}
