/** Catálogo de planes, límites y helpers de upgrade — desacoplado del proveedor de pagos */

import type { Plan } from "@/types";

export interface PlanLimits {
  maxKeywords: number;
  aiDraftsPerMonth: number | null;
  emailAlertsPerDay: number | null;
  conversionTracking: boolean;
  apiAccess: boolean;
  teamSeats: number;
}

export interface PlanCatalogEntry {
  id: Plan;
  name: string;
  priceLabel: string;
  priceMonthly: number;
  periodLabel: string;
  highlight?: boolean;
  features: string[];
}

export type LimitFeature =
  | "keywords"
  | "ai_drafts"
  | "email_alerts"
  | "platforms"
  | "conversion_tracking"
  | "api_access";

export const PLAN_ORDER: Plan[] = ["free", "starter", "growth", "pro"];

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxKeywords: 2,
    aiDraftsPerMonth: 0,
    emailAlertsPerDay: 5,
    conversionTracking: false,
    apiAccess: false,
    teamSeats: 1,
  },
  starter: {
    maxKeywords: 5,
    aiDraftsPerMonth: 20,
    emailAlertsPerDay: null,
    conversionTracking: false,
    apiAccess: false,
    teamSeats: 1,
  },
  growth: {
    maxKeywords: 15,
    aiDraftsPerMonth: null,
    emailAlertsPerDay: null,
    conversionTracking: true,
    apiAccess: false,
    teamSeats: 1,
  },
  pro: {
    maxKeywords: Infinity,
    aiDraftsPerMonth: null,
    emailAlertsPerDay: null,
    conversionTracking: true,
    apiAccess: true,
    teamSeats: 3,
  },
};

export const PLAN_CATALOG: Record<Plan, PlanCatalogEntry> = {
  free: {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    priceMonthly: 0,
    periodLabel: "para siempre",
    features: [
      "2 keywords activas",
      "Monitoreo Hacker News",
      "5 alertas email / día",
      "✗ Draft de respuesta (solo pago)",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceLabel: "$29",
    priceMonthly: 29,
    periodLabel: "/ mes",
    features: [
      "5 keywords activas",
      "Alertas email + Slack ilimitadas",
      "20 borradores IA / mes",
      "✓ Draft de respuesta listo para copiar",
      "Todas las plataformas disponibles",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceLabel: "$49",
    priceMonthly: 49,
    periodLabel: "/ mes",
    highlight: true,
    features: [
      "15 keywords activas",
      "Borradores IA ilimitados",
      "✓ Draft de respuesta listo para copiar",
      "Conversion tracking",
      "Alertas ilimitadas",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceLabel: "$79",
    priceMonthly: 79,
    periodLabel: "/ mes",
    features: [
      "Keywords ilimitadas",
      "Borradores IA ilimitados",
      "✓ Draft de respuesta listo para copiar",
      "Conversion tracking avanzado",
      "API access + 3 seats",
    ],
  },
};

const LIMIT_COPY: Record<
  LimitFeature,
  { title: string; description: (plan: PlanCatalogEntry) => string }
> = {
  keywords: {
    title: "Necesitás más keywords",
    description: (plan) =>
      `${plan.name} te permite monitorear más términos en paralelo y no perderte conversaciones de alta intención.`,
  },
  ai_drafts: {
    title: "Desbloqueá borradores IA",
    description: (plan) =>
      `${plan.name} incluye borradores generados por Claude listos para editar y publicar.`,
  },
  email_alerts: {
    title: "Más alertas por email",
    description: (plan) =>
      `${plan.name} elimina el límite diario de alertas para que no te pierdas ninguna señal.`,
  },
  platforms: {
    title: "Más plataformas",
    description: (plan) =>
      `${plan.name} desbloquea monitoreo en todas las plataformas activas de SubSignal.`,
  },
  conversion_tracking: {
    title: "Conversion tracking",
    description: (plan) =>
      `${plan.name} incluye métricas de clicks y conversiones desde tus respuestas.`,
  },
  api_access: {
    title: "API access",
    description: (plan) =>
      `${plan.name} incluye acceso a la API y seats de equipo para escalar tu workflow.`,
  },
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function getPlanCatalog(plan: Plan): PlanCatalogEntry {
  return PLAN_CATALOG[plan];
}

export function comparePlans(a: Plan, b: Plan): number {
  return PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b);
}

export function isPlanAtLeast(current: Plan, required: Plan): boolean {
  return comparePlans(current, required) >= 0;
}

/** Siguiente plan recomendado para desbloquear una feature */
export function getRecommendedPlan(current: Plan, feature: LimitFeature): Plan | null {
  if (feature === "keywords") {
    if (current === "free") return "starter";
    if (current === "starter") return "growth";
    if (current === "growth") return "pro";
    return null;
  }

  if (feature === "ai_drafts" || feature === "email_alerts" || feature === "platforms") {
    if (current === "free") return "starter";
    if (current === "starter") return "growth";
    return null;
  }

  if (feature === "conversion_tracking") {
    if (!PLAN_LIMITS[current].conversionTracking) return "growth";
    return null;
  }

  if (feature === "api_access") {
    if (!PLAN_LIMITS[current].apiAccess) return "pro";
    return null;
  }

  return null;
}

export function getUpgradeCopy(feature: LimitFeature, targetPlan: Plan) {
  const plan = getPlanCatalog(targetPlan);
  const copy = LIMIT_COPY[feature];
  return {
    title: copy.title,
    description: copy.description(plan),
    plan,
  };
}

export function formatLimit(value: number | null): string {
  if (value === null) return "Ilimitado";
  if (value === Infinity) return "Ilimitado";
  return String(value);
}
