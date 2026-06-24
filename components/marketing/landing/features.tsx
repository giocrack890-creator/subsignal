"use client";

import {
  BarChart3,
  Bell,
  Bot,
  Clock,
  PenLine,
  Shield,
} from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const FEATURES = [
  {
    icon: Clock,
    title: "Monitoreo 24/7",
    desc: "Escaneamos Hacker News en background. Recibís alertas cuando aparece una conversación relevante, sin refrescar feeds manualmente.",
  },
  {
    icon: Bot,
    title: "Scoring inteligente con IA",
    desc: "Claude evalúa cada post por intención de compra real. Filtrás ruido y te enfocás solo en leads con potencial.",
  },
  {
    icon: PenLine,
    title: "Borradores genuinos",
    desc: "Generamos respuestas que aportan valor primero. Vos editás y publicás — nunca auto-posteamos en tu nombre.",
  },
  {
    icon: BarChart3,
    title: "Conversion tracking",
    desc: "Seguí qué señales terminaron en signup o demo. Sabé qué keywords y plataformas te traen clientes reales.",
  },
  {
    icon: Bell,
    title: "Alertas instantáneas",
    desc: "Email cuando aparece una señal de alta intención. Respondé mientras la conversación sigue activa.",
  },
  {
    icon: Shield,
    title: "Control total",
    desc: "Definís keywords, tono y límites. Tu marca, tus reglas. Sin spam ni respuestas genéricas.",
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="landing-section relative scroll-mt-24 border-t border-border bg-background-elevated/40"
      aria-labelledby="features-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="features-heading"
          title="Todo lo que necesitás para no perderte ninguna señal"
          subtitle="Más que alertas: un flujo completo de detección, priorización y respuesta."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <article className="landing-card h-full rounded-2xl p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted-bg text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">
                    {feature.desc}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
