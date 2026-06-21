import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en variables de entorno");
  }

  if (!client) {
    client = new Anthropic({ apiKey });
  }

  return client;
}

/** Modelo rápido y económico para scoring de intención */
export const SCORING_MODEL = "claude-3-5-haiku-20241022";

/** Modelo para borradores de respuesta (calidad > velocidad) */
export const DRAFT_MODEL = "claude-3-5-sonnet-20241022";
