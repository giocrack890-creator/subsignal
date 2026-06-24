"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { dismissSignalWithReason } from "@/lib/actions/signals";
import { getScoreColor } from "@/components/dashboard/score-badge";
import { useSignalPanelOptional } from "@/components/dashboard/signal-panel-context";
import { Tooltip } from "@/components/ui/tooltip";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { SignalIntelligenceBadges } from "@/components/signals/signal-intelligence-badges";
import { UndoDismissButton } from "@/components/signals/undo-dismiss-button";
import { formatRelativeTime, cn } from "@/lib/utils";
import { assessShillRisk, shillRiskLabel } from "@/lib/shill/heuristics";
import { getSignalOutboundUrl } from "@/lib/tracking/urls";
import type { Plan, Platform, Signal } from "@/types";

export type SignalListView = "list" | "cards";

interface SignalListCardProps {
  signal: Signal;
  plan: Plan;
  view: SignalListView;
  animationDelay?: number;
  className?: string;
}

const DISMISS_REASONS = [
  { value: "not_target", label: "No es mi cliente objetivo" },
  { value: "already_replied", label: "Ya respondí este post" },
  { value: "wrong_problem", label: "El problema no es el que resuelvo" },
] as const;

export function SignalListCard({
  signal,
  plan,
  view,
  animationDelay = 0,
  className,
}: SignalListCardProps) {
  const panel = useSignalPanelOptional();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const score = signal.intent_score ?? 0;
  const scoreColor = getScoreColor(score);
  const hasDraft = Boolean(signal.draft_reply?.trim()) && plan !== "free";
  const bodyText = signal.body ?? signal.intent_reason ?? "";
  const isList = view === "list";
  const isDismissed = signal.status === "dismissed";
  const shillRisk = signal.author_meta?.shill_risk
    ? {
        risk: signal.author_meta.shill_risk,
        reasons: signal.author_meta.shill_reasons ?? [],
      }
    : assessShillRisk({
        author: signal.author,
        title: signal.title,
        body: signal.body,
        platform: signal.platform,
      });

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const outboundUrl = getSignalOutboundUrl(signal, plan);

  function openPanel() {
    if (panel) {
      panel.openSignal(signal);
      return;
    }
    window.open(outboundUrl, "_blank", "noopener,noreferrer");
  }

  function handleDismiss(reason: string) {
    setMenuOpen(false);
    startTransition(async () => {
      await dismissSignalWithReason(signal.id, reason);
    });
  }

  return (
    <article
      className={cn(
        "signals-card-enter group cursor-pointer rounded-[10px] border border-border-medio bg-nivel-3 transition-all duration-200 ease-out hover:border-border-activo hover:bg-nivel-4",
        isList ? "px-4 py-0" : "px-5 py-4",
        isPending && "opacity-60",
        isDismissed && "opacity-55",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={openPanel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPanel();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir señal: ${signal.title ?? "Sin título"}`}
    >
      <div
        className={cn(
          "flex items-center gap-4",
          isList ? "h-12" : "min-h-[88px]"
        )}
      >
        {/* Zona izquierda — score */}
        <div
          className={cn(
            "relative flex shrink-0 flex-col items-center justify-center",
            isList ? "w-12" : "w-16"
          )}
        >
          <span
            className={cn(
              "font-bold tabular-nums leading-none",
              isList ? "text-xl" : "text-3xl"
            )}
            style={{ color: scoreColor }}
          >
            {score}
          </span>
          <span className="text-[10px] text-[#6B6B6B]">/10</span>
          {score >= 9 && (
            <span
              className="signals-score-glow absolute -bottom-1 h-2 w-8 rounded-full blur-md"
              style={{ backgroundColor: scoreColor }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Zona central */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <PlatformBadge platform={signal.platform as Platform} />
            <span className="text-[#6B6B6B]" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-[#6B6B6B]">
              {formatRelativeTime(signal.found_at)}
            </span>
            {hasDraft && (
              <span className="rounded-full bg-[rgba(52,211,153,0.1)] px-2 py-0.5 text-[10px] font-medium text-[#34D399]">
                Draft listo ✍️
              </span>
            )}
            {signal.status === "replied" && (
              <span className="rounded-full bg-[rgba(52,211,153,0.08)] px-2 py-0.5 text-[10px] font-medium text-[#86EFAC]">
                Respondida ✓
              </span>
            )}
            {signal.status === "new" && (
              <span className="rounded-full bg-[rgba(52,211,153,0.12)] px-2 py-0.5 text-[10px] font-medium text-[#34D399]">
                Nueva
              </span>
            )}
            {shillRisk && (
              <Tooltip content={shillRisk.reasons.join(" · ")}>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    shillRisk.risk === "high"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-warning/15 text-warning"
                  )}
                >
                  {shillRiskLabel(shillRisk.risk)}
                </span>
              </Tooltip>
            )}
          </div>

          <h3
            className={cn(
              "line-clamp-2 font-medium text-white",
              isList ? "text-sm leading-snug" : "mt-1 text-base"
            )}
          >
            {signal.title ?? "Sin título"}
          </h3>

          {!isList && bodyText && (
            <p className="mt-1 line-clamp-1 text-sm text-[#6B6B6B]">
              {bodyText.slice(0, 120)}
              {bodyText.length > 120 ? "…" : ""}
            </p>
          )}
          <div className="mt-1.5">
            <SignalIntelligenceBadges signal={signal} compact={isList} />
          </div>
          {isDismissed && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <UndoDismissButton signalId={signal.id} />
            </div>
          )}
        </div>

        {/* Zona derecha */}
        <div
          className="flex shrink-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {!isList && (
            <Tooltip content={hasDraft ? "Abrir draft" : "Ver señal"}>
              <button
                type="button"
                onClick={openPanel}
                className="hidden rounded-lg border border-border-activo bg-nivel-4 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-nivel-5 sm:inline-block"
              >
                {hasDraft ? "Ver draft" : "Ver señal"}
              </button>
            </Tooltip>
          )}

          <div ref={menuRef} className="relative">
            <Tooltip content="Más opciones">
              <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#1E1E1E] hover:text-white"
              aria-label="Más opciones"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            </Tooltip>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-lg border border-[#232323] bg-[#1A1A1A] py-1 shadow-xl">
                <button
                  type="button"
                  className="block w-full px-3.5 py-2 text-left text-sm text-[#B4B4B4] hover:bg-[#232323]"
                  onClick={() => {
                    setMenuOpen(false);
                    openPanel();
                  }}
                >
                  Marcar como respondida
                </button>
                {DISMISS_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    disabled={isDismissed || isPending}
                    className="block w-full px-3.5 py-2 text-left text-sm text-[#B4B4B4] hover:bg-[#232323] disabled:opacity-40"
                    onClick={() => handleDismiss(reason.value)}
                  >
                    {reason.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="block w-full px-3.5 py-2 text-left text-sm text-[#B4B4B4] hover:bg-[#232323]"
                  onClick={() => {
                    setMenuOpen(false);
                    window.open(outboundUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  Abrir original ↗
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
