/** Fusión de señales duplicadas cross-platform */

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñü\s]/gi, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3)
  );
}

export function titleSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }

  const union = tokensA.size + tokensB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export function shouldMergeSignals(input: {
  titleA: string | null;
  titleB: string | null;
  foundAtA: string;
  foundAtB: string;
  platformA: string;
  platformB: string;
}): boolean {
  if (input.platformA === input.platformB) return false;

  const hoursApart =
    Math.abs(
      new Date(input.foundAtA).getTime() - new Date(input.foundAtB).getTime()
    ) /
    (1000 * 60 * 60);

  if (hoursApart > 72) return false;

  const sim = titleSimilarity(input.titleA ?? "", input.titleB ?? "");
  return sim >= 0.45;
}
