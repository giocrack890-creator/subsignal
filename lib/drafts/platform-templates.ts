/** Plantillas de draft por plataforma — longitud y estilo */

import type { Platform } from "@/types";

export interface PlatformDraftStyle {
  maxChars: number;
  tone: string;
  structure: string;
}

export const PLATFORM_DRAFT_STYLES: Record<Platform, PlatformDraftStyle> = {
  hn: {
    maxChars: 800,
    tone: "directo, técnico, sin marketing",
    structure: "1-2 párrafos cortos. Sin emojis. Mencioná experiencia real.",
  },
  reddit: {
    maxChars: 1200,
    tone: "conversacional, útil, no spam",
    structure: "Saludo breve + valor concreto + pregunta de seguimiento opcional.",
  },
  twitter: {
    maxChars: 280,
    tone: "conciso, punchy",
    structure: "Una idea. Sin links largos. Máximo 2 oraciones.",
  },
  ih: {
    maxChars: 1000,
    tone: "founder-to-founder, transparente",
    structure: "Compartí aprendizaje + cómo resolvés el pain point.",
  },
  github: {
    maxChars: 1000,
    tone: "técnico, orientado a issues",
    structure: "Referenciá el issue + solución concreta sin spam.",
  },
  rss: {
    maxChars: 800,
    tone: "informativo, útil",
    structure: "Comentario breve con valor agregado al artículo.",
  },
  google_alert: {
    maxChars: 800,
    tone: "contextual, relevante",
    structure: "Respondé al contexto de la alerta con insight accionable.",
  },
  app_store: {
    maxChars: 600,
    tone: "empático, solución",
    structure: "Reconocé el pain + cómo tu app lo resuelve.",
  },
  slack: {
    maxChars: 600,
    tone: "comunidad, casual",
    structure: "Mensaje corto útil para el canal.",
  },
};

export function getPlatformDraftInstruction(platform: Platform): string {
  const style = PLATFORM_DRAFT_STYLES[platform];
  return `Plataforma: ${platform}. Máx ${style.maxChars} caracteres. Tono: ${style.tone}. Estructura: ${style.structure}`;
}

export function getAnonymousFounderInstruction(): string {
  return (
    "Modo founder anónimo: NO suenes a marketing. Sin 'revolucionario', 'game-changer', " +
    "ni CTAs agresivos. Compartí como un builder que ayuda, no como vendedor."
  );
}
