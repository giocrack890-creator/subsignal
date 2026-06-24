export type FeatureTone = "muted" | "green" | "white";

export interface MarketingPlanFeature {
  text: string;
  included: boolean;
  tone?: FeatureTone;
}

export interface MarketingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  cta: { label: string; href: string; variant: "ghost" | "accent" };
  featured?: boolean;
  features: MarketingPlanFeature[];
}

// TODO: reemplazar con URL de checkout CREEM cuando esté creado el producto Starter
export const CREEM_CHECKOUT_STARTER = "#";

// TODO: reemplazar con URL de checkout CREEM cuando esté creado el producto Pro
export const CREEM_CHECKOUT_PRO = "#";

export const MARKETING_PLANS: MarketingPlan[] = [
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
