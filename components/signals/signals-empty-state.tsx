"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RadarIcon } from "@/components/dashboard/radar-icon";
import { ScanNowButton } from "@/components/dashboard/scan-now-button";
import type { SignalsEmptyContext } from "@/lib/signals/page-stats";
import { cn } from "@/lib/utils";

interface SignalsEmptyStateProps {
  context: SignalsEmptyContext;
  variant?: "no-signals" | "no-results";
  className?: string;
}

type IndicatorState = "ok" | "warn" | "pending";

function StatusDot({ state }: { state: IndicatorState }) {
  const colors = {
    ok: "bg-accent",
    warn: "bg-[#FBBF24]",
    pending: "bg-nivel-5",
  };
  return (
    <span
      className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", colors[state])}
      aria-hidden="true"
    />
  );
}

function CheckRow({
  state,
  children,
}: {
  state: IndicatorState;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <StatusDot state={state} />
      <span className="text-[12px] leading-relaxed text-[#B4B4B4]">{children}</span>
    </li>
  );
}

export function SignalsEmptyState({
  context,
  variant = "no-signals",
  className,
}: SignalsEmptyStateProps) {
  const [minutesUntilNext, setMinutesUntilNext] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cron/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { minutesAgo?: number | null } | null) => {
        if (data?.minutesAgo != null) {
          const remaining = Math.max(0, 15 - (data.minutesAgo % 15));
          setMinutesUntilNext(remaining === 0 ? 15 : remaining);
        } else {
          setMinutesUntilNext(15);
        }
      })
      .catch(() => setMinutesUntilNext(15));
  }, []);

  if (variant === "no-results") {
    return (
      <div className={cn("mx-auto mt-16 max-w-md px-4 text-center", className)}>
        <div className="mx-auto flex justify-center">
          <RadarIcon className="dash-radar-wrap-lg" />
        </div>
        <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.02em] text-white">
          No hay señales que coincidan
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6B6B6B]">
          Probá con otros filtros o limpiá la búsqueda.
        </p>
        <Link
          href="/signals"
          className="mt-6 inline-block text-[12px] text-accent hover:underline"
        >
          Limpiar filtros →
        </Link>
      </div>
    );
  }

  const hasKeywords = context.activeKeywords > 0;
  const cronNeverRan = !context.lastCronAt;
  const cronStale = !context.monitoringActive && !cronNeverRan;

  return (
    <div className={cn("mx-auto mt-16 max-w-md px-4 text-center", className)}>
      <div className="mx-auto flex justify-center">
        <RadarIcon className="dash-radar-wrap-lg" />
      </div>

      <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.02em] text-white">
        {cronNeverRan ? "El escaneo aún no corrió" : "Monitoreando en background"}
      </h3>
      <p className="mt-3 text-[13px] leading-[1.7] text-[#6B6B6B]">
        {cronNeverRan ? (
          <>
            Tus keywords están guardadas, pero el cron todavía no ejecutó una
            búsqueda. En producción corre cada 15 minutos automáticamente.
          </>
        ) : (
          <>
            Escaneamos tus plataformas cada 15 minutos.
            <br />
            Solo ves señales con score ≥ tu umbral en Settings.
          </>
        )}
      </p>

      <ul className="mt-8 space-y-2.5 text-left">
        <CheckRow state={hasKeywords ? "ok" : "pending"}>
          {hasKeywords ? (
            <>
              {context.activeKeywords} keyword
              {context.activeKeywords !== 1 ? "s" : ""} activa
              {context.activeKeywords !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              Sin keywords —{" "}
              <Link href="/keywords" className="text-accent hover:underline">
                Configurar keywords →
              </Link>
            </>
          )}
        </CheckRow>

        <CheckRow state={context.monitoringActive ? "ok" : cronNeverRan ? "warn" : "pending"}>
          {context.monitoringActive
            ? "Último escaneo hace menos de 2 horas"
            : cronNeverRan
              ? "Sin escaneos registrados todavía"
              : "Último escaneo hace más de 2 horas"}
        </CheckRow>

        <CheckRow state="ok">{context.platformsLabel}</CheckRow>
      </ul>

      {context.monitoringActive && minutesUntilNext != null && (
        <p className="mt-5 font-mono text-[11px] text-[#4B4B4B]">
          Próxima búsqueda en ~{minutesUntilNext} minutos
        </p>
      )}

      {cronStale && (
        <p className="mt-5 text-[12px] leading-relaxed text-amber-400/90">
          Si esto persiste, verificá que el cron esté activo en Vercel y que{" "}
          <code className="text-[11px]">ANTHROPIC_API_KEY</code> sea válida.
        </p>
      )}

      <ScanNowButton hasKeywords={hasKeywords} />
    </div>
  );
}
