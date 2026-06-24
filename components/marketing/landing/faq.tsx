"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/marketing/landing/section-heading";
import { getMarketingCopy, type MarketingLocale } from "@/lib/i18n/marketing";

interface LandingFaqProps {
  locale?: MarketingLocale;
}

export function LandingFaq({ locale = "es" }: LandingFaqProps) {
  const copy = getMarketingCopy(locale);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <hr className="sf-divider" />
      <section
        id="faq"
        className="sf-section scroll-mt-24"
        aria-labelledby="faq-heading"
      >
        <SectionHeading
          id="faq-heading"
          eyebrow="FAQ"
          title={copy.faq.title}
          subtitle={copy.faq.subtitle}
        />

        <div className="mx-auto mt-12 max-w-2xl">
          {copy.faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`sf-faq-item ${isOpen ? "open" : ""}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="sf-faq-q">
                  <span>{item.q}</span>
                  <span className="sf-faq-icon" aria-hidden="true">
                    +
                  </span>
                </div>
                <div className="sf-faq-a">{item.a}</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
