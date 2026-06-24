"use client";

import Link from "next/link";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

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
          title="SubSignal está en beta"
        />

        <FadeIn className="mx-auto mt-10 max-w-[600px]">
          <div
            className="rounded-xl px-8 py-8 text-center"
            style={{
              backgroundColor: "#111714",
              border: "1px solid rgba(52, 211, 153, 0.2)",
            }}
          >
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.1)",
                color: "#34D399",
              }}
            >
              Beta pública
            </span>

            <p className="mt-5 text-base leading-relaxed text-[#B4B4B4]">
              Somos un producto en construcción activa. Si lo usás en estos
              primeros meses, tu feedback llega directo al founder — no a un
              equipo de soporte.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
              Los primeros 50 usuarios que dejen feedback aparecen en esta
              sección con su nombre y producto.
            </p>

            <Link
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-[10px] border px-5 py-3 text-sm font-semibold transition-colors hover:bg-[rgba(52,211,153,0.08)]"
              style={{
                borderColor: "#34D399",
                color: "#34D399",
                backgroundColor: "transparent",
              }}
            >
              Unirme a la beta →
            </Link>
          </div>
        </FadeIn>

        <p className="mt-6 text-center text-xs text-[#4B4B4B]">
          Founders ya monitoreando señales en Hacker News.
        </p>
      </div>
    </section>
  );
}
