"use client";

import { useState, useTransition } from "react";
import { cancelSubscription } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";

export function CancelSubscriptionButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    if (
      !confirm(
        "¿Cancelar tu suscripción? Vas a mantener acceso hasta el fin del período actual."
      )
    ) {
      return;
    }

    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await cancelSubscription();
      if (!result.success) {
        setError(result.error ?? "No se pudo cancelar");
        return;
      }
      setMessage(result.message ?? "Suscripción cancelada");
    });
  }

  return (
    <div className="mt-4 space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleCancel}
        className="border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        {isPending ? "Cancelando…" : "Cancelar suscripción"}
      </Button>
      {message && <p className="text-sm text-accent">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
