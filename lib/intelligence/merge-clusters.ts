/** Fusión de clusters en DB */

import { createAdminClient } from "@/lib/supabase/admin";
import { shouldMergeSignals } from "@/lib/intelligence/signal-cluster";
import type { Platform } from "@/types";

export async function tryMergeIntoCluster(input: {
  userId: string;
  signalId: string;
  title: string | null;
  platform: Platform;
  foundAt: string;
}): Promise<string | null> {
  const supabase = createAdminClient();

  const since = new Date();
  since.setDate(since.getDate() - 3);

  const { data: recent } = await supabase
    .from("signals")
    .select("id, title, platform, found_at, cluster_id")
    .eq("user_id", input.userId)
    .gte("found_at", since.toISOString())
    .neq("id", input.signalId)
    .is("cluster_id", null)
    .limit(50);

  for (const candidate of recent ?? []) {
    if (
      !shouldMergeSignals({
        titleA: input.title,
        titleB: candidate.title,
        foundAtA: input.foundAt,
        foundAtB: candidate.found_at,
        platformA: input.platform,
        platformB: candidate.platform as Platform,
      })
    ) {
      continue;
    }

    let clusterId = candidate.cluster_id;

    if (!clusterId) {
      const { data: cluster } = await supabase
        .from("signal_clusters")
        .insert({
          user_id: input.userId,
          canonical_signal_id: candidate.id,
          canonical_title: candidate.title,
          platform_count: 1,
        })
        .select("id")
        .single();

      clusterId = cluster?.id ?? null;
      if (clusterId) {
        await supabase
          .from("signals")
          .update({ cluster_id: clusterId })
          .eq("id", candidate.id);

        await supabase.from("cluster_members").insert({
          cluster_id: clusterId,
          signal_id: candidate.id,
          platform: candidate.platform,
        });
      }
    }

    if (!clusterId) continue;

    await supabase.from("cluster_members").insert({
      cluster_id: clusterId,
      signal_id: input.signalId,
      platform: input.platform,
    });

    await supabase
      .from("signals")
      .update({ cluster_id: clusterId })
      .eq("id", input.signalId);

    const { count } = await supabase
      .from("cluster_members")
      .select("*", { count: "exact", head: true })
      .eq("cluster_id", clusterId);

    await supabase
      .from("signal_clusters")
      .update({
        platform_count: count ?? 2,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clusterId);

    return clusterId;
  }

  return null;
}
