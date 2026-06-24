/** Detección de intención de compra — frases "looking for", "recommend", etc. */

const BUYER_PHRASES_EN = [
  "looking for",
  "recommend",
  "recommendation",
  "anyone know",
  "what do you use",
  "need a tool",
  "best way to",
  "alternative to",
  "budget",
  "willing to pay",
  "how much",
  "pricing",
  "which one",
  "should i use",
  "trying to find",
];

const BUYER_PHRASES_ES = [
  "busco",
  "recomend",
  "recomendación",
  "alternativa",
  "alguna herramienta",
  "cuánto cuesta",
  "presupuesto",
  "qué usan",
  "necesito una",
  "me conviene",
];

export function detectBuyerIntent(text: string): {
  isBuyer: boolean;
  matchedPhrases: string[];
} {
  const haystack = text.toLowerCase();
  const matched: string[] = [];

  for (const phrase of [...BUYER_PHRASES_EN, ...BUYER_PHRASES_ES]) {
    if (haystack.includes(phrase)) matched.push(phrase);
  }

  return { isBuyer: matched.length > 0, matchedPhrases: matched };
}

export function buyerIntentBoost(matchedCount: number): number {
  if (matchedCount >= 2) return 2;
  if (matchedCount === 1) return 1;
  return 0;
}
