/** Verificación centralizada de límites por plan (solo lee profiles.plan) */

import type { Plan } from "@/types";
import {
  getPlanLimits,
  getRecommendedPlan,
  type LimitFeature,
} from "./plans";

export interface LimitCheckResult {
  allowed: boolean;
  feature: LimitFeature;
  currentPlan: Plan;
  recommendedPlan: Plan | null;
  message?: string;
  used?: number;
  limit?: number | null;
}

export function checkKeywordLimit(input: {
  plan: Plan;
  activeKeywordCount: number;
}): LimitCheckResult {
  const limits = getPlanLimits(input.plan);
  const limit = limits.maxKeywords;
  const allowed =
    limit === Infinity ? true : input.activeKeywordCount < limit;

  return {
    allowed,
    feature: "keywords",
    currentPlan: input.plan,
    recommendedPlan: allowed ? null : getRecommendedPlan(input.plan, "keywords"),
    used: input.activeKeywordCount,
    limit: limit === Infinity ? null : limit,
    message: allowed
      ? undefined
      : `Tu plan ${input.plan} permite hasta ${limit} keywords activas.`,
  };
}

export function checkAiDraftLimit(input: {
  plan: Plan;
  draftsUsedThisMonth: number;
}): LimitCheckResult {
  const limits = getPlanLimits(input.plan);
  const limit = limits.aiDraftsPerMonth;

  if (limit === 0) {
    return {
      allowed: false,
      feature: "ai_drafts",
      currentPlan: input.plan,
      recommendedPlan: getRecommendedPlan(input.plan, "ai_drafts"),
      used: 0,
      limit: 0,
      message: "Tu plan Free no incluye borradores IA.",
    };
  }

  if (limit === null) {
    return {
      allowed: true,
      feature: "ai_drafts",
      currentPlan: input.plan,
      recommendedPlan: null,
    };
  }

  const allowed = input.draftsUsedThisMonth < limit;

  return {
    allowed,
    feature: "ai_drafts",
    currentPlan: input.plan,
    recommendedPlan: allowed ? null : getRecommendedPlan(input.plan, "ai_drafts"),
    used: input.draftsUsedThisMonth,
    limit,
    message: allowed
      ? undefined
      : `Alcanzaste el límite de ${limit} borradores IA este mes.`,
  };
}

export function checkEmailAlertLimit(input: {
  plan: Plan;
  alertsToday: number;
}): LimitCheckResult {
  const limits = getPlanLimits(input.plan);
  const limit = limits.emailAlertsPerDay;

  if (limit === null) {
    return {
      allowed: true,
      feature: "email_alerts",
      currentPlan: input.plan,
      recommendedPlan: null,
    };
  }

  const allowed = input.alertsToday < limit;

  return {
    allowed,
    feature: "email_alerts",
    currentPlan: input.plan,
    recommendedPlan: allowed ? null : getRecommendedPlan(input.plan, "email_alerts"),
    used: input.alertsToday,
    limit,
    message: allowed
      ? undefined
      : `Alcanzaste el límite de ${limit} alertas email hoy.`,
  };
}

export function checkPlatformAccess(input: {
  plan: Plan;
  platform: string;
}): LimitCheckResult {
  if (input.plan === "free" && input.platform !== "hn") {
    return {
      allowed: false,
      feature: "platforms",
      currentPlan: input.plan,
      recommendedPlan: getRecommendedPlan(input.plan, "platforms"),
      message: "Plan Free: solo Hacker News. Actualizá tu plan para más plataformas.",
    };
  }

  return {
    allowed: true,
    feature: "platforms",
    currentPlan: input.plan,
    recommendedPlan: null,
  };
}

export function checkConversionTracking(input: { plan: Plan }): LimitCheckResult {
  const limits = getPlanLimits(input.plan);

  if (limits.conversionTracking) {
    return {
      allowed: true,
      feature: "conversion_tracking",
      currentPlan: input.plan,
      recommendedPlan: null,
    };
  }

  return {
    allowed: false,
    feature: "conversion_tracking",
    currentPlan: input.plan,
    recommendedPlan: getRecommendedPlan(input.plan, "conversion_tracking"),
    message: "Conversion tracking está disponible desde el plan Growth.",
  };
}

export function checkApiAccess(input: { plan: Plan }): LimitCheckResult {
  const limits = getPlanLimits(input.plan);

  if (limits.apiAccess) {
    return {
      allowed: true,
      feature: "api_access",
      currentPlan: input.plan,
      recommendedPlan: null,
    };
  }

  return {
    allowed: false,
    feature: "api_access",
    currentPlan: input.plan,
    recommendedPlan: getRecommendedPlan(input.plan, "api_access"),
    message: "API access está disponible en el plan Pro.",
  };
}
