/** Interfaz de pagos desacoplada — implementación en PASO 8 */

import type { Plan } from "@/types";

export interface PlanLimits {
  maxKeywords: number;
  aiDraftsPerMonth: number | null;
  emailAlertsPerDay: number | null;
  conversionTracking: boolean;
  apiAccess: boolean;
  teamSeats: number;
}

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

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}
