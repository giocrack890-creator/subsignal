"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { dismissSignal } from "@/lib/actions/signals";
import { SignalDraftSection } from "@/components/dashboard/signal-draft-section";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate, cn } from "@/lib/utils";
import type { Plan, Platform, Signal } from "@/types";

interface SignalCardProps {
  signal: Signal;
  plan: Plan;
  className?: string;
  expandable?: boolean;
}

export function SignalCard({
  signal,
  plan,
  className,
  expandable = true,
}: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const score = signal.intent_score ?? 0;
  const hasDraft = Boolean(signal.draft_reply?.trim());
  const bodyText = signal.body ?? signal.intent_reason ?? "";

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await dismissSignal(signal.id);
    });
  }

  function handleOpenPost(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    window.open(signal.url, "_blank", "noopener,noreferrer");
  }

  function handleCardClick() {
    if (expandable) {
      setExpanded((v) => !v);
    } else {
      window.open(signal.url, "_blank", "noopener,noreferrer");
    }
  }

  const isNew = signal.status === "new";

  return (
    <article
      className={cn(
        "dash-card dash-card-interactive group cursor-pointer p-5 transition-shadow duration-200",
        isNew && "border-l-2 border-l-primary",
        isPending && "opacity-60",
        expanded && "border-primary/30",
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
      aria-expanded={expandable ? expanded : undefined}
      aria-label={`${expanded ? "Colapsar" : "Expandir"}: ${signal.title ?? "Sin título"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={signal.platform as Platform} />
          {signal.status !== "new" && (
            <span className="dash-chip uppercase">{signal.status}</span>
          )}
          {isNew && <span className="dash-neon-tag">Nueva</span>}
          {hasDraft && (
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
          {expandable && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-foreground-muted transition-transform",
                expanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground">
        {signal.title ?? "Sin título"}
      </h3>

      {!expanded && bodyText && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">
          {truncate(bodyText, 160)}
        </p>
      )}

      <div className="mt-3 max-w-xs">
        <ScoreBar score={score} />
      </div>

      {expanded && bodyText && (
        <div
          className="dash-signal-preview -mx-5 mt-4 px-5 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm leading-relaxed text-foreground-secondary whitespace-pre-wrap">
            {bodyText}
          </p>
          {signal.intent_reason && signal.body && (
            <p className="mt-3 text-xs text-foreground-muted italic">
              IA: {signal.intent_reason}
            </p>
          )}
        </div>
      )}

      <SignalDraftSection signal={signal} plan={plan} />

      <div
        className="dash-signal-actions mt-4 flex flex-wrap items-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={isPending || signal.status === "dismissed"}
          onClick={handleDismiss}
          className="text-foreground-muted"
        >
          Descartar
        </Button>
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
