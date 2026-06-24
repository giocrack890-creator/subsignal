import { getAppUrl } from "@/lib/auth/urls";
import { checkConversionTracking } from "@/lib/payments/checks";
import type { Plan } from "@/types";

export function getTrackedPostUrl(signalId: string): string {
  return `${getAppUrl().replace(/\/$/, "")}/api/r/${signalId}`;
}

export function getSignalOutboundUrl(
  signal: { id: string; url: string },
  plan: Plan
): string {
  if (checkConversionTracking({ plan }).allowed) {
    return getTrackedPostUrl(signal.id);
  }
  return signal.url;
}
