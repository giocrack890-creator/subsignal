"use client";

import Link from "next/link";
import { Activity, Ban, Clock, MessageCircleWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/landing/motion";

const PROBLEMS = [
  {
    icon: Ban,
    title: "Fácil de ser baneado",
    desc: "Un movimiento equivocado y te expulsan de comunidades. Reddit tiene reglas estrictas de autopromoción.",
  },
  {
    icon: Clock,
    title: "El timing lo es todo",
    desc: "Publicar a la hora o subreddit incorrecto y tu mensaje queda enterrado al instante.",
  },
  {
    icon: MessageCircleWarning,
    title: "Difícil sonar auténtico",
    desc: "Los redditors detectan marketing a kilómetros. Tenés que ayudar de verdad, no solo vender.",
  },
];

export function LandingRedditChallenges() {
  return (
    <section
      className="landing-section border-t border-border bg-background-elevated/30"
      aria-labelledby="reddit-hard-heading"
    >
      <div className="container-marketing px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2
            id="reddit-hard-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            <span className="text-foreground-secondary">Pero... </span>
            <span className="text-reddit">marketing en Reddit</span>{" "}
            <span className="text-foreground">es difícil</span>
          </h2>
          <p className="mt-4 text-[15px] text-foreground-secondary">
            Sin el enfoque correcto, perdés horas y corrés el riesgo de ser
            baneado.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-background-card p-6">
                  <Icon
                    className="h-6 w-6 text-reddit"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-base font-semibold text-reddit">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2} className="mt-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-reddit/20 bg-gradient-to-b from-reddit/10 to-background-card px-6 py-10 text-center">
            <Activity
              className="mx-auto h-6 w-6 text-reddit"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              Por eso existe esta herramienta
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-foreground-secondary">
              Encontramos las conversaciones correctas en Reddit y Hacker News,
              las rankeamos por intención y te ayudamos a responder con
              autenticidad.
            </p>
            <Link href="/login" className="mt-6 inline-block cursor-pointer">
              <Button variant="primary" size="lg" showArrow>
                Empezar a encontrar clientes
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
