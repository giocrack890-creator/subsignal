"use client";

import { SectionHeading } from "@/components/marketing/landing/section-heading";

const PLATFORMS = [
  {
    name: "Hacker News",
    dot: "#ff6600",
    status: "Activo",
    desc: "Monitoreo en vivo con scoring de intención y borradores.",
  },
  {
    name: "Reddit",
    dot: "#ff4500",
    status: "Activo",
    desc: "Subreddits de startups y SaaS. Requiere aprobación API.",
  },
  {
    name: "Twitter / X",
    dot: "#1da1f2",
    status: "Activo",
    desc: "Tweets recientes con intención de compra.",
  },
  {
    name: "Indie Hackers",
    dot: "#6366f1",
    status: "Activo",
    desc: "Posts de founders buscando herramientas.",
  },
];

export function LandingPlatforms() {
  return (
    <>
      <hr className="sf-divider" />
      <section
        id="plataformas"
        className="sf-section scroll-mt-24"
        aria-labelledby="platforms-heading"
      >
        <SectionHeading
          id="platforms-heading"
          eyebrow="Plataformas"
          title="Dónde te escuchamos"
          subtitle="Monitoreamos HN, Reddit, X e Indie Hackers donde tu ICP ya está preguntando."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((platform) => (
            <article key={platform.name} className="sf-card flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: platform.dot }}
                  />
                  <h3 className="font-bold text-[#FAFAFA]">{platform.name}</h3>
                </div>
                <span className="sf-status-badge">{platform.status}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                {platform.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
