import { PlatformNotImplementedError } from "./errors";
import type { PlatformConfig, PlatformMeta, PlatformMonitor } from "./types";

interface StubMonitorOptions {
  meta: PlatformMeta;
  validateConfig?: (config?: PlatformConfig) => string | null;
}

/**
 * Factory para monitores con interfaz completa pero sin fetch real.
 * Usado por Reddit, Twitter e Indie Hackers hasta definir el método de datos.
 */
export function createStubMonitor(options: StubMonitorOptions): PlatformMonitor {
  const { meta, validateConfig } = options;

  return {
    platform: meta.platform,
    meta,
    validateConfig,

    async fetchNewPosts(keyword, config) {
      const configError = validateConfig?.(config);
      if (configError) {
        throw new Error(configError);
      }

      void keyword;
      void config;
      throw new PlatformNotImplementedError(meta);
    },
  };
}
