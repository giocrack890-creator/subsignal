export type Plan = "free" | "starter" | "growth" | "pro";

export type Platform = "reddit" | "twitter" | "hn" | "ih";

export type SignalStatus = "new" | "viewed" | "replied" | "dismissed";

export type IntentType =
  | "seeking_solution"
  | "complaining"
  | "comparing"
  | "other";

export type DraftTone = "technical" | "conversational" | "formal";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  slack_webhook_url: string | null;
  notify_email: boolean;
  notify_slack: boolean;
  notify_push: boolean;
  weekly_digest: boolean;
  draft_tone: DraftTone;
  min_intent_score: number;
  payment_customer_id: string | null;
  payment_subscription_id: string | null;
  created_at: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_customer: string | null;
  pain_points: string[];
  is_active: boolean;
  created_at: string;
}

export interface Keyword {
  id: string;
  user_id: string;
  product_id: string;
  term: string;
  platforms: Platform[];
  subreddits: string[];
  is_active: boolean;
  created_at: string;
}

export interface Signal {
  id: string;
  user_id: string;
  keyword_id: string | null;
  platform: Platform;
  external_id: string;
  title: string | null;
  body: string | null;
  author: string | null;
  url: string;
  subreddit: string | null;
  intent_score: number | null;
  intent_reason: string | null;
  status: SignalStatus;
  draft_reply: string | null;
  draft_copied: boolean;
  draft_copied_at: string | null;
  draft_regenerations: number;
  dismiss_reason: string | null;
  reply_url: string | null;
  found_at: string;
  alerted_at: string | null;
}

export interface Conversion {
  id: string;
  user_id: string;
  signal_id: string | null;
  utm_campaign: string | null;
  clicks: number;
  signups: number;
  paid_conversions: number;
  created_at: string;
}

export interface ProcessedPost {
  id: string;
  platform: string;
  external_id: string;
  processed_at: string;
}

export interface IntentScoreResult {
  score: number;
  reason: string;
  intent_type: IntentType;
}
