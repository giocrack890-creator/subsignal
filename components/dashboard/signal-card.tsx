"use client";

import { useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { dismissSignal } from "@/lib/actions/signals";
import { GenerateDraftButton } from "@/components/dashboard/generate-draft-button";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate, cn } from "@/lib/utils";
import type { Platform, Signal } from "@/types";

interface SignalCardProps {
  signal: Signal;
  className?: string;
}

export function SignalCard({ signal, className }: SignalCardProps) {
  const [isPending, startTransition] = useTransition();
  const score = signal.intent_score ?? 0;
  const hasDraft = Boolean(signal.draft_reply?.trim());

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await dismissSignal(signal.id);
    });
  }

  function handleOpenPost() {
    window.open(signal.url, "_blank", "noopener,noreferrer");
  }

  return (
    <article
      className={cn(
        "landing-card group cursor-pointer rounded-2xl p-5 transition-shadow duration-200",
        isPending && "opacity-60",
        className
      )}
      onClick={handleOpenPost}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenPost();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir post: ${signal.title ?? "Sin título"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={signal.platform as Platform} />
          {signal.status !== "new" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
              {signal.status}
            </span>
          )}
        </div>
        <span className="text-xs text-foreground-muted">
          {formatRelativeTime(signal.found_at)}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-foreground">
        {signal.title ?? "Sin título"}
      </h3>

      {(signal.body || signal.intent_reason) && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground-secondary">
          {truncate(signal.body ?? signal.intent_reason ?? "", 220)}
        </p>
      )}

      <div className="mt-4 max-w-xs">
        <ScoreBar score={score} />
      </div>

      <div
        className="mt-4 flex flex-wrap items-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <GenerateDraftButton signalId={signal.id} hasDraft={hasDraft} />
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
        <span className="ml-auto hidden items-center gap-1 text-xs text-foreground-muted sm:inline-flex">
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Abrir post
        </span>
      </div>
    </article>
  );
}
