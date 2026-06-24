"use client";

import { CountUp } from "@/components/signals/count-up";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface SignalsHeaderProps {
  totalCount: number;
}

export function SignalsHeader({ totalCount }: SignalsHeaderProps) {
  const hasSignals = totalCount > 0;

  return (
    <PageHeader
      title="Señales"
      subtitle="Respondé en 30 segundos — cada señal incluye un borrador listo para copiar."
      action={
        <div className="sm:text-right">
          <p
            className={cn(
              "text-5xl font-bold tabular-nums leading-none tracking-[-0.03em]",
              hasSignals ? "text-accent" : "text-[#6B6B6B]"
            )}
          >
            <CountUp value={totalCount} />
          </p>
          <p className="mt-1 text-xs text-[#6B6B6B]">señales en total</p>
        </div>
      }
    />
  );
}
