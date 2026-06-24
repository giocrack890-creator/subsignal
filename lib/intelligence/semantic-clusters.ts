/** Clusters semánticos por tema */

const TOPIC_PATTERNS: { topic: string; patterns: RegExp[] }[] = [
  {
    topic: "pricing",
    patterns: [/\bpric(e|ing)\b/i, /\bcost\b/i, /\bbudget\b/i, /\bfree tier\b/i, /\bpresupuesto\b/i],
  },
  {
    topic: "onboarding",
    patterns: [/\bonboard/i, /\bsetup\b/i, /\bgetting started\b/i, /\bprimeros pasos\b/i],
  },
  {
    topic: "alternatives",
    patterns: [/\balternative/i, /\bvs\b/i, /\bcompare\b/i, /\bcomparar\b/i, /\bswitch/i],
  },
  {
    topic: "integrations",
    patterns: [/\bintegrat/i, /\bapi\b/i, /\bzapier\b/i, /\bwebhook\b/i],
  },
  {
    topic: "support",
    patterns: [/\bsupport\b/i, /\bhelp\b/i, /\bbug\b/i, /\berror\b/i, /\bsoporte\b/i],
  },
  {
    topic: "growth",
    patterns: [/\bgrowth\b/i, /\bmarketing\b/i, /\bleads\b/i, /\bconversion\b/i],
  },
];

export function detectSemanticCluster(text: string): string | null {
  for (const { topic, patterns } of TOPIC_PATTERNS) {
    if (patterns.some((p) => p.test(text))) return topic;
  }
  return null;
}

export const SEMANTIC_CLUSTER_LABELS: Record<string, string> = {
  pricing: "Pricing",
  onboarding: "Onboarding",
  alternatives: "Alternativas",
  integrations: "Integraciones",
  support: "Soporte",
  growth: "Growth",
};
