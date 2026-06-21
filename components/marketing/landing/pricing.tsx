"use client";

import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

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
          subtitle="Empezá gratis. Escalá cuando veas señales que valen la pena."
        />

        <div className="mt-14">
          <PricingGrid highlightedPlan="growth" animated />
        </div>

        <p className="mt-8 text-center text-sm text-foreground-muted">
          ¿Necesitás comparar en detalle?{" "}
          <a href="/pricing" className="text-primary hover:underline">
            Ver página de pricing completa →
          </a>
        </p>
      </div>
    </section>
  );
}
