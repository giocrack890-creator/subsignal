"use client";

import { useEffect, useState, useTransition } from "react";
import { ExternalLink, Loader2, X } from "lucide-react";
import {
  generateDraftForSignal,
  markDraftCopied,
  markSignalReplied,
} from "@/lib/actions/signals";
import { DismissSignalButton } from "@/components/dashboard/dismiss-signal-button";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { computeReplyWindow, isReplyWindowOpen } from "@/lib/intelligence/reply-window";
import { getSignalOutboundUrl } from "@/lib/tracking/urls";
import { formatRelativeTime } from "@/lib/utils";
import { CrmLitePanel } from "@/components/signals/crm-lite-panel";
import { SignalIntelligenceBadges } from "@/components/signals/signal-intelligence-badges";
import type { Plan, Platform, Signal } from "@/types";

interface SignalPanelProps {
  signal: Signal | null;
  plan: Plan;
  onClose: () => void;
  onSignalChange: (signal: Signal) => void;
}

interface RelatedSignal {
  id: string;
  title: string | null;
  found_at: string;
  intent_score: number | null;
}

export function SignalPanel({
  signal,
  plan,
  onClose,
  onSignalChange,
}: SignalPanelProps) {
  const [visible, setVisible] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [copied, setCopied] = useState(false);
  const [replyUrl, setReplyUrl] = useState("");
  const [related, setRelated] = useState<RelatedSignal[]>([]);
  const [regenerations, setRegenerations] = useState(0);
  const [tweetThread, setTweetThread] = useState<string[]>([]);
  const [translated, setTranslated] = useState<{ title: string; body: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isPaid = plan !== "free";
  const outboundUrl = signal ? getSignalOutboundUrl(signal, plan) : "";
  const hasDraft = Boolean(draftText.trim());
  const score = signal?.intent_score ?? 0;

  useEffect(() => {
    if (signal) {
      requestAnimationFrame(() => setVisible(true));
      setDraftText(signal.draft_reply ?? "");
      setRegenerations(signal.draft_regenerations ?? 0);
      setCopied(false);
      setReplyUrl("");

      fetch(`/api/signals/related?signalId=${signal.id}`)
        .then((res) => res.json())
        .then((data: { signals?: RelatedSignal[] }) => {
          setRelated(data.signals ?? []);
        })
        .catch(() => setRelated([]));
    } else {
      setVisible(false);
    }
  }, [signal]);

  function handleClose() {
    setVisible(false);
    window.setTimeout(onClose, 250);
  }

  function handleCopy() {
    if (!signal || !draftText.trim()) return;
    void navigator.clipboard.writeText(draftText.trim()).then(() => {
      setCopied(true);
      void markDraftCopied(signal.id, draftText.trim());
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRegenerate() {
    if (!signal || regenerations >= 3) return;
    startTransition(async () => {
      const result = await generateDraftForSignal(signal.id, { regenerate: true });
      if (result.success && result.draft) {
        setDraftText(result.draft);
        setRegenerations((n) => n + 1);
        onSignalChange({ ...signal, draft_reply: result.draft });
      }
    });
  }

  function handleMarkReplied() {
    if (!signal || !replyUrl.trim().startsWith("http")) return;
    startTransition(async () => {
      const result = await markSignalReplied(signal.id, replyUrl);
      if (result.success) handleClose();
    });
  }

  if (!signal) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l border-[#232323] bg-[#0D0D0D] shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de señal"
      >
        <div className="sticky top-0 z-10 border-b border-[#232323] bg-[#0D0D0D] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={signal.platform as Platform} />
              <ScoreBadge score={score} size="sm" />
              <span className="text-xs text-[#6B6B6B]">
                {formatRelativeTime(signal.found_at)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1 text-[#6B6B6B] hover:bg-white/5 hover:text-white"
              aria-label="Cerrar panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <h2 className="text-xl font-bold text-white">
            {signal.title ?? "Sin título"}
          </h2>
          <div className="mt-2">
            <SignalIntelligenceBadges signal={signal} />
          </div>
          {signal.reply_window_ends_at && (
            <p
              className={`mt-2 text-sm ${
                isReplyWindowOpen(signal.reply_window_ends_at)
                  ? "text-amber-400"
                  : "text-[#6B6B6B]"
              }`}
            >
              {computeReplyWindow(signal.platform, new Date(signal.found_at)).urgencyLabel}
            </p>
          )}
          {signal.author_meta?.author_history_note && (
            <p className="mt-2 text-sm text-yellow-400/90">
              {signal.author_meta.author_history_note}
            </p>
          )}
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#B4B4B4]">
            {signal.body ?? signal.intent_reason ?? "Sin contenido"}
          </p>
          <a
            href={outboundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#34D399] hover:underline"
          >
            Ver post original ↗
          </a>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={aiLoading}
              onClick={() => {
                if (!signal) return;
                setAiLoading(true);
                void fetch("/api/signals/translate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ signalId: signal.id, targetLanguage: "es" }),
                })
                  .then((r) => r.json())
                  .then((d: { translated?: { title: string; body: string } }) => {
                    if (d.translated) setTranslated(d.translated);
                  })
                  .finally(() => setAiLoading(false));
              }}
            >
              Traducir
            </Button>
            {(signal.platform === "hn" || signal.platform === "rss") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={aiLoading}
                onClick={() => {
                  setAiLoading(true);
                  void fetch("/api/signals/tweet-thread", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ signalId: signal.id }),
                  })
                    .then((r) => r.json())
                    .then((d: { tweets?: string[] }) => setTweetThread(d.tweets ?? []))
                    .finally(() => setAiLoading(false));
                }}
              >
                Thread 3 tweets
              </Button>
            )}
          </div>

          {translated && (
            <div className="mt-4 rounded-lg border border-[#232323] bg-[#111714] p-3 text-sm text-[#B4B4B4]">
              <p className="font-medium text-white">{translated.title}</p>
              <p className="mt-2 whitespace-pre-wrap">{translated.body}</p>
            </div>
          )}

          {tweetThread.length > 0 && (
            <div className="mt-4 space-y-2">
              {tweetThread.map((tweet, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#232323] bg-[#111714] p-3 text-sm text-[#E5E5E5]"
                >
                  <span className="text-xs text-[#6B6B6B]">{i + 1}/3</span>
                  <p className="mt-1">{tweet}</p>
                </div>
              ))}
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#232323]" />
            <span className="text-xs uppercase tracking-wider text-[#6B6B6B]">
              Draft de respuesta
            </span>
            <div className="h-px flex-1 bg-[#232323]" />
          </div>

          {!isPaid ? (
            <div className="rounded-xl border border-[#232323] bg-[#111714] p-4 text-center">
              <p className="text-sm font-medium text-white">
                🔒 Draft disponible en planes de pago
              </p>
              <a
                href="/pricing"
                className="mt-3 inline-block text-sm font-medium text-[#34D399] hover:underline"
              >
                Ver planes →
              </a>
            </div>
          ) : hasDraft || draftText ? (
            <div className="space-y-3">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={6}
                className="min-h-[120px] resize-y border-[rgba(52,211,153,0.25)] bg-[#111714] text-sm text-white shadow-[0_0_20px_rgba(52,211,153,0.08)]"
              />
              <Button
                type="button"
                variant="accent"
                className="w-full dash-btn-neon"
                onClick={handleCopy}
              >
                {copied ? "¡Copiado! ✓" : "Copiar respuesta"}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/20"
                  disabled={isPending || regenerations >= 3}
                  onClick={handleRegenerate}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Regenerar ↻"
                  )}
                </Button>
              </div>
              <p className="text-xs text-[#6B6B6B]">
                Regeneraciones: {regenerations}/3
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#6B6B6B]">
              Todavía no hay borrador para esta señal.
            </p>
          )}

          {related.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-medium tracking-wider text-[#6B6B6B] uppercase">
                Otros posts relacionados
              </p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg border border-[#232323] bg-[#161616] px-3.5 py-2.5 text-left transition-colors hover:border-[#34D399]/30"
                      onClick={() => {
                        fetch(`/api/signals/${item.id}`)
                          .then((res) => res.json())
                          .then((data: { signal?: Signal }) => {
                            if (data.signal) onSignalChange(data.signal);
                          })
                          .catch(() => undefined);
                      }}
                    >
                      <ScoreBadge score={item.intent_score ?? 0} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">
                          {item.title ?? "Sin título"}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {formatRelativeTime(item.found_at)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isPaid && <CrmLitePanel signal={signal} />}
        </div>

        <div className="sticky bottom-0 border-t border-[#232323] bg-[#0D0D0D] px-5 py-4">
          <div className="mb-3">
            <Input
              value={replyUrl}
              onChange={(e) => setReplyUrl(e.target.value)}
              placeholder="URL de tu respuesta publicada (opcional)"
              className="border-white/10 bg-[#111714] text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="accent"
              size="sm"
              disabled={!replyUrl.trim().startsWith("http") || isPending}
              onClick={handleMarkReplied}
              className="dash-btn-neon"
            >
              Marcar como respondida
            </Button>
            <DismissSignalButton
              signalId={signal.id}
              disabled={signal.status === "dismissed"}
              onDismissed={handleClose}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto gap-1 border-white/10"
              onClick={() => window.open(outboundUrl, "_blank")}
            >
              <ExternalLink className="h-3 w-3" />
              Abrir
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
