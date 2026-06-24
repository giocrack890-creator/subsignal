"use client";

import { CountUp } from "@/components/signals/count-up";
import { cn } from "@/lib/utils";

interface DashboardHomeHeaderProps {
  displayName: string;
  keywordCount: number;
  totalSignals: number;
  plan: "free" | "starter" | "growth" | "pro";
}

function formatHomeDate(): string {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function DashboardHomeHeader({
  displayName,
  keywordCount,
  totalSignals,
  plan,
}: DashboardHomeHeaderProps) {
  const firstName = displayName.split(/[\s@]/)[0] || "ahí";
  const monitoringText =
    keywordCount > 0
      ? `Monitoreando ${keywordCount} keyword${keywordCount !== 1 ? "s" : ""} en Hacker News`
      : "Configurá keywords para empezar a detectar señales";

  return (
    <header className="border-b border-border-sutil pb-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B6B6B]">
        {formatHomeDate()}
      </p>

      <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white md:text-[32px]">
            Hola, {firstName}
          </h1>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
            {monitoringText}
            {plan === "free" && (
              <span className="text-[#4B4B4B]"> · Reddit en Starter</span>
            )}
          </p>
        </div>

        <div className="md:text-right">
          <p
            className={cn(
              "text-5xl font-bold tabular-nums leading-none tracking-[-0.03em]",
              totalSignals > 0 ? "text-accent" : "text-[#6B6B6B]"
            )}
          >
            <CountUp value={totalSignals} />
          </p>
          <p className="mt-1 text-xs text-[#6B6B6B]">señales detectadas</p>
        </div>
      </div>
    </header>
  );
}
