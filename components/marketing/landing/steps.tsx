"use client";

import { MessageSquare, Radar, Settings2 } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const STEPS = [
  {
    n: "01",
    icon: Settings2,
    title: "Configurás tu producto",
    desc: "Definís keywords, contexto y tono. La IA entiende qué buscás y qué ofrecés.",
  },
  {
    n: "02",
    icon: Radar,
    title: "Detectamos señales",
    desc: "Monitoreamos Hacker News 24/7. Cada post se puntúa por intención de compra real.",
  },
  {
    n: "03",
    icon: MessageSquare,
    title: "Respondés con valor",
    desc: "Recibís un borrador genuino listo para editar. Nunca auto-posteamos por vos.",
  },
];

export function LandingSteps() {
  return (
    <section
      id="como-funciona"
      className="landing-section relative scroll-mt-24 border-t border-border bg-background-elevated/40"
      aria-labelledby="steps-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="steps-heading"
          title="Cómo funciona"
          subtitle="Tres pasos. Cero scraping manual."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.n} delay={i * 0.08}>
                <li className="bento-card group h-full cursor-default rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted-bg text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-bold text-primary/30">{step.n}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">
                    {step.desc}
                  </p>
                </li>
              </FadeIn>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
