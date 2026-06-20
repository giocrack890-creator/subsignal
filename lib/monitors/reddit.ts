/**
 * Monitor de Reddit — estructura lista, fetch pendiente.
 *
 * Opciones a evaluar antes de implementar:
 * - API oficial de Reddit (requiere app registrada en reddit.com/prefs/apps)
 * - JSON endpoints públicos de solo lectura (limitados, pueden cambiar)
 * - Servicios de terceros (Pushshift alternativas, etc.)
 */

import type { PlatformMonitor } from "./types";

export const redditMonitor: PlatformMonitor = {
  platform: "reddit",
  async fetchNewPosts(keyword, config) {
    void keyword;
    void config;
    throw new Error(
      "Reddit monitor pendiente: definir método de fetch (API oficial vs alternativas)"
    );
  },
};
