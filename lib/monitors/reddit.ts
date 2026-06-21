/**
 * Monitor de Reddit — adapter stub (PASO 6)
 *
 * DECISIÓN PENDIENTE: elegir fuente de datos antes de implementar fetchNewPosts.
 *
 * Cuando se implemente, el flujo esperado es:
 * 1. Recibir keyword + subreddits opcionales desde PlatformConfig
 * 2. Buscar posts/comentarios de las últimas 24h que coincidan
 * 3. Normalizar a RawPost con externalId, subreddit, url, etc.
 * 4. Activar "reddit" en ACTIVE_PLATFORMS (lib/monitors/types.ts)
 *
 * Referencia de implementación futura (API oficial):
 *   GET https://oauth.reddit.com/r/{subreddit}/search?q={keyword}&sort=new&t=day
 *   Headers: Authorization: Bearer {token}, User-Agent: SubSignal/1.0
 */

import { createStubMonitor } from "./create-stub-monitor";
import { PLATFORM_META } from "./status";
import type { PlatformConfig } from "./types";

const REDDIT_LOOKBACK_HOURS = 24;

/** Valida config de Reddit antes de un fetch real */
export function validateRedditConfig(config?: PlatformConfig): string | null {
  const subreddits = config?.subreddits ?? [];

  if (subreddits.some((s) => !/^[a-zA-Z0-9_]{2,21}$/.test(s))) {
    return "Nombre de subreddit inválido (2-21 caracteres alfanuméricos)";
  }

  return null;
}

/**
 * Pseudocódigo del fetch real — NO implementado.
 *
 * async function searchRedditPosts(
 *   keyword: string,
 *   config: PlatformConfig
 * ): Promise<RawPost[]> {
 *   const subreddits = config.subreddits?.length
 *     ? config.subreddits
 *     : ["all"];
 *   const since = Date.now() - REDDIT_LOOKBACK_HOURS * 3600 * 1000;
 *
 *   for (const subreddit of subreddits) {
 *     // 1. Autenticar con REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET
 *     // 2. Buscar posts que contengan keyword
 *     // 3. Filtrar por created_utc >= since
 *     // 4. Mapear a RawPost { externalId: id, subreddit, postType: "story"|"comment", ... }
 *   }
 *
 *   return dedupeByExternalId(posts);
 * }
 */
void REDDIT_LOOKBACK_HOURS;

export const redditMonitor = createStubMonitor({
  meta: PLATFORM_META.reddit,
  validateConfig: validateRedditConfig,
});
