import type { RedditAuthorProfile } from "@/lib/monitors/reddit-author";

export type ShillRisk = "low" | "medium" | "high";

export interface ShillAssessment {
  risk: ShillRisk;
  reasons: string[];
}

export interface SignalAuthorMeta {
  reddit?: {
    karma: number;
    link_karma: number;
    comment_karma: number;
    account_age_days: number;
    has_verified_email: boolean;
  };
  shill_risk?: ShillRisk;
  shill_reasons?: string[];
}

const SUSPICIOUS_AUTHORS = new Set([
  "[deleted]",
  "automoderator",
  "deleted",
  "moderator",
]);

const PROMO_PATTERNS = [
  /\b(dm me|check out my|use my link|affiliate|promo code)\b/i,
  /\b(best tool ever|game changer|life changing)\b/i,
  /\b(i built this|my startup|my product|we built)\b/i,
  /\b(sign up|free trial|discount code)\b/i,
];

export function assessShillRisk(input: {
  author?: string | null;
  title?: string | null;
  body?: string | null;
  platform?: string;
  authorProfile?: RedditAuthorProfile | null;
}): ShillAssessment | null {
  if (input.platform && input.platform !== "reddit") return null;

  const reasons: string[] = [];
  const author = input.author?.toLowerCase().trim() ?? "";
  const text = `${input.title ?? ""} ${input.body ?? ""}`.trim();
  const profile = input.authorProfile;

  if (!author || SUSPICIOUS_AUTHORS.has(author)) {
    reasons.push("Autor eliminado o no disponible");
  }

  if (author && author.length <= 3) {
    reasons.push("Cuenta con nombre muy corto");
  }

  if (profile) {
    if (profile.accountAgeDays < 30) {
      reasons.push(`Cuenta nueva (${profile.accountAgeDays} días)`);
    }
    if (profile.totalKarma < 50) {
      reasons.push(`Karma bajo (${profile.totalKarma})`);
    }
    if (profile.linkKarma > profile.commentKarma * 3 && profile.linkKarma > 100) {
      reasons.push("Ratio link/comment karma sospechoso");
    }
    if (profile.isSuspended) {
      reasons.push("Cuenta suspendida");
    }
    if (!profile.hasVerifiedEmail && profile.accountAgeDays < 90) {
      reasons.push("Email no verificado en cuenta joven");
    }
  }

  for (const pattern of PROMO_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push("Lenguaje promocional detectado");
      break;
    }
  }

  if (reasons.length === 0) return null;

  const hasProfileFlag = profile && (profile.accountAgeDays < 30 || profile.totalKarma < 50);
  const risk: ShillRisk =
    reasons.length >= 3 || (hasProfileFlag && reasons.length >= 2)
      ? "high"
      : reasons.includes("Lenguaje promocional detectado") || hasProfileFlag
        ? "medium"
        : "low";

  return { risk, reasons };
}

export function shillRiskLabel(risk: ShillRisk): string {
  if (risk === "high") return "Cuenta sospechosa";
  if (risk === "medium") return "Posible promo";
  return "Revisar autor";
}

export function buildAuthorMeta(input: {
  platform: string;
  author?: string | null;
  title?: string | null;
  body?: string | null;
  authorProfile?: RedditAuthorProfile | null;
}): SignalAuthorMeta | null {
  const assessment = assessShillRisk({
    author: input.author,
    title: input.title,
    body: input.body,
    platform: input.platform,
    authorProfile: input.authorProfile,
  });

  const meta: SignalAuthorMeta = {};

  if (input.authorProfile) {
    meta.reddit = {
      karma: input.authorProfile.totalKarma,
      link_karma: input.authorProfile.linkKarma,
      comment_karma: input.authorProfile.commentKarma,
      account_age_days: input.authorProfile.accountAgeDays,
      has_verified_email: input.authorProfile.hasVerifiedEmail,
    };
  }

  if (assessment) {
    meta.shill_risk = assessment.risk;
    meta.shill_reasons = assessment.reasons;
  }

  return Object.keys(meta).length > 0 ? meta : null;
}
