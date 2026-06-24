"use client";

import Link from "next/link";
import { MarketingPlanGrid } from "@/components/marketing/pricing/marketing-plan-grid";
import { SectionHeading } from "@/components/marketing/landing/section-heading";
import { LANDING_PRICING_PLANS } from "@/lib/marketing/landing-pricing-plans";

export function LandingPricing() {
  return (
    <section
      id="precios"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="pricing-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="pricing-heading"
          title="Planes simples"
          subtitle="Empezá gratis. Upgrades cuando lo necesitás. Sin contratos, cancelás cuando querés."
        />

        <div className="mt-14">
          <MarketingPlanGrid
            variant="landing"
            plans={LANDING_PRICING_PLANS}
            animated
          />
        </div>

        <p className="mt-8 text-center text-sm text-foreground-muted">
          Todos los planes incluyen cancelación inmediata. Sin preguntas, sin
          períodos de aviso.
        </p>

        <p className="mt-4 text-center text-sm text-foreground-muted">
          ¿Necesitás comparar en detalle?{" "}
          <Link href="/pricing" className="text-primary hover:underline">
            Ver página de pricing completa →
          </Link>
        </p>
      </div>
    </section>
  );
}
