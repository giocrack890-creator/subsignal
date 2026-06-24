"use client";

import { SEMANTIC_CLUSTER_LABELS } from "@/lib/intelligence/semantic-clusters";
import { isReplyWindowOpen } from "@/lib/intelligence/reply-window";
import type { Signal } from "@/types";

interface SignalIntelligenceBadgesProps {
  signal: Signal;
  compact?: boolean;
}

export function SignalIntelligenceBadges({
  signal,
  compact = false,
}: SignalIntelligenceBadgesProps) {
  const badges: { label: string; className: string }[] = [];

  if (signal.is_buyer_intent) {
    badges.push({ label: "Comprador", className: "bg-emerald-500/15 text-emerald-400" });
  }

  if (signal.churn_detected) {
    badges.push({ label: "Churn", className: "bg-red-500/15 text-red-400" });
  }

  if (signal.competitor_mentioned) {
    badges.push({
      label: compact ? "Comp." : `Comp: ${signal.competitor_mentioned}`,
      className: "bg-orange-500/15 text-orange-400",
    });
  }

  if (signal.semantic_cluster) {
    const label =
      SEMANTIC_CLUSTER_LABELS[signal.semantic_cluster] ?? signal.semantic_cluster;
    badges.push({ label, className: "bg-violet-500/15 text-violet-400" });
  }

  if (signal.cluster_id) {
    badges.push({ label: "Fusionada", className: "bg-sky-500/15 text-sky-400" });
  }

  if (signal.geo_region) {
    badges.push({ label: signal.geo_region, className: "bg-amber-500/15 text-amber-400" });
  }

  if (signal.reply_window_ends_at && !isReplyWindowOpen(signal.reply_window_ends_at)) {
    badges.push({ label: "Ventana cerrada", className: "bg-zinc-500/15 text-zinc-400" });
  } else if (signal.reply_window_ends_at) {
    badges.push({ label: "Urgente", className: "bg-rose-500/15 text-rose-400" });
  }

  if (signal.is_lead) {
    badges.push({
      label: signal.lead_stage ? `Lead · ${signal.lead_stage}` : "Lead",
      className: "bg-primary/15 text-primary",
    });
  }

  if (signal.author_meta?.author_history_note) {
    badges.push({ label: "Autor recurrente", className: "bg-yellow-500/15 text-yellow-400" });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${b.className}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
