"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanNowButtonProps {
  hasKeywords: boolean;
}

export function ScanNowButton({ hasKeywords }: ScanNowButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!hasKeywords) return null;

  function handleScan() {
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/scan", { method: "POST" });
        const data = (await res.json()) as {
          ok?: boolean;
          signalsCreated?: number;
          postsFetched?: number;
          errors?: string[];
          error?: string;
        };

        if (!res.ok) {
          setMessage(data.error ?? "No se pudo escanear");
          return;
        }

        const created = data.signalsCreated ?? 0;
        const fetched = data.postsFetched ?? 0;
        setMessage(
          created > 0
            ? `Listo: ${created} señal${created === 1 ? "" : "es"} nueva${created === 1 ? "" : "s"} (${fetched} posts revisados)`
            : `Escaneo listo: ${fetched} posts revisados, ninguno superó tu score mínimo`
        );

        if (created > 0) {
          window.setTimeout(() => window.location.reload(), 1500);
        }
      } catch {
        setMessage("Error de red al escanear");
      }
    });
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleScan}
        disabled={isPending}
        className="gap-2"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {isPending ? "Escaneando..." : "Escanear ahora"}
      </Button>
      {message && (
        <p className="max-w-sm text-center text-[12px] leading-relaxed text-[#B4B4B4]">
          {message}
        </p>
      )}
    </div>
  );
}
