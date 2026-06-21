"use client";

import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const PLATFORMS = [
  {
    name: "Hacker News",
    color: "text-platform-hn",
    dot: "bg-platform-hn",
    status: "Activo",
    active: true,
    desc: "Monitoreo en vivo con scoring de intención y borradores.",
  },
  {
    name: "Reddit",
    color: "text-platform-reddit",
    dot: "bg-platform-reddit",
    status: "Próximamente",
    active: false,
    desc: "Subreddits relevantes para tu nicho, en el roadmap.",
  },
  {
    name: "Twitter / X",
    color: "text-platform-twitter",
    dot: "bg-platform-twitter",
    status: "Próximamente",
    active: false,
    desc: "Menciones y threads con intención de compra.",
  },
  {
    name: "Indie Hackers",
    color: "text-platform-ih",
    dot: "bg-platform-ih",
    status: "Próximamente",
    active: false,
    desc: "Conversaciones de founders buscando soluciones.",
  },
];

export function LandingPlatforms() {
  return (
    <section
      id="plataformas"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="platforms-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="platforms-heading"
          title="Dónde te escuchamos"
          subtitle="Empezamos donde la intención es más clara. Más plataformas en camino."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((platform, i) => (
            <FadeIn key={platform.name} delay={i * 0.06}>
              <article
                className={`landing-card flex h-full flex-col rounded-2xl p-5 ${
                  platform.active
                    ? "border-primary/30"
                    : "opacity-75"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${platform.dot}`} />
                    <h3 className={`font-semibold ${platform.active ? "text-foreground" : "text-foreground-secondary"}`}>
                      {platform.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      platform.active
                        ? "bg-primary-muted-bg text-primary"
                        : "bg-muted text-foreground-muted"
                    }`}
                  >
                    {platform.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                  {platform.desc}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
