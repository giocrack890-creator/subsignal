"use client";

import { Globe, Heart, Mail, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";

const STEPS = [
  {
    n: 1,
    title: "Agregá tu sitio web",
    desc: "Analizamos tu producto y generamos las mejores keywords para monitorear — marca, competidores e intención de compra.",
    visual: "website",
  },
  {
    n: 2,
    title: "Recibí posts relevantes de Reddit y HN",
    desc: "La IA puntúa la relevancia de cada post. Te entregamos las mejores oportunidades en tu inbox y dashboard.",
    visual: "posts",
  },
  {
    n: 3,
    title: "Respondé con autenticidad",
    desc: "Borradores genuinos listos para editar. Respondé a oportunidades de alta calidad y convertí conversaciones en clientes.",
    visual: "engage",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      id="como-funciona"
      className="landing-section scroll-mt-24 border-t border-border"
      aria-labelledby="how-heading"
    >
      <div className="container-marketing px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-reddit">
            Así funciona
          </p>
          <h2
            id="how-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Conseguí más{" "}
            <span className="text-reddit">clientes</span> en 3 pasos simples
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground-secondary">
            Configurá tu producto y monitoreamos conversaciones en{" "}
            <span className="font-medium text-reddit">Reddit</span> y Hacker News
            24/7. Los mejores posts llegan a tu inbox, listos para que
            intervengas.
          </p>
        </FadeIn>

        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.08}>
              <li className="relative h-full overflow-hidden rounded-2xl border border-border bg-background-card">
                <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-reddit text-xs font-bold text-white">
                  {step.n}
                </span>
                <div className="flex h-40 items-center justify-center border-b border-border bg-background-elevated/50 px-6 pt-8">
                  {step.visual === "website" && <WebsiteVisual />}
                  {step.visual === "posts" && <PostsVisual />}
                  {step.visual === "engage" && <EngageVisual />}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {step.desc}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WebsiteVisual() {
  return (
    <div className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
      <Globe className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden="true" />
      <span className="truncate text-sm text-foreground-secondary">
        https://tusitio.com
      </span>
      <Sparkles className="ml-auto h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    </div>
  );
}

function PostsVisual() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <p className="text-xs text-foreground-muted">Mejores posts →</p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-reddit" />
        <span className="h-2 flex-1 rounded bg-foreground/10" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-reddit" />
        <span className="h-2 flex-1 rounded bg-foreground/10" />
      </div>
    </div>
  );
}

function EngageVisual() {
  return (
    <div className="flex items-center gap-3">
      <Heart className="h-5 w-5 text-reddit" aria-hidden="true" />
      <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
      <span className="text-xs text-foreground-muted">Respondiendo...</span>
    </div>
  );
}
