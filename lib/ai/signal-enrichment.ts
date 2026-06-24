import { getAnthropicClient, SCORING_MODEL } from "@/lib/claude/client";

export async function translateSignalText(input: {
  title: string | null;
  body: string | null;
  targetLanguage?: "es" | "en";
}): Promise<{ title: string; body: string }> {
  const target = input.targetLanguage ?? "es";
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: SCORING_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Traducí al ${target === "es" ? "español" : "inglés"} manteniendo tono natural. Devolvé JSON: {"title":"...","body":"..."}\n\nTítulo: ${input.title ?? ""}\n\nCuerpo: ${input.body ?? ""}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  const text = block?.type === "text" ? block.text : "{}";
  const match = text.match(/\{[\s\S]*\}/);
  const parsed = match ? (JSON.parse(match[0]) as { title?: string; body?: string }) : {};

  return {
    title: parsed.title ?? input.title ?? "",
    body: parsed.body ?? input.body ?? "",
  };
}

export async function generateTweetThread(input: {
  title: string | null;
  body: string | null;
  productName?: string;
}): Promise<string[]> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: SCORING_MODEL,
    max_tokens: 600,
    system:
      "Generá un hilo de exactamente 3 tweets (máx 280 chars c/u) desde una señal de HN. Devolvé JSON: {\"tweets\":[\"tweet1\",\"tweet2\",\"tweet3\"]}. Sin hashtags spam.",
    messages: [
      {
        role: "user",
        content: `Producto: ${input.productName ?? "SaaS"}\nSeñal HN:\n${input.title}\n${input.body}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  const text = block?.type === "text" ? block.text : "{}";
  const match = text.match(/\{[\s\S]*\}/);
  const parsed = match ? (JSON.parse(match[0]) as { tweets?: string[] }) : {};
  return (parsed.tweets ?? []).slice(0, 3);
}
