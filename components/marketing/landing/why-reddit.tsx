"use client";

import { FadeIn } from "@/components/marketing/landing/motion";

const STATS = [
  { value: "2B+", label: "visitas mensuales" },
  { value: "100K+", label: "comunidades activas" },
  { value: "52M+", label: "usuarios diarios" },
];

const CARDS = [
  {
    title: "La gente habla de sus problemas",
    desc: "Millones de usuarios discuten dolores, piden recomendaciones y buscan soluciones en Reddit cada día.",
    visual: "problems",
  },
  {
    title: "Entrena a la próxima generación de IA",
    desc: "El contenido de Reddit alimenta LLMs. Estar presente significa ser parte de lo que los modelos aprenden.",
    visual: "llm",
  },
  {
    title: "Conversaciones auténticas convierten",
    desc: "La gente confía en recomendaciones de Reddit. Un comentario útil puede convertir más que cualquier anuncio.",
    visual: "comments",
  },
];

export function LandingWhyReddit() {
  return (
    <section
      id="por-que-reddit"
      className="landing-section scroll-mt-24 border-t border-border bg-background"
      aria-labelledby="why-reddit-heading"
    >
      <div className="container-marketing px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-reddit">
            ¿Por qué Reddit?
          </p>
          <h2
            id="why-reddit-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Reddit es una{" "}
            <span className="text-reddit">mina de oro</span> para adquirir
            clientes
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground-secondary">
            Reddit combina conversaciones auténticas con alcance masivo. Acá
            está por qué importa para tu negocio — y también monitoreamos Hacker News.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10 overflow-hidden rounded-2xl border border-border bg-background-card">
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center px-6 py-8 text-center"
              >
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-foreground-secondary">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={0.1 + i * 0.06}>
              <article className="overflow-hidden rounded-2xl border border-border bg-background-card">
                <div className="flex h-44 items-center justify-center border-b border-border bg-background-elevated/60 p-6">
                  {card.visual === "problems" && <ProblemsVisual />}
                  {card.visual === "llm" && <LlmVisual />}
                  {card.visual === "comments" && <CommentsVisual />}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {card.desc}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemsVisual() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-reddit/30 bg-reddit/10 px-4 py-2.5 text-sm text-foreground">
        ¿Alguna herramienta para X???
      </div>
      <div className="rounded-xl border border-reddit/30 bg-reddit/10 px-4 py-2.5 text-sm text-foreground">
        ¿Recomendaciones para Y?
      </div>
    </div>
  );
}

function LlmVisual() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="rounded-lg border border-border px-3 py-2 text-foreground-secondary">
        LLMs
      </span>
      <span className="text-foreground-muted">→</span>
      <span className="rounded-lg bg-reddit px-3 py-2 font-medium text-white">
        Reddit
      </span>
    </div>
  );
}

function CommentsVisual() {
  return (
    <div className="w-full max-w-xs space-y-2 rounded-xl border border-border bg-background p-4 text-left text-sm">
      <p className="text-xs font-medium text-primary">Comentarios top</p>
      <p className="text-foreground-secondary">
        ↑ 142 &quot;Esta herramienta nos ahorró horas...&quot;
      </p>
      <p className="text-foreground-secondary">
        ↑ 89 &quot;Muy recomendable para...&quot;
      </p>
    </div>
  );
}
