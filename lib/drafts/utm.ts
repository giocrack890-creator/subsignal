/** UTM automático al copiar draft */

import { getAppUrl } from "@/lib/auth/urls";

export function appendUtmToUrl(
  url: string,
  input: { signalId: string; keyword?: string; platform?: string }
): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "threadpulse");
    parsed.searchParams.set("utm_medium", "reply");
    parsed.searchParams.set("utm_campaign", input.keyword?.slice(0, 40) ?? "signal");
    parsed.searchParams.set("utm_content", input.signalId.slice(0, 8));
    if (input.platform) parsed.searchParams.set("utm_term", input.platform);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}utm_source=threadpulse&utm_medium=reply&utm_content=${input.signalId.slice(0, 8)}`;
  }
}

export function getTrackedProductUrl(
  productUrl: string,
  signalId: string
): string {
  return appendUtmToUrl(productUrl, { signalId });
}

export function getAppTrackedUrl(signalId: string): string {
  return `${getAppUrl().replace(/\/$/, "")}/api/r/${signalId}`;
}
