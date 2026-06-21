/**
 * Monitor de Twitter/X — adapter stub (PASO 6)
 *
 * DECISIÓN PENDIENTE: evaluar costo/beneficio de la API de X antes de implementar.
 *
 * Cuando se implemente, el flujo esperado es:
 * 1. Buscar tweets recientes que contengan la keyword (últimas 24h)
 * 2. Priorizar replies a threads de alta intención y preguntas directas
 * 3. Normalizar a RawPost con postType: "tweet" | "thread"
 * 4. Activar "twitter" en ACTIVE_PLATFORMS
 *
 * Referencia de implementación futura (API v2):
 *   GET https://api.twitter.com/2/tweets/search/recent?query={keyword}
 *   Headers: Authorization: Bearer {X_API_BEARER_TOKEN}
 *
 * NOTA: desde 2023 la API básica tiene límites muy restrictivos.
 * Considerar posponer hasta validar tracción en HN + Reddit.
 */

import { createStubMonitor } from "./create-stub-monitor";
import { PLATFORM_META } from "./status";
import type { PlatformConfig } from "./types";

const TWITTER_LOOKBACK_HOURS = 24;
const MAX_QUERY_LENGTH = 512;

export function validateTwitterConfig(config?: PlatformConfig): string | null {
  void config;
  return null;
}

/**
 * Pseudocódigo del fetch real — NO implementado.
 *
 * async function searchTwitterPosts(
 *   keyword: string,
 *   config: PlatformConfig
 * ): Promise<RawPost[]> {
 *   const query = buildTwitterQuery(keyword); // escapar operadores, añadir -is:retweet
 *   const maxResults = config.maxResults ?? 20;
 *
 *   // GET /2/tweets/search/recent con start_time = now - TWITTER_LOOKBACK_HOURS
 *   // Mapear: externalId = id, body = text, author = username, url = twitter.com/i/status/{id}
 *   // postType = conversation_id !== id ? "thread" : "tweet"
 *
 *   return posts.slice(0, maxResults);
 * }
 */
void TWITTER_LOOKBACK_HOURS;
void MAX_QUERY_LENGTH;

export const twitterMonitor = createStubMonitor({
  meta: PLATFORM_META.twitter,
  validateConfig: validateTwitterConfig,
});
