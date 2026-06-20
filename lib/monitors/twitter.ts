/**
 * Monitor de Twitter/X — estructura lista, fetch pendiente.
 *
 * Opciones a evaluar antes de implementar:
 * - API oficial de X (tiene costos y límites estrictos desde 2023)
 * - Alternativas de terceros (Nitter ya no es viable, servicios pagos)
 * - Evaluar si vale la pena en fase posterior del producto
 */

import type { PlatformMonitor } from "./types";

export const twitterMonitor: PlatformMonitor = {
  platform: "twitter",
  async fetchNewPosts(keyword, config) {
    void keyword;
    void config;
    throw new Error(
      "Twitter monitor pendiente: evaluar acceso API disponible y costos"
    );
  },
};
