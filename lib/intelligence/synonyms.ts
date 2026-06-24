/** Sinónimos automáticos para keywords */

const SYNONYM_MAP: Record<string, string[]> = {
  crm: ["customer relationship management", "customer relationship", "sales pipeline"],
  saas: ["software as a service", "b2b software", "subscription software"],
  api: ["rest api", "webhook", "integration"],
  ai: ["artificial intelligence", "machine learning", "llm", "gpt"],
  seo: ["search engine optimization", "organic traffic"],
  analytics: ["metrics", "tracking", "dashboard"],
  onboarding: ["user activation", "getting started", "setup flow"],
  pricing: ["plans", "subscription", "billing"],
};

export function expandSynonyms(term: string): string[] {
  const key = term.trim().toLowerCase();
  const base = SYNONYM_MAP[key] ?? [];

  if (base.length === 0 && key.length > 3) {
    return [key];
  }

  return [...new Set([key, ...base])].slice(0, 8);
}

export function buildSearchTerms(term: string, synonyms: string[]): string[] {
  const all = [term, ...synonyms, ...expandSynonyms(term)];
  return [...new Set(all.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 12);
}
