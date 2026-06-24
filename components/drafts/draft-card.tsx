"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { markSignalReplied, markDraftCopied, saveDraftReply } from "@/lib/actions/signals";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { Platform, Signal } from "@/types";

interface DraftCardProps {
  signal: Signal;
  highlighted?: boolean;
}

const MAX_CHARS = 2000;

export function DraftCard({ signal, highlighted = false }: DraftCardProps) {
  const [draft, setDraft] = useState(signal.draft_reply ?? "");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [postCollapsed, setPostCollapsed] = useState(false);
  const [replyUrl, setReplyUrl] = useState(signal.reply_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isReplied = signal.status === "replied";
  const score = signal.intent_score ?? 0;
  const charCount = draft.length;

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveDraftReply(signal.id, draft);
      if (!result.success) {
        setError(result.error ?? "Error al guardar");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      void markDraftCopied(signal.id, draft);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar al portapapeles");
    }
  }

  function handleMarkReplied(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await markSignalReplied(signal.id, replyUrl);
      if (!result.success) {
        setError(result.error ?? "Error al guardar");
        return;
      }
      setShowReplyForm(false);
    });
  }

  return (
    <article
      id={`draft-${signal.id}`}
      className={`dash-card overflow-hidden ${highlighted ? "border-glow-card" : ""} ${isPending ? "opacity-70" : ""}`}
    >
      <div className="dash-draft-split">
        {/* Post original — izquierda */}
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <button
            type="button"
            onClick={() => setPostCollapsed((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between gap-2 border-b border-white/5 bg-background-elevated/40 px-5 py-3 text-left lg:hidden"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Post original
            </span>
            <ChevronDown
              className={`h-4 w-4 text-foreground-muted transition-transform ${postCollapsed ? "" : "rotate-180"}`}
            />
          </button>
          <div className={`px-5 py-4 ${postCollapsed ? "hidden lg:block" : ""}`}>
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-foreground-muted lg:block">
              Post original
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={signal.platform as Platform} />
              {signal.intent_score != null && <ScoreBadge score={score} size="sm" />}
              <span className="text-xs text-foreground-muted">
                {formatRelativeTime(signal.found_at)}
              </span>
              {isReplied && <span className="dash-neon-tag">Publicado</span>}
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground line-clamp-3">
              {signal.title ?? "Sin título"}
            </h3>
            {(signal.body || signal.intent_reason) && (
              <p className="mt-2 text-xs leading-relaxed text-foreground-muted line-clamp-4">
                {truncate(signal.body ?? signal.intent_reason ?? "", 280)}
              </p>
            )}
            <Link
              href={signal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver post original
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Editor — derecha */}
        <div className="flex flex-col">
          <div className="border-b border-white/5 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Tu borrador
            </p>
          </div>
          <div className="flex-1 px-5 py-4">
            <Textarea
              id={`draft-${signal.id}-textarea`}
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
              onBlur={handleSave}
              rows={8}
              className="min-h-[160px] border-white/10 bg-background-card-hover focus:border-primary/50 focus:ring-primary/20"
              placeholder="Editá tu respuesta antes de publicar…"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-foreground-muted">
              <span>{charCount} / {MAX_CHARS} caracteres</span>
              {error && <span className="text-destructive">{error}</span>}
            </div>

            {draft.trim() && signal.platform === "hn" && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  Preview HN
                </p>
                <div className="dash-hn-preview">
                  <strong>{signal.author ?? "usuario"}</strong>
                  <span className="text-foreground-muted"> · hace un momento</span>
                  <p className="mt-2 text-foreground-secondary whitespace-pre-wrap">
                    {draft}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar fija */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background-elevated/30 px-5 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!draft.trim()}
          className="gap-1.5 border-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copiar
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isPending}
        >
          {saved ? "Guardado" : "Guardar"}
        </Button>
        {!isReplied && (
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="dash-btn-neon"
          >
            Marcar publicado
          </Button>
        )}
        {isReplied && signal.reply_url && (
          <Link
            href={signal.reply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-foreground-muted hover:text-primary"
          >
            Ver respuesta →
          </Link>
        )}
      </div>

      {showReplyForm && !isReplied && (
        <form
          onSubmit={handleMarkReplied}
          className="border-t border-border bg-background-elevated/20 px-5 py-4"
        >
          <label
            htmlFor={`reply-url-${signal.id}`}
            className="mb-2 block text-xs font-medium text-foreground-secondary"
          >
            URL de tu respuesta publicada
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id={`reply-url-${signal.id}`}
              value={replyUrl}
              onChange={(e) => setReplyUrl(e.target.value)}
              placeholder="https://news.ycombinator.com/item?id=..."
              required
              className="flex-1 border-white/10"
            />
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>
              Confirmar
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}
