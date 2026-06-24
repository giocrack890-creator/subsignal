import { getAnthropicClient, SCORING_MODEL } from "@/lib/claude/client";
import { crawlWebsite } from "@/lib/website/crawl";
import {
  buildKeywordSuggestions,
  type KeywordSuggestion,
} from "@/lib/keywords/suggestions";

export interface AiKeywordSuggestionsInput {
  productName?: string;
  description?: string;
  targetCustomer?: string;
  painPoints?: string[];
  websiteUrl?: string;
}

export async function generateAiKeywordSuggestions(
  input: AiKeywordSuggestionsInput
): Promise<KeywordSuggestion[]> {
  const fallback = buildKeywordSuggestions(input);
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return fallback;

  let siteContext = "";
  if (input.websiteUrl?.trim()) {
    try {
      const crawl = await crawlWebsite(input.websiteUrl);
      siteContext = [
        `Sitio: ${crawl.url}`,
        crawl.title && `Título: ${crawl.title}`,
        crawl.description && `Descripción: ${crawl.description}`,
        crawl.headings.length > 0 &&
          `Headings: ${crawl.headings.slice(0, 5).join(" | ")}`,
        crawl.excerpt && `Contenido: ${crawl.excerpt.slice(0, 2500)}`,
      ]
        .filter(Boolean)
        .join("\n");
    } catch {
      // crawl opcional — seguimos con datos del formulario
    }
  }

  const prompt = `Sos un experto en Reddit marketing y lead generation.
Generá keywords para monitorear conversaciones con intención de compra.

Producto: ${input.productName ?? "sin nombre"}
Descripción: ${input.description ?? "—"}
Cliente ideal: ${input.targetCustomer ?? "—"}
Problemas que resuelve: ${input.painPoints?.join(", ") ?? "—"}
${siteContext ? `\nAnálisis del sitio web:\n${siteContext}` : ""}

Respondé SOLO con JSON válido (array de 8-12 objetos):
[
  { "term": "frase exacta a buscar", "category": "intent|brand|competitor|problem", "description": "por qué monitorearla" }
]

Incluí:
- 2-3 de marca (nombre del producto, dominio)
- 2 de competidores o "alternative to X"
- 4-5 de alta intención de compra (recommendations, looking for, best tool)
- 2 de problemas/dolores del cliente`;

  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: SCORING_MODEL,
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      term?: string;
      category?: string;
      description?: string;
    }>;

    const valid = parsed
      .filter((row) => row.term && row.term.length >= 2)
      .map((row) => ({
        term: row.term!.trim().toLowerCase(),
        category: (["intent", "brand", "competitor", "problem"].includes(
          row.category ?? ""
        )
          ? row.category
          : "intent") as KeywordSuggestion["category"],
        description: row.description?.trim() || "Sugerida por IA",
      }));

    if (valid.length === 0) return fallback;

    const seen = new Set<string>();
    return valid.filter((s) => {
      const key = s.term.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return fallback;
  }
}
