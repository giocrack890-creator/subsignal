/**
 * Monitor de Indie Hackers — adapter stub (PASO 6)
 *
 * DECISIÓN PENDIENTE: Indie Hackers no tiene API pública.
 * Hay que elegir entre scraping, RSS limitado o servicio externo.
 *
 * Cuando se implemente, el flujo esperado es:
 * 1. Obtener posts recientes del feed / búsqueda por keyword
 * 2. Filtrar por relevancia e intención (preguntas, búsqueda de herramientas)
 * 3. Normalizar a RawPost con url de indiehackers.com/post/{slug}
 * 4. Activar "ih" en ACTIVE_PLATFORMS
 *
 * Referencia de implementación futura (scraping — frágil):
 *   - Fetch https://www.indiehackers.com/search?q={keyword}
 *   - Parsear HTML/JSON embebido del listado de posts
 *   - Respetar robots.txt y rate limits agresivos
 *
 * Alternativa: monitorear RSS del blog IH si cubre el nicho del usuario.
 */

import { createStubMonitor } from "./create-stub-monitor";
import { PLATFORM_META } from "./status";

const IH_LOOKBACK_HOURS = 48;

/**
 * Pseudocódigo del fetch real — NO implementado.
 *
 * async function searchIndieHackersPosts(
 *   keyword: string,
 *   config: PlatformConfig
 * ): Promise<RawPost[]> {
 *   const since = Date.now() - IH_LOOKBACK_HOURS * 3600 * 1000;
 *
 *   // Opción A: scraping del search/listing page
 *   // Opción B: RSS feed filtrado por keyword en título/descripción
 *   // Opción C: webhook/manual import (fuera del cron automático)
 *
 *   return posts.filter(p => new Date(p.createdAt).getTime() >= since);
 * }
 */
void IH_LOOKBACK_HOURS;

export const indieHackersMonitor = createStubMonitor({
  meta: PLATFORM_META.ih,
});
