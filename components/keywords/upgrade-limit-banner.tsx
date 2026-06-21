"use client";

import { Lock } from "lucide-react";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { UpgradeTrigger } from "@/components/billing/upgrade-trigger";
import type { Plan } from "@/types";

interface UpgradeLimitBannerProps {
  plan: Plan;
  maxKeywords: number;
}

export function UpgradeLimitBanner({ plan, maxKeywords }: UpgradeLimitBannerProps) {
  const message =
    maxKeywords === Infinity
      ? "Necesitás un plan superior para agregar más keywords."
      : `Tu plan ${plan} permite hasta ${maxKeywords} keywords activas.`;

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
          <Lock className="h-5 w-5 text-warning" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">
              Límite de keywords alcanzado
            </p>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
            {message} Actualizá tu plan para monitorear más términos en paralelo.
          </p>
          <div className="mt-4">
            <UpgradeTrigger feature="keywords" message={message} />
          </div>
        </div>
      </div>
    </div>
  );
}
