"use client";

import Link from "next/link";
import { getMarketingCopy, type MarketingLocale } from "@/lib/i18n/marketing";

interface LandingCtaProps {
  locale?: MarketingLocale;
}

export function LandingCta({ locale = "es" }: LandingCtaProps) {
  const copy = getMarketingCopy(locale);

  return (
    <>
      <hr className="sf-divider" />
      <section className="sf-section">
        <div className="sf-cta-box mx-auto max-w-3xl">
          <h2 className="sf-section-title text-[#FAFAFA]">{copy.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[#A1A1AA]">
            {copy.cta.subtitle}
          </p>
          <Link href="/login" className="sf-btn-primary mt-10 inline-flex text-base">
            {copy.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
