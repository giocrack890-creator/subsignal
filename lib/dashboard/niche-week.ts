import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;

export interface NicheWeekInsight {
  keywordId: string;
  term: string;
  count: number;
  hasHighIntent: boolean;
}

export async function fetchNicheWeekInsights(
  supabase: Client,
  userId: string
): Promise<NicheWeekInsight[]> {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: signals, error } = await supabase
    .from("signals")
    .select("keyword_id, intent_score, keywords(term)")
    .eq("user_id", userId)
    .gte("found_at", since.toISOString())
    .not("keyword_id", "is", null);

  if (error || !signals?.length) return [];

  const grouped = new Map<
    string,
    { term: string; count: number; hasHighIntent: boolean }
  >();

  for (const row of signals) {
    if (!row.keyword_id) continue;
    const keywords = row.keywords as { term: string } | { term: string }[] | null;
    const term = Array.isArray(keywords)
      ? keywords[0]?.term
      : keywords?.term;
    if (!term) continue;

    const existing = grouped.get(row.keyword_id) ?? {
      term,
      count: 0,
      hasHighIntent: false,
    };
    existing.count += 1;
    if ((row.intent_score ?? 0) >= 9) existing.hasHighIntent = true;
    grouped.set(row.keyword_id, existing);
  }

  return [...grouped.entries()]
    .filter(([, value]) => value.count >= 2)
    .map(([keywordId, value]) => ({
      keywordId,
      term: value.term,
      count: value.count,
      hasHighIntent: value.hasHighIntent,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}
