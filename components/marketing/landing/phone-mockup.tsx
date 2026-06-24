"use client";

import { getMarketingCopy, type MarketingLocale } from "@/lib/i18n/marketing";

const SIGNALS = [
  {
    platform: "HN",
    platformColor: "#ff6600",
    score: 9,
    title: "Best CRM for early-stage SaaS?",
    timeEs: "12 min",
    timeEn: "12m",
  },
  {
    platform: "Reddit",
    platformColor: "#ff4500",
    score: 8,
    title: "Looking for intent monitoring tool",
    timeEs: "34 min",
    timeEn: "34m",
  },
  {
    platform: "IH",
    platformColor: "#6366f1",
    score: 7,
    title: "How do you find customers on HN?",
    timeEs: "1 h",
    timeEn: "1h",
  },
];

interface PhoneMockupProps {
  locale?: MarketingLocale;
}

export function PhoneMockup({ locale = "es" }: PhoneMockupProps) {
  const copy = getMarketingCopy(locale);

  return (
    <div className="sf-phone mx-auto">
      <div className="border-b border-[#27272A] px-4 pb-3 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
          SubSignal
        </p>
        <p className="mt-0.5 text-sm font-bold text-[#FAFAFA]">Señales</p>
      </div>
      <div className="space-y-2 p-3">
        {SIGNALS.map((s) => (
          <article
            key={s.title}
            className="rounded-xl border border-[#27272A] bg-[#111113] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[9px] font-bold uppercase tracking-wide"
                style={{ color: s.platformColor }}
              >
                {s.platform}
              </span>
              <span className="sf-score">{s.score}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-[#FAFAFA]">
              {s.title}
            </p>
            <p className="mt-1 text-[10px] text-[#71717A]">
              {locale === "en" ? s.timeEn : s.timeEs}
            </p>
          </article>
        ))}
      </div>
      <div className="border-t border-[#27272A] p-3">
        <div className="rounded-lg bg-[#22C55E] py-2 text-center text-[11px] font-bold text-black">
          {copy.productPreview.viewDraft}
        </div>
      </div>
    </div>
  );
}
