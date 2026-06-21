/** Sistema de puntuación de intención con Claude */

import { getAnthropicClient, SCORING_MODEL } from "@/lib/claude/client";
import { buildScoringUserPrompt, SCORING_SYSTEM_PROMPT } from "@/lib/claude/prompts";
import type { RawPost } from "@/lib/monitors/types";
import { withRetry } from "@/lib/utils/retry";
import type { IntentScoreResult, IntentType, Platform, UserProduct } from "@/types";

const VALID_INTENT_TYPES: IntentType[] = [
  "seeking_solution",
  "complaining",
  "comparing",
  "other",
];

interface ScorePostInput {
  post: RawPost;
  product: Pick<UserProduct, "name" | "description" | "target_customer" | "pain_points">;
  keyword: string;
  platform: Platform;
}

function parseScoreResponse(text: string): IntentScoreResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude no devolvió JSON válido");
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    score?: number;
    reason?: string;
    intent_type?: string;
  };

  const score = Number(parsed.score);
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    throw new Error(`Score inválido: ${parsed.score}`);
  }

  const intentType = VALID_INTENT_TYPES.includes(parsed.intent_type as IntentType)
    ? (parsed.intent_type as IntentType)
    : "other";

  return {
    score,
    reason: parsed.reason?.trim() || "Sin explicación",
    intent_type: intentType,
  };
}

export async function scorePost(input: ScorePostInput): Promise<IntentScoreResult> {
  const { post, product, keyword, platform } = input;
  const client = getAnthropicClient();

  return withRetry(async () => {
    const message = await client.messages.create({
      model: SCORING_MODEL,
      max_tokens: 256,
      system: SCORING_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildScoringUserPrompt(post, product, keyword, platform),
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("Respuesta vacía de Claude");
    }

    return parseScoreResponse(block.text);
  }, { label: `Claude scoring post ${post.externalId}` });
}
