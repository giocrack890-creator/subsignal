"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { Button } from "@/components/ui/button";
import { getCheckoutUrl } from "@/lib/payments/checkout";
import {
  getPlanCatalog,
  getRecommendedPlan,
  getUpgradeCopy,
  type LimitFeature,
} from "@/lib/payments/plans";
import type { Plan } from "@/types";

interface UpgradeModalProps {
  currentPlan: Plan;
  feature: LimitFeature;
  message?: string;
  onClose: () => void;
}

export function UpgradeModal({
  currentPlan,
  feature,
  message,
  onClose,
}: UpgradeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const targetPlan = getRecommendedPlan(currentPlan, feature);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  if (!targetPlan) {
    return null;
  }

  const copy = getUpgradeCopy(feature, targetPlan);
  const target = getPlanCatalog(targetPlan);
  const checkoutUrl = getCheckoutUrl(targetPlan);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-background-elevated p-0 text-foreground shadow-2xl backdrop:bg-black/70 open:animate-in"
      onClose={onClose}
    >
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
              <PlanBadge plan={currentPlan} />
            </div>
            {message && (
              <p className="mt-2 text-sm text-destructive">{message}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              {copy.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-foreground-muted transition hover:bg-white/5 hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="landing-card rounded-xl border-primary/20 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Recomendado
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground">{target.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{target.priceLabel}</p>
              <p className="text-xs text-foreground-muted">{target.periodLabel}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {target.features.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground-secondary"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Quizás después
        </Button>
        <Link href={checkoutUrl} className="cursor-pointer" onClick={onClose}>
          <Button variant="accent" size="sm" className="w-full gap-1.5 sm:w-auto">
            Ver {target.name}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </dialog>
  );
}
