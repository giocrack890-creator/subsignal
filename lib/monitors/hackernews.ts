/** Monitor de Hacker News — implementación completa en PASO 4 */

import type { PlatformMonitor } from "./types";

export const hackerNewsMonitor: PlatformMonitor = {
  platform: "hn",
  async fetchNewPosts() {
    throw new Error("Hacker News monitor no implementado — PASO 4");
  },
};
