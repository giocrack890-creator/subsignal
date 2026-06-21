import type { Platform, UserProduct } from "@/types";
import type { RawPost } from "@/lib/monitors/types";
import { PLATFORM_LABELS } from "@/lib/monitors/types";

export const SCORING_SYSTEM_PROMPT = `Sos un experto en GTM (go-to-market) para startups SaaS.
Evaluás si un post representa una oportunidad real para que un founder responda y consiga un cliente potencial.
Respondé ÚNICAMENTE con JSON válido, sin markdown ni texto adicional.`;

export const DRAFT_SYSTEM_PROMPT = `Sos un founder SaaS experto en community-led growth. Tu estilo es genuino, útil, y NUNCA suena a spam o pitch de ventas.

Tu trabajo es redactar una respuesta a un post que:
1. Aporte valor real respondiendo la pregunta o problema
2. Comparta experiencia propia o conocimiento específico
3. Mencione el producto SOLO si es genuinamente relevante y al final, de forma natural (nunca al inicio)
4. Suene a una persona real, no a un bot de marketing
5. Tenga entre 80-150 palabras

Reglas absolutas:
- NUNCA empezar con "Great question" o similares
- NUNCA mencionar el producto en las primeras 2/3 del mensaje
- Si no hay forma genuina de mencionar el producto, NO lo menciones
- El tono debe ser de par a par, no de vendedor
- En Reddit, respetar las reglas de no-spam del subreddit

Respondé ÚNICAMENTE con el texto del borrador, sin explicaciones ni markdown.`;

export function buildScoringUserPrompt(
  post: RawPost,
  product: Pick<UserProduct, "name" | "description" | "target_customer" | "pain_points">,
  keyword: string,
  platform: Platform
): string {
  const painPoints = product.pain_points?.length
    ? product.pain_points.join(", ")
    : "No especificados";

  const body = post.body?.trim() || "(sin contenido adicional)";
  const title = post.title?.trim() || "(sin título)";

  return `Tu trabajo es evaluar si un post/thread representa una oportunidad real para que el fundador de un producto responda y consiga un cliente potencial.

PRODUCTO: ${product.name}
DESCRIPCIÓN: ${product.description ?? "No especificada"}
CLIENTE IDEAL: ${product.target_customer ?? "No especificado"}
PROBLEMAS QUE RESUELVE: ${painPoints}
KEYWORD MONITOREADA: ${keyword}

POST A EVALUAR:
Plataforma: ${PLATFORM_LABELS[platform]}
Título: ${title}
Contenido: ${body}

Evaluá este post y respondé ÚNICAMENTE con JSON:
{
  "score": número del 1 al 10,
  "reason": "explicación en 1 oración de por qué ese score",
  "intent_type": "seeking_solution" | "complaining" | "comparing" | "other"
}

Criterios de scoring:
- 9-10: Pregunta explícitamente por herramientas/soluciones para exactamente el problema que resuelve el producto
- 7-8: Tiene el problema claro y está buscando ayuda activamente
- 5-6: Menciona el problema pero no busca solución activa
- 3-4: Problema relacionado pero indirecto
- 1-2: No es relevante para este producto`;
}

interface DraftPostContext {
  title: string | null;
  body: string | null;
  platform: Platform;
  intent_reason?: string | null;
}

export function buildDraftUserPrompt(
  post: DraftPostContext,
  product: Pick<UserProduct, "name" | "description" | "target_customer" | "pain_points">
): string {
  const title = post.title?.trim() || "(sin título)";
  const body = post.body?.trim() || "(sin contenido adicional)";
  const intentContext = post.intent_reason?.trim()
    ? `\nContexto de intención detectada: ${post.intent_reason}`
    : "";

  return `PRODUCTO: ${product.name} — ${product.description ?? "Sin descripción"}
CLIENTE IDEAL: ${product.target_customer ?? "No especificado"}

POST ORIGINAL:
Plataforma: ${PLATFORM_LABELS[post.platform]}
Título: ${title}
Contenido: ${body}${intentContext}

Redactá el borrador de respuesta siguiendo todas las reglas del system prompt.`;
}
