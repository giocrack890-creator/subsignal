"use client";

import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const MOCK_SIGNALS = [
  {
    platform: "Hacker News",
    color: "bg-platform-hn",
    score: 9,
    title: "Looking for a tool to monitor Reddit/HN for buying intent",
    time: "hace 12 min",
  },
  {
    platform: "Hacker News",
    color: "bg-platform-hn",
    score: 8,
    title: "Best way to find early SaaS customers without cold outreach?",
    time: "hace 34 min",
  },
  {
    platform: "Hacker News",
    color: "bg-platform-hn",
    score: 7,
    title: "Anyone using AI to draft genuine replies on community posts?",
    time: "hace 1 h",
  },
  {
    platform: "Hacker News",
    color: "bg-platform-hn",
    score: 9,
    title: "Show HN: I built a keyword monitor for founder-led sales",
    time: "hace 2 h",
  },
];

export function LandingProductPreview() {
  return (
    <section
      id="preview"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="preview-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="preview-heading"
          title="Tu feed de señales, en tiempo real"
          subtitle="Detectamos conversaciones con intención de compra y te preparamos la respuesta. Datos de ejemplo."
        />

        <FadeIn className="mx-auto mt-14 max-w-3xl" delay={0.1}>
          <div className="overflow-hidden rounded-2xl border-glow-card bg-background-card">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
              <span className="ml-3 text-xs text-foreground-muted">
                app.threadpulse.io/dashboard
              </span>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {MOCK_SIGNALS.map((signal) => (
                <article
                  key={signal.title}
                  className="landing-card rounded-xl p-4 sm:flex sm:items-start sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${signal.color}`}
                      >
                        {signal.platform}
                      </span>
                      <span className="rounded-md bg-primary-muted-bg px-2 py-0.5 text-xs font-bold text-primary">
                        {signal.score}/10
                      </span>
                      <span className="text-xs text-foreground-muted">{signal.time}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
                      {signal.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="mt-3 shrink-0 cursor-default rounded-full border border-border-strong px-4 py-1.5 text-xs font-medium text-foreground-secondary sm:mt-0"
                  >
                    Ver borrador
                  </button>
                </article>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
