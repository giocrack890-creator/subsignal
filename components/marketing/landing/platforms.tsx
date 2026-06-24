"use client";

import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const PLATFORMS = [
  {
    name: "Hacker News",
    color: "text-platform-hn",
    dot: "bg-platform-hn",
    status: "Activo",
    badge: "active" as const,
    desc: "Monitoreo en vivo con scoring de intención y borradores.",
  },
  {
    name: "Reddit",
    color: "text-platform-reddit",
    dot: "bg-platform-reddit",
    status: "En desarrollo",
    badge: "development" as const,
    desc: "Subreddits de startups y SaaS. Requiere app OAuth en Reddit.",
  },
  {
    name: "Twitter / X",
    color: "text-platform-twitter",
    dot: "bg-platform-twitter",
    status: "En desarrollo",
    badge: "development" as const,
    desc: "Tweets recientes con intención de compra. Requiere Bearer Token.",
  },
  {
    name: "Indie Hackers",
    color: "text-platform-ih",
    dot: "bg-platform-ih",
    status: "Próximamente",
    badge: "soon" as const,
    desc: "Posts de founders buscando herramientas y soluciones.",
  },
];

function PlatformBadge({
  status,
  badge,
}: {
  status: string;
  badge: "active" | "development" | "soon";
}) {
  if (badge === "active") {
    return (
      <span className="rounded-full bg-primary-muted-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
        {status}
      </span>
    );
  }

  if (badge === "development") {
    return (
      <span
        className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{
          backgroundColor: "rgba(251, 191, 36, 0.15)",
          color: "#FBBF24",
          borderColor: "rgba(251, 191, 36, 0.3)",
        }}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: "rgba(107, 114, 128, 0.15)",
        color: "#9CA3AF",
        borderColor: "rgba(107, 114, 128, 0.3)",
      }}
    >
      {status}
    </span>
  );
}

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
          subtitle="Monitoreamos HN, Reddit, X e Indie Hackers donde tu ICP ya está preguntando."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((platform, i) => (
            <FadeIn key={platform.name} delay={i * 0.06}>
              <article
                className={`landing-card flex h-full flex-col rounded-2xl p-5 ${
                  platform.badge === "active"
                    ? "border-primary/30"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${platform.dot}`} />
                    <h3
                      className={`font-semibold ${
                        platform.badge === "active"
                          ? "text-foreground"
                          : "text-foreground-secondary"
                      }`}
                    >
                      {platform.name}
                    </h3>
                  </div>
                  <PlatformBadge
                    status={platform.status}
                    badge={platform.badge}
                  />
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
