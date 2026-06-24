import type { MarketingPlan } from "@/lib/marketing/pricing-plans";
import { PAID_PLAN_CHECKOUT } from "@/lib/marketing/pricing-plans";

/** Planes mostrados en la sección #precios de la landing (/) */
export const LANDING_PRICING_PLANS: MarketingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Para explorar la plataforma",
    cta: { label: "Empezar gratis", href: "/signup", variant: "ghost" },
    features: [
      { text: "2 keywords activas", included: true, tone: "muted" },
      { text: "Monitoreo Hacker News", included: true, tone: "muted" },
      { text: "5 alertas email / día", included: true, tone: "muted" },
      { text: "Sin borradores IA", included: true, tone: "muted" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$14.99",
    description: "Para founders que quieren clientes reales",
    featured: true,
    cta: {
      label: "Elegir Starter",
      href: PAID_PLAN_CHECKOUT.starter,
      variant: "accent",
    },
    features: [
      { text: "5 keywords activas", included: true, tone: "green" },
      { text: "Hacker News + Reddit", included: true, tone: "green" },
      { text: "Alertas ilimitadas", included: true, tone: "green" },
      { text: "20 borradores IA / mes", included: true, tone: "green" },
      { text: "Respuesta lista para copiar", included: true, tone: "green" },
      { text: "Email alerts", included: true, tone: "green" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    description: "Para founders que escalan",
    cta: {
      label: "Elegir Pro",
      href: PAID_PLAN_CHECKOUT.pro,
      variant: "ghost",
    },
    features: [
      { text: "15 keywords activas", included: true, tone: "white" },
      { text: "Todas las plataformas", included: true, tone: "white" },
      { text: "Drafts ilimitados", included: true, tone: "white" },
      { text: "Email + Slack alerts", included: true, tone: "white" },
      { text: "Conversion tracking", included: true, tone: "white" },
      { text: "Soporte prioritario", included: true, tone: "white" },
    ],
  },
];
