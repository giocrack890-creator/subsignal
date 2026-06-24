"use client";

import { MessageSquare, Radar, Settings2 } from "lucide-react";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const STEPS = [
  {
    icon: Settings2,
    title: "Configurás tu producto",
    desc: "Definís keywords, contexto y tono. La IA entiende qué buscás y qué ofrecés.",
  },
  {
    icon: Radar,
    title: "Detectamos señales",
    desc: "Monitoreamos HN, Reddit e IH. Cada post se puntúa por intención de compra real.",
  },
  {
    icon: MessageSquare,
    title: "Respondés en 30 segundos",
    desc: "SubSignal redacta la respuesta por vos. Vos la copiás y la publicás desde tu cuenta en 30 segundos. Nunca auto-posteamos.",
  },
];

export function LandingSteps() {
  return (
    <>
      <hr className="sf-divider" />
      <section
        id="como-funciona"
        className="sf-section scroll-mt-24"
        aria-labelledby="steps-heading"
      >
        <SectionHeading
          id="steps-heading"
          eyebrow="Cómo funciona"
          title="Tres pasos. Cero scraping manual."
          subtitle="De la keyword al borrador listo para copiar y publicar."
        />

        <div className="sf-grid-gap mt-14 grid sm:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="sf-grid-cell">
                <div className="sf-icon-box">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#FAFAFA]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#A1A1AA]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
