"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useUpgradeModalOptional } from "@/components/billing/upgrade-provider";
import { generateDraftForSignal } from "@/lib/actions/signals";
import { Button } from "@/components/ui/button";

interface GenerateDraftButtonProps {
  signalId: string;
  hasDraft: boolean;
}

export function GenerateDraftButton({
  signalId,
  hasDraft,
}: GenerateDraftButtonProps) {
  const router = useRouter();
  const upgradeModal = useUpgradeModalOptional();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  if (hasDraft) {
    return (
      <Link href={`/drafts?signal=${signalId}`}>
        <Button variant="accent" size="sm" type="button" className="dash-btn-neon">
          Ver borrador
        </Button>
      </Link>
    );
  }

  function handleGenerate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setLimitReached(false);

    startTransition(async () => {
      const result = await generateDraftForSignal(signalId);
      if (!result.success) {
        setError(result.error ?? "No se pudo generar el borrador");
        setLimitReached(Boolean(result.limitReached));
        return;
      }
      router.push(`/drafts?signal=${signalId}`);
      router.refresh();
    });
  }

  function handleUpgradeClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (upgradeModal) {
      upgradeModal.openUpgrade("ai_drafts", error ?? undefined);
      return;
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="accent"
        size="sm"
        type="button"
        disabled={isPending}
        onClick={handleGenerate}
        className="gap-1.5 dash-btn-neon"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Generando…
          </>
        ) : (
          "Generar borrador"
        )}
      </Button>
      {error && (
        <p className="max-w-xs text-xs text-destructive">
          {error}
          {limitReached && (
            <>
              {" "}
              {upgradeModal ? (
                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  className="text-primary hover:underline"
                >
                  Ver planes
                </button>
              ) : (
                <Link href="/pricing?upgrade=starter" className="text-primary hover:underline">
                  Ver planes
                </Link>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
