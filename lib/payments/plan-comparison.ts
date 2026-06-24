import type { Plan } from "@/types";
import { formatLimit, PLAN_LIMITS, PLAN_ORDER } from "./plans";

export interface PlanComparisonRow {
  label: string;
  hint?: string;
  values: Record<Plan, string | boolean>;
}

export const PLAN_COMPARISON_ROWS: PlanComparisonRow[] = [
  {
    label: "Keywords activas",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [plan, formatLimit(PLAN_LIMITS[plan].maxKeywords)])
    ) as Record<Plan, string>,
  },
  {
    label: "Monitoreo Hacker News",
    values: { free: true, starter: true, growth: true, pro: true },
  },
  {
    label: "Reddit, X e Indie Hackers",
    hint: "A medida que se habiliten en el producto",
    values: { free: false, starter: true, growth: true, pro: true },
  },
  {
    label: "Alertas email / día",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [
        plan,
        formatLimit(PLAN_LIMITS[plan].emailAlertsPerDay),
      ])
    ) as Record<Plan, string>,
  },
  {
    label: "Alertas Slack",
    values: { free: false, starter: true, growth: true, pro: true },
  },
  {
    label: "Borradores IA / mes",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [
        plan,
        PLAN_LIMITS[plan].aiDraftsPerMonth === 0
          ? "—"
          : formatLimit(PLAN_LIMITS[plan].aiDraftsPerMonth),
      ])
    ) as Record<Plan, string>,
  },
  {
    label: "Conversion tracking",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [plan, PLAN_LIMITS[plan].conversionTracking])
    ) as Record<Plan, boolean>,
  },
  {
    label: "API access",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [plan, PLAN_LIMITS[plan].apiAccess])
    ) as Record<Plan, boolean>,
  },
  {
    label: "Seats de equipo",
    values: Object.fromEntries(
      PLAN_ORDER.map((plan) => [plan, String(PLAN_LIMITS[plan].teamSeats)])
    ) as Record<Plan, string>,
  },
];

export const PRICING_FAQ = [
  {
    q: "¿Puedo empezar gratis?",
    a: "Sí. El plan Free incluye 2 keywords y monitoreo de Hacker News sin tarjeta de crédito.",
  },
  {
    q: "¿Cuándo se cobran los planes de pago?",
    a: "Los precios son mensuales. El checkout con tarjeta se conecta cuando elijas tu proveedor de pagos; hasta entonces podés registrarte gratis y explorar el producto.",
  },
  {
    q: "¿Qué pasa si supero el límite de mi plan?",
    a: "Te avisamos con un modal de upgrade. No se pierden tus datos: podés seguir viendo señales existentes mientras decidís si escalás.",
  },
  {
    q: "¿Puedo bajar de plan?",
    a: "Sí, en cualquier momento desde Settings. Volver al Free es instantáneo.",
  },
];
