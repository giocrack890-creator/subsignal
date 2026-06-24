/** Radar de competidores — detectar menciones negativas de rivales */

const NEGATIVE_SENTIMENT = [
  "hate",
  "sucks",
  "terrible",
  "awful",
  "worst",
  "broken",
  "buggy",
  "slow",
  "expensive",
  "overpriced",
  "cancel",
  "churn",
  "leaving",
  "alternative",
  "switching from",
  "migrated from",
  "odio",
  "horrible",
  "caro",
  "no funciona",
  "dejé",
  "cambié de",
  "problemas con",
];

export function detectCompetitorMention(input: {
  text: string;
  competitorTerm: string;
  keywordType: "product" | "competitor";
}): {
  mentioned: boolean;
  isNegative: boolean;
  churnDetected: boolean;
  competitorName: string | null;
} {
  const haystack = input.text.toLowerCase();
  const needle = input.competitorTerm.trim().toLowerCase();

  if (!needle || !haystack.includes(needle)) {
    return { mentioned: false, isNegative: false, churnDetected: false, competitorName: null };
  }

  const isNegative = NEGATIVE_SENTIMENT.some((p) => haystack.includes(p));
  const churnDetected =
    input.keywordType === "competitor" &&
    isNegative &&
    (haystack.includes("leaving") ||
      haystack.includes("cancel") ||
      haystack.includes("churn") ||
      haystack.includes("switching") ||
      haystack.includes("dejé") ||
      haystack.includes("cambié"));

  return {
    mentioned: true,
    isNegative,
    churnDetected,
    competitorName: input.competitorTerm,
  };
}
