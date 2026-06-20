/**
 * Monitor de Indie Hackers — estructura lista, fetch pendiente.
 *
 * Indie Hackers no tiene API pública oficial.
 * Opciones a evaluar:
 * - Scraping controlado (fragil, requiere mantenimiento)
 * - RSS feeds limitados si están disponibles
 * - Monitoreo manual o integración vía servicios de terceros
 */

import type { PlatformMonitor } from "./types";

export const indieHackersMonitor: PlatformMonitor = {
  platform: "ih",
  async fetchNewPosts(keyword, config) {
    void keyword;
    void config;
    throw new Error(
      "Indie Hackers monitor pendiente: no hay API pública, definir enfoque de extracción"
    );
  },
};
