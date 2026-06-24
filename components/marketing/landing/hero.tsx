"use client";

import Link from "next/link";
import { Bell, Radar, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FxBackground } from "@/components/marketing/landing/fx-background";
import { Stagger, StaggerItem } from "@/components/marketing/landing/motion";

const FEATURES = [
  { icon: Radar, label: "Monitoreo HN 24/7" },
  { icon: Target, label: "Scoring de intención" },
  { icon: Sparkles, label: "Borradores con IA" },
  { icon: Bell, label: "Alertas instantáneas" },
];

export function LandingHero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-hidden scroll-mt-24"
    >
      <FxBackground intensity="hero" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-28 text-center">
        <Stagger className="flex max-w-4xl flex-col items-center">
          <StaggerItem>
            <p className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-secondary">
              Tu producto, sus conversaciones
              <span className="rounded-md bg-primary-muted-bg px-1.5 py-0.5 text-xs font-semibold text-primary">
                ✓
              </span>
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="hero-title text-glow">
              Dejá de buscar clientes
              <br />
              en Reddit y HN
            </h1>
          </StaggerItem>

          <StaggerItem>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="feature-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/login" className="cursor-pointer">
                <Button variant="primary" size="lg" showArrow>
                  Empezar gratis
                </Button>
              </Link>
              <Link href="#precios" className="cursor-pointer">
                <Button variant="outline" size="lg">
                  Ver precios
                </Button>
              </Link>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-2 text-xs text-foreground-muted lg:flex">
        Scroll para explorar
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-strong text-primary">
          ↓
        </span>
      </div>
    </section>
  );
}
