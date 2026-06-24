import type { RawPost } from "@/lib/monitors/types";

export type FeatureSourceType =
  | "google_alerts"
  | "rss"
  | "github"
  | "app_store"
  | "slack_community"
  | "devto"
  | "medium";

export interface FeatureSourceConfig {
  feed_url?: string;
  github_repo?: string;
  app_id?: string;
  slack_webhook_url?: string;
  ingest_secret?: string;
  keyword_filter?: string;
}

export interface FeatureSourceRow {
  id: string;
  user_id: string;
  source_type: FeatureSourceType;
  config: FeatureSourceConfig;
  is_active: boolean;
}

export type SourceFetcher = (
  keyword: string,
  config: FeatureSourceConfig
) => Promise<RawPost[]>;
