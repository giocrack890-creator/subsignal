import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Signal } from "@/types";

type Client = SupabaseClient<Database>;

export async function fetchRelatedSignals(
  supabase: Client,
  userId: string,
  signal: Pick<Signal, "id" | "keyword_id">
): Promise<Signal[]> {
  if (!signal.keyword_id) return [];

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .eq("user_id", userId)
    .eq("keyword_id", signal.keyword_id)
    .neq("id", signal.id)
    .gte("found_at", since.toISOString())
    .order("intent_score", { ascending: false })
    .limit(3);

  if (error || !data) return [];
  return data as Signal[];
}
