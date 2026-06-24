"use client";

import { useEffect, useState } from "react";
import { Check, Clipboard, Pencil, X } from "lucide-react";
import { markDraftCopied } from "@/lib/actions/signals";
import { DraftUpgradeModal } from "@/components/dashboard/draft-upgrade-modal";
import { GenerateDraftButton } from "@/components/dashboard/generate-draft-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { isPlanAtLeast } from "@/lib/payments/plans";
import { cn } from "@/lib/utils";
import type { Plan, Signal } from "@/types";
import { DRAFT_MIN_SCORE } from "@/lib/drafts/constants";

const FREE_PLACEHOLDER =
  "Hola — vi tu post y me resonó mucho. En nuestro equipo pasamos por algo parecido cuando escalamos el producto. Lo que nos funcionó fue automatizar el feedback de clientes sin perder el tono humano. Si te sirve, puedo contarte cómo lo resolvimos con una herramienta que armamos para founders como vos...";

interface SignalDraftSectionProps {
  signal: Signal;
  plan: Plan;
}

export function SignalDraftSection({ signal, plan }: SignalDraftSectionProps) {
  const score = signal.intent_score ?? 0;
  const isPaid = isPlanAtLeast(plan, "starter");
  const hasDraft = Boolean(signal.draft_reply?.trim());
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [editText, setEditText] = useState(signal.draft_reply ?? "");

  useEffect(() => {
    setEditText(signal.draft_reply ?? "");
  }, [signal.draft_reply]);

  if (score < DRAFT_MIN_SCORE) {
    return null;
  }

  const displayText = hasDraft ? signal.draft_reply!.trim() : "";
  const previewText = isPaid ? displayText : FREE_PLACEHOLDER;
  const lineClamp = !expanded && previewText.length > 280;

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    await markDraftCopied(signal.id, text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopy() {
    if (!isPaid || !displayText) return;
    void copyText(displayText);
  }

  function handleCopyEdited() {
    if (!editText.trim()) return;
    void copyText(editText.trim()).then(() => setEditOpen(false));
  }

  function openUpgradeModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setUpgradeOpen(true);
  }

  return (
    <>
      <div
        className="mt-4 border-t border-white/8 pt-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
          💬 Respuesta sugerida
        </p>

        {!isPaid ? (
          <div className="relative overflow-hidden rounded-lg">
            <div
              className="dash-draft-box select-none px-4 py-3 text-sm leading-relaxed text-foreground-secondary"
              style={{ filter: "blur(4px)" }}
              aria-hidden="true"
            >
              {previewText}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 px-4 text-center backdrop-blur-[2px]">
              <p className="text-sm font-medium text-foreground">
                🔒 Draft disponible en planes de pago
              </p>
              <Button
                variant="accent"
                size="sm"
                type="button"
                className="dash-btn-neon"
                onClick={openUpgradeModal}
              >
                Ver borrador
              </Button>
            </div>
          </div>
        ) : hasDraft ? (
          <>
            <div className="dash-draft-box px-4 py-3">
              <p
                className={cn(
                  "text-sm leading-relaxed text-foreground-secondary whitespace-pre-wrap",
                  lineClamp && "line-clamp-4"
                )}
              >
                {displayText}
              </p>
              {displayText.length > 280 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2 cursor-pointer text-xs font-medium text-primary hover:underline"
                >
                  {expanded ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={handleCopy}
                className="dash-btn-neon gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ¡Copiado! ✓
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                    Copiar respuesta
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="gap-1.5 text-foreground-muted"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Editar antes de copiar
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-4 text-center">
            <p className="text-sm text-foreground-secondary">
              Esta señal califica para borrador automático (score {score}+).
            </p>
            <div className="mt-3 flex justify-center">
              <GenerateDraftButton
                signalId={signal.id}
                hasDraft={false}
                plan={plan}
              />
            </div>
          </div>
        )}
      </div>

      <DraftUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />

      {editOpen && isPaid && (
        <>
          <div
            className="dash-sheet-backdrop dash-sheet-backdrop-open"
            onClick={() => setEditOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-[min(100%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`edit-draft-${signal.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                id={`edit-draft-${signal.id}`}
                className="text-lg font-bold text-foreground"
              >
                Editar respuesta
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-muted hover:bg-white/5"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="border-white/10 bg-background-card-hover focus:border-primary/50"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={handleCopyEdited}
                disabled={!editText.trim()}
                className="dash-btn-neon gap-1.5"
              >
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                Copiar versión editada
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
