"use client";

import {
  BarChart3,
  Bell,
  Bot,
  ClipboardCopy,
  Clock,
  PenLine,
  Shield,
} from "lucide-react";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const FEATURES = [
  {
    icon: Clock,
    title: "Monitoreo 24/7",
    desc: "Escaneamos plataformas en background. Recibís alertas cuando aparece una conversación relevante.",
  },
  {
    icon: Bot,
    title: "Scoring inteligente con IA",
    desc: "Claude evalúa cada post por intención de compra real. Filtrás ruido y te enfocás en leads con potencial.",
  },
  {
    icon: PenLine,
    title: "Borradores genuinos",
    desc: "Generamos respuestas que aportan valor primero. Vos editás y publicás — nunca auto-posteamos.",
  },
  {
    icon: ClipboardCopy,
    title: "Respuesta lista para copiar",
    desc: "Cada señal incluye un borrador personalizado listo para publicar. Mencioná tu producto de forma genuina sin sonar a spam. Solo para usuarios de pago.",
  },
  {
    icon: BarChart3,
    title: "Conversion tracking",
    desc: "Seguí qué señales terminaron en signup o demo. Sabé qué keywords te traen clientes reales.",
  },
  {
    icon: Bell,
    title: "Alertas instantáneas",
    desc: "Email o Slack cuando aparece una señal de alta intención. Respondé mientras la conversación sigue activa.",
  },
  {
    icon: Shield,
    title: "Control total",
    desc: "Definís keywords, tono y límites. Tu marca, tus reglas. Sin spam ni respuestas genéricas.",
  },
];

export function LandingFeatures() {
  return (
    <>
      <hr className="sf-divider" />
      <section
        id="features"
        className="sf-section scroll-mt-24"
        aria-labelledby="features-heading"
      >
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title="Todo lo que necesitás para no perderte ninguna señal"
          subtitle="Más que alertas: un flujo completo de detección, priorización y respuesta."
        />

        <div className="sf-grid-gap mt-14 grid sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="sf-grid-cell">
                <div className="sf-icon-box">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#FAFAFA]">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#A1A1AA]">
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
