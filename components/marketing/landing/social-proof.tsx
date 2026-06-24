"use client";

import Link from "next/link";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";
import { Button } from "@/components/ui/button";

export function LandingSocialProof() {
  return (
    <section
      id="social"
      className="landing-section relative scroll-mt-24 border-t border-border bg-background-elevated/40"
      aria-labelledby="social-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="social-heading"
          title="Estamos en beta — y eso es una ventaja para vos"
          subtitle="Los primeros usuarios dan forma al producto. Tu feedback directo llega al founder, no a un equipo de soporte."
        />

        <FadeIn className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl border border-primary/30 bg-[#111714] px-6 py-8 text-center md:px-10 md:py-10">
            <p className="text-base leading-relaxed text-foreground-secondary md:text-lg">
              Somos un producto nuevo y estamos construyendo esto junto a los
              primeros founders que lo usan. Si querés ser de los primeros en dar
              feedback y aparecer acá, empezá gratis hoy.
            </p>
            <Link href="/signup" className="mt-6 inline-block">
              <Button variant="accent" size="md">
                Unirme a la beta
              </Button>
            </Link>
          </div>
        </FadeIn>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Ya hay founders monitoreando señales en Hacker News.
        </p>
      </div>
    </section>
  );
}
