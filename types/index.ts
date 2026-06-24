export type Plan = "free" | "starter" | "growth" | "pro";

export type Platform =
  | "reddit"
  | "twitter"
  | "hn"
  | "ih"
  | "github"
  | "rss"
  | "google_alert"
  | "app_store"
  | "slack";

export type SignalStatus = "new" | "viewed" | "replied" | "dismissed";

export type IntentType =
  | "seeking_solution"
  | "complaining"
  | "comparing"
  | "other";

export type DraftTone = "technical" | "conversational" | "formal" | "anonymous";

export type KeywordType = "product" | "competitor";

export type LeadStage = "new" | "contacted" | "qualified" | "won" | "lost";

export type LanguageFilter = "any" | "en" | "es";

export type OnboardingVertical = "saas_b2b" | "agency" | "indie";

export type UiTheme = "dark" | "light" | "hn";

export type TeamRole = "viewer" | "responder" | "admin";

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
  trial_ends_at: string | null;
  score_adjustment?: number;
  buyers_only_default?: boolean;
  language_filter?: LanguageFilter;
  focus_mode?: boolean;
  anonymous_draft_mode?: boolean;
  onboarding_vertical?: OnboardingVertical | null;
  ui_theme?: UiTheme;
  api_webhook_url?: string | null;
  api_webhook_min_score?: number;
  referral_code?: string | null;
  ph_launch_mode_until?: string | null;
  sandbox_mode?: boolean;
  leaderboard_opt_in?: boolean;
  ltd_purchased_at?: string | null;
  white_label_name?: string | null;
  white_label_logo_url?: string | null;
  zapier_webhook_url?: string | null;
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
  keyword_type?: KeywordType;
  exclude_terms?: string[];
  synonyms?: string[];
  language?: LanguageFilter;
  health_score?: number | null;
  last_signal_at?: string | null;
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
  author_meta?: {
    reddit?: {
      karma: number;
      link_karma: number;
      comment_karma: number;
      account_age_days: number;
      has_verified_email: boolean;
    };
    shill_risk?: "low" | "medium" | "high";
    shill_reasons?: string[];
    author_history_note?: string;
  } | null;
  cluster_id?: string | null;
  hot_score?: number | null;
  reply_window_ends_at?: string | null;
  reply_window_hours?: number | null;
  semantic_cluster?: string | null;
  intent_type?: IntentType | null;
  is_buyer_intent?: boolean;
  detected_language?: string | null;
  geo_region?: string | null;
  lead_stage?: LeadStage | null;
  lead_notes?: string | null;
  assigned_to?: string | null;
  is_lead?: boolean;
  converted?: boolean;
  churn_detected?: boolean;
  competitor_mentioned?: string | null;
  previous_status?: SignalStatus | null;
  replied_at?: string | null;
  follow_up_reminder_at?: string | null;
  engagement_velocity?: number | null;
  translated_title?: string | null;
  translated_body?: string | null;
  skip_reason?: string | null;
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

export interface SignalCluster {
  id: string;
  user_id: string;
  canonical_signal_id: string | null;
  canonical_title: string | null;
  semantic_topic: string | null;
  platform_count: number;
  created_at: string;
  updated_at: string;
}

export interface WinningResponse {
  id: string;
  user_id: string;
  signal_id: string | null;
  title: string | null;
  body: string;
  platform: string | null;
  converted: boolean;
  created_at: string;
}
