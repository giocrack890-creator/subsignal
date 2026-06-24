"use client";

import Link from "next/link";
import { Bell, Radar, Shield, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FxBackground } from "@/components/marketing/landing/fx-background";
import { Stagger, StaggerItem } from "@/components/marketing/landing/motion";

const FEATURES = [
  { icon: Radar, label: "Monitoreo Reddit + HN 24/7" },
  { icon: Target, label: "Ranking por intención" },
  { icon: Sparkles, label: "Borradores con IA" },
  { icon: Bell, label: "Alertas en tiempo real" },
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
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-reddit/20 bg-reddit/10 px-3 py-1 text-xs font-medium text-reddit">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Encontrá clientes antes que tu competencia
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="hero-title text-glow">
              Encontrá clientes en{" "}
              <span className="text-reddit">Reddit</span>
              <br />y Hacker News
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-foreground-secondary">
              Escaneamos conversaciones 24/7, detectamos señales de alta
              intención, alerta menciones de tu marca y competidores, y te
              prepara respuestas auténticas con IA.
            </p>
          </StaggerItem>

          <StaggerItem>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="feature-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/login" className="cursor-pointer">
                <Button variant="primary" size="lg" showArrow>
                  Empezar a encontrar clientes
                </Button>
              </Link>
              <Link href="#precios" className="cursor-pointer">
                <Button variant="outline" size="lg">
                  Ver precios
                </Button>
              </Link>
            </div>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-foreground-muted">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Sin auto-post · Vos editás y publicás
            </p>
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
