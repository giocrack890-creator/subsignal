"use client";

import Link from "next/link";
import { PhoneMockup } from "@/components/marketing/landing/phone-mockup";
import {
  getMarketingCopy,
  localePricingPath,
  type MarketingLocale,
} from "@/lib/i18n/marketing";

const LEFT_METRICS = [
  { label: "Señales hoy", value: "24" },
  { label: "Score promedio", value: "8.4" },
  { label: "Keywords", value: "5" },
];

const RIGHT_SIGNALS = [
  { score: 9, title: "Ask HN: CRM for startups?", source: "Hacker News" },
  { score: 8, title: "Alternative to Apollo?", source: "Reddit" },
  { score: 7, title: "Finding customers on IH", source: "Indie Hackers" },
];

interface LandingHeroProps {
  locale?: MarketingLocale;
}

export function LandingHero({ locale = "es" }: LandingHeroProps) {
  const copy = getMarketingCopy(locale);

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col scroll-mt-24 overflow-hidden pt-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-1 flex-col items-center px-6 pb-16 pt-12 text-center lg:px-10">
        <div className="sf-badge-live mb-8">
          <span className="sf-dot-pulse" />
          {locale === "en" ? "Live monitoring" : "Monitoreo en vivo"}
        </div>

        <h1 className="sf-hero-title max-w-4xl text-[#FAFAFA]">
          {copy.hero.titleLine1}
          <br />
          <span className="text-[#22C55E]">{copy.hero.titleLine2}</span>
        </h1>

        <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-[#A1A1AA]">
          {copy.hero.tagline}.{" "}
          {locale === "en"
            ? "We score high-intent threads on HN, Reddit and more — with a reply draft ready to copy in 30 seconds."
            : "Puntuamos conversaciones de alta intención en HN, Reddit y más — con un borrador listo para copiar en 30 segundos."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login" className="sf-btn-primary text-base">
            {copy.hero.ctaPrimary}
          </Link>
          <Link
            href={`${localePricingPath(locale)}#precios`}
            className="sf-btn-ghost text-base"
          >
            {copy.hero.ctaSecondary}
          </Link>
        </div>

        {/* 3-column hero composition */}
        <div className="mt-16 flex w-full max-w-[900px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:gap-6">
          <div className="hidden w-[190px] shrink-0 flex-col gap-3 lg:flex">
            {LEFT_METRICS.map((m) => (
              <div key={m.label} className="sf-mini-card text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  {m.label}
                </p>
                <p className="mt-1 text-[22px] font-extrabold text-[#FAFAFA]">
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          <div className="shrink-0">
            <PhoneMockup locale={locale} />
          </div>

          <div className="hidden w-[190px] shrink-0 flex-col gap-3 lg:flex">
            {RIGHT_SIGNALS.map((s) => (
              <div key={s.title} className="sf-mini-card text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="sf-score">{s.score}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-[#FAFAFA]">
                  {s.title}
                </p>
                <p className="mt-1 text-[11px] text-[#71717A]">{s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
