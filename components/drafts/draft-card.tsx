"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import { markSignalReplied, saveDraftReply } from "@/lib/actions/signals";
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

export function DraftCard({ signal, highlighted = false }: DraftCardProps) {
  const [draft, setDraft] = useState(signal.draft_reply ?? "");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyUrl, setReplyUrl] = useState(signal.reply_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isReplied = signal.status === "replied";

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
      className={`landing-card rounded-2xl overflow-hidden ${highlighted ? "border-glow-card" : ""} ${isPending ? "opacity-70" : ""}`}
    >
      {/* Contexto del post */}
      <div className="border-b border-border bg-background-elevated/50 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <PlatformBadge platform={signal.platform as Platform} />
          {signal.intent_score != null && (
            <span className="rounded-md bg-primary-muted-bg px-2 py-0.5 text-xs font-bold text-primary">
              {signal.intent_score}/10
            </span>
          )}
          <span className="text-xs text-foreground-muted">
            {formatRelativeTime(signal.found_at)}
          </span>
          {isReplied && (
            <span className="rounded-full bg-primary-muted-bg px-2 py-0.5 text-[10px] font-medium text-primary">
              Publicado
            </span>
          )}
        </div>
        <h3 className="mt-2 text-sm font-semibold text-foreground-secondary line-clamp-2">
          {signal.title ?? "Sin título"}
        </h3>
        {(signal.body || signal.intent_reason) && (
          <p className="mt-1 text-xs leading-relaxed text-foreground-muted line-clamp-2">
            {truncate(signal.body ?? signal.intent_reason ?? "", 160)}
          </p>
        )}
        <Link
          href={signal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Ver post original
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {/* Borrador editable */}
      <div className="px-5 py-4">
        <label
          htmlFor={`draft-${signal.id}-textarea`}
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-foreground-muted"
        >
          Tu borrador
        </label>
        <Textarea
          id={`draft-${signal.id}-textarea`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          rows={6}
          className="bg-background-card-hover"
          placeholder="Editá tu respuesta antes de publicar…"
        />
        {error && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!draft.trim()}
          className="gap-1.5"
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
          {saved ? "Guardado" : "Guardar cambios"}
        </Button>
        {!isReplied && (
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Marcar como publicado
          </Button>
        )}
        {isReplied && signal.reply_url && (
          <Link
            href={signal.reply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-foreground-muted hover:text-primary"
          >
            Ver respuesta publicada →
          </Link>
        )}
      </div>

      {showReplyForm && !isReplied && (
        <form
          onSubmit={handleMarkReplied}
          className="border-t border-border bg-background-elevated/30 px-5 py-4"
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
              className="flex-1"
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
