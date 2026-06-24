"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { FadeIn } from "@/components/marketing/landing/motion";
import { Button } from "@/components/ui/button";
import { PLAN_CATALOG, PLAN_ORDER } from "@/lib/payments/plans";
import type { Plan } from "@/types";

interface PricingGridProps {
  highlightedPlan?: Plan;
  animated?: boolean;
  landingStyle?: boolean;
  className?: string;
}

function PlanCard({
  planId,
  highlighted,
  landingStyle,
}: {
  planId: Plan;
  highlighted: boolean;
  landingStyle?: boolean;
}) {
  const plan = PLAN_CATALOG[planId];
  const isFree = planId === "free";
  const isFeatured = highlighted || plan.highlight;

  if (landingStyle) {
    return (
      <article
        className={`sf-card relative flex h-full flex-col p-6 ${
          isFeatured ? "sf-pricing-featured" : ""
        }`}
      >
        {plan.highlight && <span className="sf-pricing-badge">Más elegido</span>}

        <h3 className="text-lg font-bold text-[#FAFAFA]">{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-[#FAFAFA]">
            {plan.priceLabel}
          </span>
          <span className="text-sm text-[#71717A]">{plan.periodLabel}</span>
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((feature) => {
            const excluded = feature.startsWith("✗");
            const label = feature.replace(/^[✓✗]\s*/, "");
            return (
              <li
                key={feature}
                className={`flex items-start gap-2 text-[13px] ${excluded ? "text-[#71717A]/80" : "text-[#A1A1AA]"}`}
              >
                {excluded ? (
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                ) : (
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                )}
                {label}
              </li>
            );
          })}
        </ul>

        {isFree ? (
          <Link href="/login" className="mt-8 block">
            <span
              className={
                isFeatured
                  ? "sf-btn-primary flex w-full justify-center text-sm"
                  : "sf-btn-ghost flex w-full justify-center text-sm"
              }
            >
              Empezar gratis
            </span>
          </Link>
        ) : (
          <CheckoutButton
            plan={planId}
            variant={isFeatured ? "accent" : "outline"}
            size="md"
            className={`mt-8 w-full ${isFeatured ? "!bg-[#22C55E] !text-black !font-bold hover:!bg-[#16A34A]" : ""}`}
          >
            {`Elegir ${plan.name}`}
          </CheckoutButton>
        )}
      </article>
    );
  }

  return (
    <article
      className={`landing-card relative flex h-full flex-col rounded-2xl p-6 ${
        isFeatured ? "pricing-highlight border-primary/40" : ""
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
        {plan.features.map((feature) => {
          const excluded = feature.startsWith("✗");
          const label = feature.replace(/^[✓✗]\s*/, "");
          return (
            <li
              key={feature}
              className={`flex items-start gap-2 text-sm ${excluded ? "text-foreground-muted" : "text-foreground-secondary"}`}
            >
              {excluded ? (
                <X
                  className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              ) : (
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
              {label}
            </li>
          );
        })}
      </ul>

      {isFree ? (
        <Link href="/login" className="mt-8 block cursor-pointer">
          <Button
            variant={isFeatured ? "accent" : "outline"}
            size="md"
            className="w-full"
          >
            Empezar gratis
          </Button>
        </Link>
      ) : (
        <CheckoutButton
          plan={planId}
          variant={isFeatured ? "accent" : "outline"}
          size="md"
          className="mt-8 w-full"
        >
          {`Elegir ${plan.name}`}
        </CheckoutButton>
      )}
    </article>
  );
}

export function PricingGrid({
  highlightedPlan = "growth",
  animated = false,
  landingStyle = false,
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
            landingStyle={landingStyle}
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
