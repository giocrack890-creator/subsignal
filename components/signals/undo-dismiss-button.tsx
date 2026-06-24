"use client";

import { useTransition } from "react";
import { undoDismissSignal } from "@/lib/actions/signals";
import { Button } from "@/components/ui/button";

export function UndoDismissButton({ signalId }: { signalId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          void undoDismissSignal(signalId);
        })
      }
      className="text-xs"
    >
      {isPending ? "Restaurando…" : "Deshacer dismiss"}
    </Button>
  );
}
