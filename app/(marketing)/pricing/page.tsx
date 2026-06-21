import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/marketing/landing/navbar";
import { LandingFooter } from "@/components/marketing/landing/footer";
import { LandingCta } from "@/components/marketing/landing/cta";
import { PlanComparisonTable } from "@/components/marketing/pricing/plan-comparison-table";
import { PricingFaq } from "@/components/marketing/pricing/pricing-faq";
import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { SectionHeading } from "@/components/marketing/landing/section-heading";
import { FxBackground } from "@/components/marketing/landing/fx-background";
import { Button } from "@/components/ui/button";
import { PLAN_ORDER } from "@/lib/payments/plans";
import type { Plan } from "@/types";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes Free, Starter, Growth y Pro. Intent monitoring en Hacker News con scoring de intención y borradores IA.",
};

interface PricingPageProps {
  searchParams: Promise<{ upgrade?: string }>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const upgradeParam = params.upgrade;
  const highlightedPlan = PLAN_ORDER.includes(upgradeParam as Plan)
    ? (upgradeParam as Plan)
    : "growth";

  return (
    <div className="bg-background text-foreground">
      <LandingNavbar />

      <main id="main-content" className="pt-24">
        <section className="relative overflow-hidden px-6 pb-16 pt-12">
          <FxBackground intensity="subtle" />
          <div className="container-marketing relative z-10 text-center">
            <p className="text-sm font-medium text-primary">Precios</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Elegí el plan que calza
              <br />
              con tu etapa
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground-secondary">
              Empezá gratis con Hacker News. Pagá solo cuando las señales justifiquen
              invertir en más keywords, borradores IA y alertas ilimitadas.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/login">
                <Button variant="accent" size="md" showArrow>
                  Empezar gratis
                </Button>
              </Link>
              <Link href="/#como-funciona">
                <Button variant="outline" size="md">
                  Cómo funciona
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-section px-6" aria-labelledby="plans-heading">
          <div className="container-marketing">
            <SectionHeading
              id="plans-heading"
              title="Planes"
              subtitle="Sin contratos anuales. Cancelá cuando quieras."
            />
            <div className="mt-12">
              <PricingGrid highlightedPlan={highlightedPlan} />
            </div>
          </div>
        </section>

        <section
          className="landing-section border-t border-border px-6"
          aria-labelledby="compare-heading"
        >
          <div className="container-marketing">
            <SectionHeading
              id="compare-heading"
              title="Comparación detallada"
              subtitle="Todo lo incluido en cada plan, en un vistazo."
            />
            <div className="mt-10">
              <PlanComparisonTable highlightedPlan={highlightedPlan} />
            </div>
          </div>
        </section>

        <section
          className="landing-section border-t border-border px-6"
          aria-labelledby="pricing-faq-heading"
        >
          <div className="container-marketing">
            <SectionHeading
              id="pricing-faq-heading"
              title="Preguntas sobre planes"
              subtitle="Facturación, límites y upgrades."
            />
            <div className="mt-10">
              <PricingFaq />
            </div>
          </div>
        </section>

        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
