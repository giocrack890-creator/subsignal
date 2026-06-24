"use client";

import { SectionHeading } from "@/components/marketing/landing/section-heading";

const TESTIMONIALS = [
  {
    quote:
      "Dejé de scrollear HN a mano. SubSignal me avisa cuando alguien pregunta exactamente lo que resuelvo.",
    author: "Founder, SaaS B2B",
    role: "Early adopter",
  },
  {
    quote:
      "El scoring filtra el ruido. Solo veo conversaciones donde tiene sentido responder.",
    author: "Indie hacker",
    role: "Plan Starter",
  },
  {
    quote:
      "Los borradores son un punto de partida honesto — los edito y suenan como yo, no como un bot.",
    author: "Solo founder",
    role: "Plan Growth",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#22C55E]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export function LandingSocialProof() {
  return (
    <>
      <hr className="sf-divider" />
      <section
        id="social"
        className="sf-section scroll-mt-24"
        aria-labelledby="social-heading"
      >
        <SectionHeading
          id="social-heading"
          eyebrow="Testimonios"
          title="Construido por founders, para founders"
          subtitle="Estamos en beta temprana. Estos son los primeros feedbacks de quienes ya monitorean señales."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <blockquote key={item.author} className="sf-card p-7">
              <Stars />
              <p className="mt-4 text-[15px] italic leading-relaxed text-[#A1A1AA]">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-5">
                <cite className="not-italic">
                  <span className="block text-[13px] font-bold text-[#FAFAFA]">
                    {item.author}
                  </span>
                  <span className="text-xs text-[#71717A]">{item.role}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
