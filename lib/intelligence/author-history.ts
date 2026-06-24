/** Historial de autor — tracking cross-posts */

import { createAdminClient } from "@/lib/supabase/admin";
import { detectSemanticCluster } from "@/lib/intelligence/semantic-clusters";

export async function upsertAuthorHistory(input: {
  userId: string;
  author: string;
  platform: string;
  text: string;
}): Promise<{ mentionCount: number; topics: string[] }> {
  if (!input.author?.trim()) {
    return { mentionCount: 0, topics: [] };
  }

  const supabase = createAdminClient();
  const topic = detectSemanticCluster(input.text);

  const { data: existing } = await supabase
    .from("author_history")
    .select("id, mention_count, topics")
    .eq("user_id", input.userId)
    .eq("author", input.author)
    .eq("platform", input.platform)
    .maybeSingle();

  const topics = existing?.topics ?? [];
  if (topic && !topics.includes(topic)) topics.push(topic);

  if (existing) {
    await supabase
      .from("author_history")
      .update({
        mention_count: (existing.mention_count ?? 0) + 1,
        topics,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    return { mentionCount: (existing.mention_count ?? 0) + 1, topics };
  }

  await supabase.from("author_history").insert({
    user_id: input.userId,
    author: input.author,
    platform: input.platform,
    mention_count: 1,
    topics: topic ? [topic] : [],
  });

  return { mentionCount: 1, topics: topic ? [topic] : [] };
}

export async function getAuthorHistorySummary(
  userId: string,
  author: string,
  platform: string
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("author_history")
    .select("mention_count, topics")
    .eq("user_id", userId)
    .eq("author", author)
    .eq("platform", platform)
    .maybeSingle();

  if (!data || data.mention_count < 2) return null;

  const topics = (data.topics as string[])?.join(", ") ?? "varios temas";
  return `Este user ya preguntó ${data.mention_count} veces este mes (${topics})`;
}
