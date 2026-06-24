export type KeywordSuggestionCategory =
  | "intent"
  | "brand"
  | "competitor"
  | "problem";

export interface KeywordSuggestion {
  term: string;
  category: KeywordSuggestionCategory;
  description: string;
}

const CATEGORY_LABELS: Record<KeywordSuggestionCategory, string> = {
  intent: "Intención de compra",
  brand: "Tu marca",
  competitor: "Competidor",
  problem: "Problema",
};

export function getCategoryLabel(category: KeywordSuggestionCategory): string {
  return CATEGORY_LABELS[category];
}

export function buildKeywordSuggestions(input: {
  productName?: string;
  description?: string;
  targetCustomer?: string;
  painPoints?: string[];
  websiteUrl?: string;
}): KeywordSuggestion[] {
  const name = input.productName?.trim();
  const suggestions: KeywordSuggestion[] = [];

  if (name) {
    suggestions.push({
      term: name.toLowerCase(),
      category: "brand",
      description: "Menciones de tu producto",
    });
    suggestions.push({
      term: `alternative to ${name}`,
      category: "competitor",
      description: "Búsquedas de alternativas",
    });
  }

  const defaults: KeywordSuggestion[] = [
    {
      term: "looking for a tool",
      category: "intent",
      description: "Alta intención de compra",
    },
    {
      term: "any recommendations for",
      category: "intent",
      description: "Piden recomendaciones",
    },
    {
      term: "what do you use for",
      category: "intent",
      description: "Comparan herramientas",
    },
  ];

  suggestions.push(...defaults);

  if (input.painPoints?.length) {
    for (const pain of input.painPoints.slice(0, 2)) {
      const term = pain.trim().toLowerCase();
      if (term.length >= 4) {
        suggestions.push({
          term,
          category: "problem",
          description: "Dolor que resolvés",
        });
      }
    }
  }

  if (input.websiteUrl) {
    try {
      const host = new URL(
        input.websiteUrl.startsWith("http")
          ? input.websiteUrl
          : `https://${input.websiteUrl}`
      ).hostname.replace(/^www\./, "");
      const brand = host.split(".")[0];
      if (brand && brand.length > 2 && brand !== name?.toLowerCase()) {
        suggestions.push({
          term: brand,
          category: "brand",
          description: "Desde tu dominio",
        });
      }
    } catch {
      // ignore invalid URL
    }
  }

  const seen = new Set<string>();
  return suggestions.filter((s) => {
    const key = s.term.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
