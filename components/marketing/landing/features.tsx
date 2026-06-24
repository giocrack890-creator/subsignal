"use client";

import {
  BarChart3,
  Bell,
  Bot,
  Eye,
  PenLine,
  ShieldAlert,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const FEATURES = [
  {
    icon: Eye,
    title: "Monitoreo de marca y competidores",
    desc: "Alertas cuando mencionan tu producto, tus rivales o tu categoría. No te pierdas ninguna conversación relevante.",
  },
  {
    icon: Bot,
    title: "Scoring de intención con IA",
    desc: "Claude evalúa cada post por intención de compra real. Rankeamos oportunidades para que respondas lo que importa.",
  },
  {
    icon: PenLine,
    title: "Borradores genuinos",
    desc: "Respuestas que aportan valor primero. Vos editás y publicás — nunca auto-posteamos en tu nombre.",
  },
  {
    icon: ShieldAlert,
    title: "Detección de cuentas sospechosas",
    desc: "Marcamos posts de cuentas con patrones de shill o spam para que no pierdas tiempo en conversaciones falsas.",
  },
  {
    icon: Bell,
    title: "Alertas instantáneas",
    desc: "Email y push cuando aparece una señal de alta intención. Respondé mientras la conversación sigue activa.",
  },
  {
    icon: Users,
    title: "Reddit + Hacker News",
    desc: "Monitoreo multi-plataforma: Reddit para volumen, HN para founders con intención técnica de compra.",
  },
  {
    icon: BarChart3,
    title: "Conversion tracking",
    desc: "Seguí qué señales terminaron en signup o demo. Sabé qué keywords te traen clientes reales.",
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="features-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="features-heading"
          title="Todo lo que necesitás para convertir hilos en clientes"
          subtitle="Las mismas capacidades que usan los mejores equipos de growth en Reddit — más Hacker News y control total."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <li className="bento-card group h-full cursor-default rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted-bg text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">
                    {feature.desc}
                  </p>
                </li>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
