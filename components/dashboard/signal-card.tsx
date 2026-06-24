"use client";

import { ExternalLink } from "lucide-react";
import { DismissSignalButton } from "@/components/dashboard/dismiss-signal-button";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { useSignalPanelOptional } from "@/components/dashboard/signal-panel-context";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate, cn } from "@/lib/utils";
import { getSignalOutboundUrl } from "@/lib/tracking/urls";
import type { Plan, Platform, Signal } from "@/types";

interface SignalCardProps {
  signal: Signal;
  plan: Plan;
  className?: string;
}

export function SignalCard({ signal, plan, className }: SignalCardProps) {
  const panel = useSignalPanelOptional();
  const score = signal.intent_score ?? 0;
  const hasDraft = Boolean(signal.draft_reply?.trim());
  const bodyText = signal.body ?? signal.intent_reason ?? "";

  const outboundUrl = getSignalOutboundUrl(signal, plan);

  function handleOpenPost(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    window.open(outboundUrl, "_blank", "noopener,noreferrer");
  }

  function handleCardClick() {
    if (panel) {
      panel.openSignal(signal);
      return;
    }
    window.open(outboundUrl, "_blank", "noopener,noreferrer");
  }

  const isNew = signal.status === "new";

  return (
    <article
      className={cn(
        "dash-card dash-card-interactive group cursor-pointer p-5 transition-shadow duration-200",
        isNew && "border-l-2 border-l-primary",
        signal.status === "dismissed" && "opacity-60",
        className
      )}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir señal: ${signal.title ?? "Sin título"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={signal.platform as Platform} />
          {signal.status !== "new" && (
            <span className="dash-chip uppercase">{signal.status}</span>
          )}
          {isNew && <span className="dash-neon-tag">Nueva</span>}
          {hasDraft && plan !== "free" && (
            <span
              className="dash-neon-tag"
              title="Esta señal tiene un borrador listo para copiar"
            >
              Draft listo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ScoreBadge score={score} />
          <span className="text-xs text-foreground-muted">
            {formatRelativeTime(signal.found_at)}
          </span>
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground">
        {signal.title ?? "Sin título"}
      </h3>

      {bodyText && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">
          {truncate(bodyText, 160)}
        </p>
      )}

      <div
        className="dash-signal-actions mt-4 flex flex-wrap items-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DismissSignalButton
          signalId={signal.id}
          disabled={signal.status === "dismissed"}
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleOpenPost}
          className="ml-auto gap-1 border-white/10"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Abrir post
        </Button>
      </div>
    </article>
  );
}
