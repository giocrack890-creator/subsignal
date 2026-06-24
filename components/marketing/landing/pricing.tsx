"use client";

import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { SectionHeading } from "@/components/marketing/landing/section-heading";
import { getMarketingCopy, type MarketingLocale } from "@/lib/i18n/marketing";

interface LandingPricingProps {
  locale?: MarketingLocale;
}

export function LandingPricing({ locale = "es" }: LandingPricingProps) {
  const copy = getMarketingCopy(locale);

  return (
    <>
      <hr className="sf-divider" />
      <section
        id="precios"
        className="sf-section scroll-mt-24"
        aria-labelledby="pricing-heading"
      >
        <SectionHeading
          id="pricing-heading"
          eyebrow="Precios"
          title={copy.pricing.title}
          subtitle={copy.pricing.subtitle}
        />

        <div className="mt-14">
          <PricingGrid highlightedPlan="growth" animated landingStyle />
        </div>

        <p className="mt-8 text-center text-sm text-[#71717A]">
          <a
            href={copy.pricing.compareLinkHref}
            className="text-[#22C55E] hover:underline"
          >
            {copy.pricing.compareLink}
          </a>
        </p>
      </section>
    </>
  );
}
