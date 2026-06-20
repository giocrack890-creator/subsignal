import Link from "next/link";
import { HeroBackground } from "@/components/marketing/hero-background";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { SocialDock } from "@/components/marketing/social-dock";
import { StatCard } from "@/components/marketing/stat-card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <HeroBackground />
      <MarketingNavbar />

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pb-12 pt-20 text-center lg:pt-28">
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-foreground text-glow sm:text-5xl lg:text-[3.5rem]">
          Encontrá clientes donde
          <br />
          ya están pidiendo ayuda
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-foreground-muted sm:text-base">
          SubSignal monitorea Reddit, Hacker News y más. Puntúa cada conversación
          por intención de compra y genera borradores de respuesta genuinos.
        </p>

        {/* Social dock (Ape Terminal) */}
        <div className="mt-6">
          <SocialDock />
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button variant="primary" size="lg" showArrow>
              Empezar gratis
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              Ver precios
            </Button>
          </Link>
        </div>

        {/* Bento stats (Ape Terminal) */}
        <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            value="9.2/10"
            label="Score promedio de intención"
            variant="chevron"
          />
          <StatCard
            value="2.4k"
            label="Señales detectadas / mes"
            variant="chart"
          />
          <StatCard
            value="1.5h"
            label="Ahorradas por día"
            variant="plain"
          />
        </div>
      </main>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-2 text-xs text-foreground-muted lg:flex">
        Scroll para explorar
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border-strong">
          ↓
        </span>
      </div>
    </div>
  );
}
