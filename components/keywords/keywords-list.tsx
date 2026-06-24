"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteKeyword, toggleKeyword } from "@/lib/actions/keywords";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { Keyword, Plan, Platform } from "@/types";

interface KeywordsListProps {
  keywords: Keyword[];
  plan: Plan;
}

export function KeywordsList({ keywords, plan }: KeywordsListProps) {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  if (keywords.length === 0) {
    return (
      <EmptyState
        variant="radar"
        title="No tenés keywords todavía"
        description="Tocá «Agregar keyword» para empezar a monitorear conversaciones en Hacker News."
      />
    );
  }

  function handleToggle(id: string, current: boolean) {
    setActionError(null);
    startTransition(async () => {
      const result = await toggleKeyword(id, !current);
      if (!result.success) {
        setActionError(result.error ?? "No se pudo actualizar la keyword");
      }
    });
  }

  function handleDelete(id: string, term: string) {
    if (!confirm(`¿Eliminar la keyword "${term}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setActionError(null);
    startTransition(async () => {
      const result = await deleteKeyword(id);
      if (!result.success) {
        setActionError(result.error ?? "No se pudo eliminar la keyword");
      }
    });
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {keywords.map((kw) => (
          <li
            key={kw.id}
            className={`dash-card p-5 transition-opacity ${isPending ? "opacity-70" : ""} ${!kw.is_active ? "opacity-75" : ""}`}
          >
            <div className="flex h-full flex-col gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className={`text-lg font-black tracking-tight ${kw.is_active ? "text-foreground" : "text-foreground-secondary"}`}
                  >
                    {kw.term}
                  </h3>
                  {!kw.is_active && (
                    <span className="dash-chip uppercase">Pausada</span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {kw.platforms.map((p) => (
                    <PlatformBadge key={p} platform={p as Platform} />
                  ))}
                </div>

                {kw.subreddits.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {kw.subreddits.map((sub) => (
                      <span key={sub} className="dash-neon-tag">
                        r/{sub}
                      </span>
                    ))}
                  </div>
                )}

                {plan === "free" && kw.platforms.length === 1 && kw.platforms[0] === "hn" && (
                  <p className="mt-2 text-xs text-foreground-muted">
                    Monitoreo HN · escaneo diario
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={kw.is_active}
                    onChange={() => handleToggle(kw.id, kw.is_active)}
                    disabled={isPending}
                    aria-label={`${kw.is_active ? "Pausar" : "Activar"} keyword ${kw.term}`}
                  />
                  <span className="text-xs text-foreground-muted">
                    {kw.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(kw.id, kw.term)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                  aria-label={`Eliminar keyword ${kw.term}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
