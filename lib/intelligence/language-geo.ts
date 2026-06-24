/** Detección de idioma y geo-intent */

const ES_MARKERS = [
  "busco",
  "necesito",
  "recomend",
  "hola",
  "gracias",
  "argentina",
  "méxico",
  "españa",
  "cómo",
  "qué",
];

const GEO_PATTERNS: { region: string; patterns: RegExp[] }[] = [
  { region: "AR", patterns: [/\bargentina\b/i, /\bbuenos aires\b/i, /\bcaba\b/i] },
  { region: "MX", patterns: [/\bméxico\b/i, /\bmexico\b/i, /\bcdmx\b/i] },
  { region: "ES", patterns: [/\bespaña\b/i, /\bspain\b/i, /\bmadrid\b/i] },
  { region: "US", patterns: [/\busa\b/i, /\bunited states\b/i, /\bsan francisco\b/i] },
  { region: "UK", patterns: [/\buk\b/i, /\blondon\b/i, /\bbritain\b/i] },
];

export function detectLanguage(text: string): "en" | "es" | "other" {
  const lower = text.toLowerCase();
  const esHits = ES_MARKERS.filter((m) => lower.includes(m)).length;
  const enHits = (lower.match(/\b(the|and|for|with|looking|recommend)\b/g) ?? []).length;

  if (esHits > enHits && esHits >= 1) return "es";
  if (enHits > esHits) return "en";
  return "other";
}

export function detectGeoRegion(text: string): string | null {
  for (const { region, patterns } of GEO_PATTERNS) {
    if (patterns.some((p) => p.test(text))) return region;
  }
  return null;
}

export function matchesLanguageFilter(
  detected: "en" | "es" | "other",
  filter: "any" | "en" | "es"
): boolean {
  if (filter === "any") return true;
  if (filter === "en") return detected === "en" || detected === "other";
  if (filter === "es") return detected === "es";
  return true;
}
