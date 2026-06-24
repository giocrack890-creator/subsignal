"use client";

import Link from "next/link";
import { useState } from "react";

// TODO: reemplazar con URL de checkout CREEM cuando esté creado el producto Starter
const CREEM_CHECKOUT_STARTER = "#";

// TODO: reemplazar con URL de checkout CREEM cuando esté creado el producto Pro
const CREEM_CHECKOUT_PRO = "#";

type FeatureTone = "muted" | "green" | "white";

interface PlanFeature {
  text: string;
  included: boolean;
  tone?: FeatureTone;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  cta: { label: string; href: string; variant: "ghost" | "accent" };
  featured?: boolean;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Para explorar SubSignal",
    cta: { label: "Empezar gratis", href: "/signup", variant: "ghost" },
    features: [
      { text: "2 keywords activas", included: true, tone: "muted" },
      { text: "Solo Hacker News", included: true, tone: "muted" },
      { text: "5 alertas por día", included: true, tone: "muted" },
      { text: "Drafts de respuesta", included: false },
      { text: "Slack alerts", included: false },
      { text: "Conversion tracking", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$14.99",
    description: "Para founders que quieren clientes reales",
    featured: true,
    cta: {
      label: "Empezar con Starter",
      href: CREEM_CHECKOUT_STARTER,
      variant: "accent",
    },
    features: [
      { text: "5 keywords activas", included: true, tone: "green" },
      { text: "Hacker News + Reddit", included: true, tone: "green" },
      { text: "Alertas ilimitadas", included: true, tone: "green" },
      { text: "20 drafts de respuesta por mes", included: true, tone: "green" },
      { text: "Respuesta lista para copiar", included: true, tone: "green" },
      { text: "Email alerts", included: true, tone: "green" },
      { text: "Slack alerts", included: false },
      { text: "Conversion tracking", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    description: "Para founders que escalan",
    cta: {
      label: "Empezar con Pro",
      href: CREEM_CHECKOUT_PRO,
      variant: "ghost",
    },
    features: [
      { text: "15 keywords activas", included: true, tone: "white" },
      {
        text: "Todas las plataformas (HN + Reddit + Twitter + Indie Hackers)",
        included: true,
        tone: "white",
      },
      { text: "Alertas ilimitadas", included: true, tone: "white" },
      { text: "Drafts ilimitados", included: true, tone: "white" },
      { text: "Respuesta lista para copiar", included: true, tone: "white" },
      { text: "Email + Slack alerts", included: true, tone: "white" },
      { text: "Conversion tracking", included: true, tone: "white" },
      { text: "Soporte prioritario", included: true, tone: "white" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer:
      "Sí. Podés cancelar desde tu cuenta en cualquier momento. No hay períodos mínimos ni penalidades. Al cancelar, tu plan sigue activo hasta el final del período pagado.",
  },
  {
    question: "¿Qué plataformas monitorea SubSignal?",
    answer:
      "Actualmente Hacker News está activo. Reddit está disponible en planes Starter y Pro. Twitter/X e Indie Hackers están disponibles en el plan Pro y se están expandiendo. Avisamos por email cuando agregamos nuevas plataformas.",
  },
  {
    question: "¿Qué es un draft de respuesta?",
    answer:
      "Cuando SubSignal encuentra una conversación donde tu cliente ideal pide exactamente lo que vos vendés, genera un borrador de respuesta genuino y útil listo para copiar. Vos lo revisás, lo ajustás si querés, y lo publicás desde tu cuenta. Nunca publicamos automáticamente — siempre sos vos.",
  },
  {
    question: "¿Cómo cobran? ¿Puedo pagar con tarjeta?",
    answer:
      "Aceptamos tarjetas de crédito y débito de todo el mundo (Visa, Mastercard, Amex). El cobro es mensual y automático. Los pagos son procesados de forma segura.",
  },
  {
    question: "¿Puedo cambiar de plan?",
    answer:
      "Sí, podés upgradear o bajar de plan en cualquier momento desde tu configuración. Los cambios aplican al próximo período de facturación.",
  },
];

function FeatureRow({ feature }: { feature: PlanFeature }) {
  if (!feature.included) {
    return (
      <li className="flex items-start gap-2.5 text-sm text-[#6B6B6B]">
        <span className="mt-0.5 shrink-0" aria-hidden>
          ✗
        </span>
        <span className="line-through">{feature.text}</span>
      </li>
    );
  }

  const color =
    feature.tone === "green"
      ? "text-[#34D399]"
      : feature.tone === "white"
        ? "text-white"
        : "text-[#6B6B6B]";

  return (
    <li className={`flex items-start gap-2.5 text-sm ${color}`}>
      <span className="mt-0.5 shrink-0 text-[#34D399]" aria-hidden>
        ✓
      </span>
      <span>{feature.text}</span>
    </li>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isFeatured = plan.featured;
  const isExternal = plan.cta.href.startsWith("http") || plan.cta.href === "#";

  const buttonClass =
    plan.cta.variant === "accent"
      ? "flex w-full items-center justify-center rounded-[10px] bg-[#34D399] px-5 py-3.5 text-sm font-bold text-black transition-colors hover:bg-[#2bb88a]"
      : "flex w-full items-center justify-center rounded-[10px] border border-white bg-transparent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#34D399]";

  const ctaButton = isExternal ? (
    <a href={plan.cta.href} className={buttonClass}>
      {plan.cta.label}
    </a>
  ) : (
    <Link href={plan.cta.href} className={buttonClass}>
      {plan.cta.label}
    </Link>
  );

  return (
    <article
      className={`relative flex flex-col rounded-[14px] p-6 md:p-8 ${
        isFeatured
          ? "border border-[rgba(52,211,153,0.4)] bg-[#111714] shadow-[0_0_40px_rgba(52,211,153,0.12)]"
          : "border border-[#232323] bg-[#111714]"
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#34D399] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
          Más popular
        </span>
      )}

      <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{plan.price}</span>
        <span className="text-sm text-[#6B6B6B]">/mes</span>
      </div>
      <p className="mt-2 text-sm text-[#B4B4B4]">{plan.description}</p>

      <div className="mt-6">{ctaButton}</div>

      <ul className="mt-8 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <FeatureRow key={feature.text} feature={feature} />
        ))}
      </ul>
    </article>
  );
}

function PricingFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`border-b border-[#232323] ${isOpen ? "open" : ""}`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-white">
                {item.question}
              </span>
              <span
                className="shrink-0 text-2xl font-light text-[#6B6B6B] transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(0deg)" : "rotate(0deg)" }}
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-base leading-relaxed text-[#B4B4B4]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PricingPageContent() {
  return (
    <main id="main-content" className="pt-24 pb-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#34D399]">
            Planes simples
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Encontrá a tu próximo cliente todos los días
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#B4B4B4]">
            Empezá gratis. Upgrades cuando lo necesitás. Sin contratos, cancelás
            cuando querés.
          </p>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#6B6B6B]">
          Todos los planes incluyen cancelación inmediata. Sin preguntas, sin
          períodos de aviso.
        </p>

        <section className="mt-20" aria-labelledby="pricing-faq-heading">
          <h2
            id="pricing-faq-heading"
            className="text-center text-2xl font-semibold text-white md:text-3xl"
          >
            Preguntas frecuentes
          </h2>
          <div className="mt-10">
            <PricingFaqAccordion />
          </div>
        </section>
      </div>
    </main>
  );
}
