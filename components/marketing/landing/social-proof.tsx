"use client";

import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const TESTIMONIALS = [
  {
    quote:
      "Dejé de scrollear HN a mano. SubSignal me avisa cuando alguien pregunta exactamente lo que resuelvo.",
    author: "Founder, SaaS B2B",
    role: "Early adopter",
  },
  {
    quote:
      "El scoring filtra el ruido. Solo veo conversaciones donde tiene sentido responder.",
    author: "Indie hacker",
    role: "Plan Starter",
  },
  {
    quote:
      "Los borradores son un punto de partida honesto — los edito y suenan como yo, no como un bot.",
    author: "Solo founder",
    role: "Plan Growth",
  },
];

export function LandingSocialProof() {
  return (
    <section
      id="social"
      className="landing-section relative scroll-mt-24 border-t border-border bg-background-elevated/40"
      aria-labelledby="social-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="social-heading"
          title="Construido por founders, para founders"
          subtitle="Estamos en beta temprana. Estos son los primeros feedbacks de quienes ya monitorean señales."
        />

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-background-card px-6 py-4 text-center">
          <p className="text-sm text-foreground-secondary">
            Monitoreando keywords activamente en Hacker News
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">Beta privada</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <FadeIn key={item.author} delay={i * 0.08}>
              <blockquote className="landing-card h-full rounded-2xl p-6">
                <p className="text-[15px] leading-relaxed text-foreground-secondary">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-4 border-t border-border pt-4">
                  <cite className="not-italic">
                    <span className="block text-sm font-semibold text-foreground">
                      {item.author}
                    </span>
                    <span className="text-xs text-foreground-muted">{item.role}</span>
                  </cite>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
