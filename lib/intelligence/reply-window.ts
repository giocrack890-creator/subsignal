/** Predicción de reply window por plataforma */

import type { Platform } from "@/types";

const REPLY_WINDOW_HOURS: Partial<Record<Platform, number>> = {
  hn: 6,
  reddit: 24,
  twitter: 3,
  ih: 12,
  github: 48,
  rss: 72,
  google_alert: 24,
  app_store: 48,
  slack: 12,
};

export function computeReplyWindow(platform: Platform, foundAt: Date = new Date()): {
  hours: number;
  endsAt: string;
  urgencyLabel: string;
} {
  const hours = REPLY_WINDOW_HOURS[platform] ?? 12;
  const endsAt = new Date(foundAt.getTime() + hours * 60 * 60 * 1000);
  const remainingMs = endsAt.getTime() - Date.now();
  const remainingHours = Math.max(0, Math.ceil(remainingMs / (60 * 60 * 1000)));

  let urgencyLabel: string;
  if (remainingMs <= 0) {
    urgencyLabel = "Ventana cerrada — baja visibilidad";
  } else if (remainingHours <= 3) {
    urgencyLabel = `Respondé en las próximas ${remainingHours}h o perdés visibilidad`;
  } else {
    urgencyLabel = `Mejor responder antes de ${remainingHours}h`;
  }

  return { hours, endsAt: endsAt.toISOString(), urgencyLabel };
}

export function isReplyWindowOpen(endsAt: string | null): boolean {
  if (!endsAt) return true;
  return new Date(endsAt).getTime() > Date.now();
}
