"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { Button } from "@/components/ui/button";
import { getCheckoutUrl } from "@/lib/payments/checkout";
import { PLAN_CATALOG, PLAN_ORDER } from "@/lib/payments/plans";
import type { Plan } from "@/types";

interface PricingGridProps {
  highlightedPlan?: Plan;
  animated?: boolean;
  className?: string;
}

function PlanCard({
  planId,
  highlighted,
}: {
  planId: Plan;
  highlighted: boolean;
}) {
  const plan = PLAN_CATALOG[planId];
  const isFree = planId === "free";
  const href = isFree ? "/login" : getCheckoutUrl(planId);

  return (
    <article
      className={`landing-card relative flex h-full flex-col rounded-2xl p-6 ${
        highlighted || plan.highlight
          ? "pricing-highlight border-primary/40"
          : ""
      } ${highlighted ? "border-glow-card" : ""}`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Más elegido
        </span>
      )}

      <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{plan.priceLabel}</span>
        <span className="text-sm text-foreground-muted">{plan.periodLabel}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-foreground-secondary"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link href={href} className="mt-8 block cursor-pointer">
        <Button
          variant={highlighted || plan.highlight ? "accent" : "outline"}
          size="md"
          className="w-full"
        >
          {isFree ? "Empezar gratis" : `Elegir ${plan.name}`}
        </Button>
      </Link>
    </article>
  );
}

export function PricingGrid({
  highlightedPlan = "growth",
  animated = false,
  className = "",
}: PricingGridProps) {
  const grid = (
    <div className={`grid gap-4 lg:grid-cols-4 ${className}`}>
      {PLAN_ORDER.map((planId, i) => {
        const card = (
          <PlanCard
            key={planId}
            planId={planId}
            highlighted={planId === highlightedPlan}
          />
        );

        if (!animated) return card;

        return (
          <FadeIn key={planId} delay={i * 0.06}>
            {card}
          </FadeIn>
        );
      })}
    </div>
  );

  return grid;
}
