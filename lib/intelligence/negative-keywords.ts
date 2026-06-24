/** Keywords negativas — excluir falsos positivos (ej. Space Jam vs SpaceX) */

export function matchesNegativeTerms(
  text: string,
  excludeTerms: string[]
): { excluded: boolean; matchedTerm?: string } {
  if (!excludeTerms.length) return { excluded: false };

  const haystack = text.toLowerCase();

  for (const term of excludeTerms) {
    const needle = term.trim().toLowerCase();
    if (needle.length >= 2 && haystack.includes(needle)) {
      return { excluded: true, matchedTerm: term };
    }
  }

  return { excluded: false };
}

export function parseExcludeTerms(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
    .slice(0, 20);
}
