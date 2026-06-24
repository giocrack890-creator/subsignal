"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { Button } from "@/components/ui/button";
import {
  MARKETING_PLANS,
  type MarketingPlan,
  type MarketingPlanFeature,
} from "@/lib/marketing/pricing-plans";

interface MarketingPlanGridProps {
  variant?: "landing" | "page";
  plans?: MarketingPlan[];
  animated?: boolean;
}

function isExternalHref(href: string) {
  return href.startsWith("http") || href === "#";
}

function LandingFeatureRow({ feature }: { feature: MarketingPlanFeature }) {
  if (!feature.included) {
    return (
      <li className="flex items-start gap-2 text-sm text-foreground-muted">
        <X
          className="mt-0.5 h-4 w-4 shrink-0"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className="line-through">{feature.text}</span>
      </li>
    );
  }

  const textClass =
    feature.tone === "green"
      ? "text-primary"
      : feature.tone === "white"
        ? "text-foreground"
        : "text-foreground-secondary";

  return (
    <li className={`flex items-start gap-2 text-sm ${textClass}`}>
      <Check
        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span>{feature.text}</span>
    </li>
  );
}

function PageFeatureRow({ feature }: { feature: MarketingPlanFeature }) {
  if (!feature.included) {
    return (
      <li className="flex items-start gap-2.5 text-sm text-[#6B6B6B]">
        <span className="mt-0.5 shrink-0" aria-hidden>
          ✗
        </span>
        <span className="line-through">{feature.text}</span>
      </li>
    );
  }

  const color =
    feature.tone === "green"
      ? "text-[#34D399]"
      : feature.tone === "white"
        ? "text-white"
        : "text-[#6B6B6B]";

  return (
    <li className={`flex items-start gap-2.5 text-sm ${color}`}>
      <span className="mt-0.5 shrink-0 text-[#34D399]" aria-hidden>
        ✓
      </span>
      <span>{feature.text}</span>
    </li>
  );
}

function LandingPlanCard({ plan }: { plan: MarketingPlan }) {
  const isFeatured = plan.featured;
  const external = isExternalHref(plan.cta.href);

  const cta =
    external ? (
      <a href={plan.cta.href} className="mt-8 block">
        <Button
          variant={plan.cta.variant === "accent" ? "accent" : "outline"}
          size="md"
          className="w-full"
        >
          {plan.cta.label}
        </Button>
      </a>
    ) : (
      <Link href={plan.cta.href} className="mt-8 block">
        <Button
          variant={plan.cta.variant === "accent" ? "accent" : "outline"}
          size="md"
          className="w-full"
        >
          {plan.cta.label}
        </Button>
      </Link>
    );

  return (
    <article
      className={`landing-card relative flex h-full flex-col rounded-2xl p-6 ${
        isFeatured ? "pricing-highlight border-primary/40" : ""
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Más popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
        <span className="text-sm text-foreground-muted">/mes</span>
      </div>
      <p className="mt-2 text-sm text-foreground-secondary">{plan.description}</p>

      {cta}

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <LandingFeatureRow key={feature.text} feature={feature} />
        ))}
      </ul>
    </article>
  );
}

function PagePlanCard({ plan }: { plan: MarketingPlan }) {
  const isFeatured = plan.featured;
  const external = isExternalHref(plan.cta.href);

  const buttonClass =
    plan.cta.variant === "accent"
      ? "flex w-full items-center justify-center rounded-[10px] bg-[#34D399] px-5 py-3.5 text-sm font-bold text-black transition-colors hover:bg-[#2bb88a]"
      : "flex w-full items-center justify-center rounded-[10px] border border-white bg-transparent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#34D399]";

  const cta = external ? (
    <a href={plan.cta.href} className={buttonClass}>
      {plan.cta.label}
    </a>
  ) : (
    <Link href={plan.cta.href} className={buttonClass}>
      {plan.cta.label}
    </Link>
  );

  return (
    <article
      className={`relative flex flex-col rounded-[14px] p-6 md:p-8 ${
        isFeatured
          ? "border border-[rgba(52,211,153,0.4)] bg-[#111714] shadow-[0_0_40px_rgba(52,211,153,0.12)]"
          : "border border-[#232323] bg-[#111714]"
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#34D399] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
          Más popular
        </span>
      )}

      <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{plan.price}</span>
        <span className="text-sm text-[#6B6B6B]">/mes</span>
      </div>
      <p className="mt-2 text-sm text-[#B4B4B4]">{plan.description}</p>

      <div className="mt-6">{cta}</div>

      <ul className="mt-8 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <PageFeatureRow key={feature.text} feature={feature} />
        ))}
      </ul>
    </article>
  );
}

export function MarketingPlanGrid({
  variant = "landing",
  plans = MARKETING_PLANS,
  animated = false,
}: MarketingPlanGridProps) {
  return (
    <div
      className={
        variant === "landing"
          ? "grid gap-4 lg:grid-cols-3"
          : "grid gap-6 lg:grid-cols-3 lg:gap-5"
      }
    >
      {plans.map((plan, index) => {
        const card =
          variant === "landing" ? (
            <LandingPlanCard key={plan.id} plan={plan} />
          ) : (
            <PagePlanCard key={plan.id} plan={plan} />
          );

        if (!animated || variant !== "landing") {
          return card;
        }

        return (
          <FadeIn key={plan.id} delay={index * 0.06}>
            {card}
          </FadeIn>
        );
      })}
    </div>
  );
}
