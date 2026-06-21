import type { Platform } from "@/types";
import type { PlatformMeta } from "./types";

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  hn: {
    platform: "hn",
    label: "Hacker News",
    status: "active",
    blockers: [],
    optionsToEvaluate: [],
    implementationNotes:
      "Operativo vía Algolia API (search_by_date). Sin credenciales.",
    dataSource: "Algolia HN Search API",
  },
  reddit: {
    platform: "reddit",
    label: "Reddit",
    status: "coming_soon",
    blockers: [
      "Definir método de autenticación (OAuth app vs endpoints públicos limitados)",
      "Evaluar costos y rate limits de la API oficial",
      "Decidir alcance: subreddits específicos vs búsqueda global",
    ],
    optionsToEvaluate: [
      "API oficial de Reddit (reddit.com/prefs/apps — requiere client_id/secret)",
      "JSON endpoints públicos de solo lectura (frágiles, pueden cambiar sin aviso)",
      "Servicios de terceros (Pushshift alternativas, Apify, etc.)",
    ],
    implementationNotes:
      "El schema ya soporta subreddits por keyword. Falta implementar fetchNewPosts y activar en ACTIVE_PLATFORMS.",
    requiredEnvVars: [
      "REDDIT_CLIENT_ID (si API oficial)",
      "REDDIT_CLIENT_SECRET (si API oficial)",
    ],
    dataSource: "Pendiente — API oficial o alternativa",
  },
  twitter: {
    platform: "twitter",
    label: "Twitter/X",
    status: "coming_soon",
    blockers: [
      "API de X con costos elevados y límites estrictos desde 2023",
      "Evaluar ROI vs otras plataformas con mejor señal/costo",
      "Definir si entra en MVP o fase posterior del producto",
    ],
    optionsToEvaluate: [
      "API oficial de X (Basic/Pro tier — costo mensual)",
      "Servicios agregadores de social listening (Brand24, Mention, etc.)",
      "Posponer hasta validar tracción en HN + Reddit",
    ],
    implementationNotes:
      "Estructura lista. Activar solo cuando haya presupuesto y acceso API confirmado.",
    requiredEnvVars: ["X_API_BEARER_TOKEN (si API oficial)"],
    dataSource: "Pendiente — API oficial de X o servicio de terceros",
  },
  ih: {
    platform: "ih",
    label: "Indie Hackers",
    status: "coming_soon",
    blockers: [
      "No existe API pública oficial de Indie Hackers",
      "Definir enfoque de extracción (scraping vs RSS vs manual)",
      "Evaluar mantenimiento y fragilidad del método elegido",
    ],
    optionsToEvaluate: [
      "Scraping controlado del sitio (requiere parser + mantenimiento)",
      "RSS/Atom feeds limitados si están disponibles para posts recientes",
      "Integración vía servicio de terceros o monitoreo semi-manual",
    ],
    implementationNotes:
      "Prioridad baja vs HN/Reddit. Implementar cuando el pipeline multi-plataforma esté validado.",
    dataSource: "Pendiente — sin API pública",
  },
};

export function getPlatformMeta(platform: Platform): PlatformMeta {
  return PLATFORM_META[platform];
}

export function getComingSoonPlatforms(): PlatformMeta[] {
  return Object.values(PLATFORM_META).filter((m) => m.status === "coming_soon");
}
