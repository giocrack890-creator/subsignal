export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          plan: string;
          slack_webhook_url: string | null;
          notify_email: boolean;
          notify_slack: boolean;
          notify_push: boolean;
          min_intent_score: number;
          payment_customer_id: string | null;
          payment_subscription_id: string | null;
          setup_product_done: boolean;
          setup_keyword_done: boolean;
          setup_signal_received: boolean;
          setup_draft_copied: boolean;
          setup_completed: boolean;
          draft_tone: string;
          weekly_digest: boolean;
          onboarding_survey_completed: boolean;
          trial_ends_at: string | null;
          guided_tour_completed: boolean;
          tooltips_dismissed: string[];
          setup_celebration_seen: boolean;
          score_adjustment: number;
          buyers_only_default: boolean;
          language_filter: string;
          focus_mode: boolean;
          anonymous_draft_mode: boolean;
          onboarding_vertical: string | null;
          ui_theme: string;
          api_webhook_url: string | null;
          api_webhook_min_score: number;
          referral_code: string | null;
          referred_by: string | null;
          ph_launch_mode_until: string | null;
          sandbox_mode: boolean;
          leaderboard_opt_in: boolean;
          ltd_purchased_at: string | null;
          white_label_name: string | null;
          white_label_logo_url: string | null;
          zapier_webhook_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          slack_webhook_url?: string | null;
          notify_email?: boolean;
          notify_slack?: boolean;
          notify_push?: boolean;
          min_intent_score?: number;
          payment_customer_id?: string | null;
          payment_subscription_id?: string | null;
          setup_product_done?: boolean;
          setup_keyword_done?: boolean;
          setup_signal_received?: boolean;
          setup_draft_copied?: boolean;
          setup_completed?: boolean;
          draft_tone?: string;
          weekly_digest?: boolean;
          onboarding_survey_completed?: boolean;
          trial_ends_at?: string | null;
          guided_tour_completed?: boolean;
          tooltips_dismissed?: string[];
          setup_celebration_seen?: boolean;
          score_adjustment?: number;
          buyers_only_default?: boolean;
          language_filter?: string;
          focus_mode?: boolean;
          anonymous_draft_mode?: boolean;
          onboarding_vertical?: string | null;
          ui_theme?: string;
          api_webhook_url?: string | null;
          api_webhook_min_score?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          ph_launch_mode_until?: string | null;
          sandbox_mode?: boolean;
          leaderboard_opt_in?: boolean;
          ltd_purchased_at?: string | null;
          white_label_name?: string | null;
          white_label_logo_url?: string | null;
          zapier_webhook_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          slack_webhook_url?: string | null;
          notify_email?: boolean;
          notify_slack?: boolean;
          notify_push?: boolean;
          min_intent_score?: number;
          payment_customer_id?: string | null;
          payment_subscription_id?: string | null;
          setup_product_done?: boolean;
          setup_keyword_done?: boolean;
          setup_signal_received?: boolean;
          setup_draft_copied?: boolean;
          setup_completed?: boolean;
          draft_tone?: string;
          weekly_digest?: boolean;
          onboarding_survey_completed?: boolean;
          trial_ends_at?: string | null;
          guided_tour_completed?: boolean;
          tooltips_dismissed?: string[];
          setup_celebration_seen?: boolean;
          score_adjustment?: number;
          buyers_only_default?: boolean;
          language_filter?: string;
          focus_mode?: boolean;
          anonymous_draft_mode?: boolean;
          onboarding_vertical?: string | null;
          ui_theme?: string;
          api_webhook_url?: string | null;
          api_webhook_min_score?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          ph_launch_mode_until?: string | null;
          sandbox_mode?: boolean;
          leaderboard_opt_in?: boolean;
          ltd_purchased_at?: string | null;
          white_label_name?: string | null;
          white_label_logo_url?: string | null;
          zapier_webhook_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          target_customer: string | null;
          pain_points: string[] | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          target_customer?: string | null;
          pain_points?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          target_customer?: string | null;
          pain_points?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_products_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      keywords: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          term: string;
          platforms: string[];
          subreddits: string[] | null;
          is_active: boolean;
          keyword_type: string;
          exclude_terms: string[];
          synonyms: string[];
          language: string;
          health_score: number | null;
          last_signal_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          term: string;
          platforms?: string[];
          subreddits?: string[] | null;
          is_active?: boolean;
          keyword_type?: string;
          exclude_terms?: string[];
          synonyms?: string[];
          language?: string;
          health_score?: number | null;
          last_signal_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          term?: string;
          platforms?: string[];
          subreddits?: string[] | null;
          is_active?: boolean;
          keyword_type?: string;
          exclude_terms?: string[];
          synonyms?: string[];
          language?: string;
          health_score?: number | null;
          last_signal_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "keywords_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "keywords_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "user_products";
            referencedColumns: ["id"];
          },
        ];
      };
      signals: {
        Row: {
          id: string;
          user_id: string;
          keyword_id: string | null;
          platform: string;
          external_id: string;
          title: string | null;
          body: string | null;
          author: string | null;
          url: string;
          subreddit: string | null;
          intent_score: number | null;
          intent_reason: string | null;
          status: string;
          draft_reply: string | null;
          draft_copied: boolean;
          draft_copied_at: string | null;
          draft_regenerations: number;
          dismiss_reason: string | null;
          reply_url: string | null;
          found_at: string;
          alerted_at: string | null;
          author_meta: Record<string, unknown> | null;
          cluster_id: string | null;
          hot_score: number | null;
          reply_window_ends_at: string | null;
          reply_window_hours: number | null;
          semantic_cluster: string | null;
          intent_type: string | null;
          is_buyer_intent: boolean;
          detected_language: string | null;
          geo_region: string | null;
          lead_stage: string | null;
          lead_notes: string | null;
          assigned_to: string | null;
          is_lead: boolean;
          converted: boolean;
          churn_detected: boolean;
          competitor_mentioned: string | null;
          previous_status: string | null;
          replied_at: string | null;
          follow_up_reminder_at: string | null;
          engagement_velocity: number | null;
          translated_title: string | null;
          translated_body: string | null;
          skip_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          keyword_id?: string | null;
          platform: string;
          external_id: string;
          title?: string | null;
          body?: string | null;
          author?: string | null;
          url: string;
          subreddit?: string | null;
          intent_score?: number | null;
          intent_reason?: string | null;
          status?: string;
          draft_reply?: string | null;
          draft_copied?: boolean;
          draft_copied_at?: string | null;
          draft_regenerations?: number;
          dismiss_reason?: string | null;
          reply_url?: string | null;
          found_at?: string;
          alerted_at?: string | null;
          author_meta?: Record<string, unknown> | null;
          cluster_id?: string | null;
          hot_score?: number | null;
          reply_window_ends_at?: string | null;
          reply_window_hours?: number | null;
          semantic_cluster?: string | null;
          intent_type?: string | null;
          is_buyer_intent?: boolean;
          detected_language?: string | null;
          geo_region?: string | null;
          lead_stage?: string | null;
          lead_notes?: string | null;
          assigned_to?: string | null;
          is_lead?: boolean;
          converted?: boolean;
          churn_detected?: boolean;
          competitor_mentioned?: string | null;
          previous_status?: string | null;
          replied_at?: string | null;
          follow_up_reminder_at?: string | null;
          engagement_velocity?: number | null;
          translated_title?: string | null;
          translated_body?: string | null;
          skip_reason?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          keyword_id?: string | null;
          platform?: string;
          external_id?: string;
          title?: string | null;
          body?: string | null;
          author?: string | null;
          url?: string;
          subreddit?: string | null;
          intent_score?: number | null;
          intent_reason?: string | null;
          status?: string;
          draft_reply?: string | null;
          draft_copied?: boolean;
          draft_copied_at?: string | null;
          draft_regenerations?: number;
          dismiss_reason?: string | null;
          reply_url?: string | null;
          found_at?: string;
          alerted_at?: string | null;
          author_meta?: Record<string, unknown> | null;
          cluster_id?: string | null;
          hot_score?: number | null;
          reply_window_ends_at?: string | null;
          reply_window_hours?: number | null;
          semantic_cluster?: string | null;
          intent_type?: string | null;
          is_buyer_intent?: boolean;
          detected_language?: string | null;
          geo_region?: string | null;
          lead_stage?: string | null;
          lead_notes?: string | null;
          assigned_to?: string | null;
          is_lead?: boolean;
          converted?: boolean;
          churn_detected?: boolean;
          competitor_mentioned?: string | null;
          previous_status?: string | null;
          replied_at?: string | null;
          follow_up_reminder_at?: string | null;
          engagement_velocity?: number | null;
          translated_title?: string | null;
          translated_body?: string | null;
          skip_reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "signals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "signals_keyword_id_fkey";
            columns: ["keyword_id"];
            isOneToOne: false;
            referencedRelation: "keywords";
            referencedColumns: ["id"];
          },
        ];
      };
      conversions: {
        Row: {
          id: string;
          user_id: string;
          signal_id: string | null;
          utm_campaign: string | null;
          clicks: number;
          signups: number;
          paid_conversions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          signal_id?: string | null;
          utm_campaign?: string | null;
          clicks?: number;
          signups?: number;
          paid_conversions?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          signal_id?: string | null;
          utm_campaign?: string | null;
          clicks?: number;
          signups?: number;
          paid_conversions?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversions_signal_id_fkey";
            columns: ["signal_id"];
            isOneToOne: false;
            referencedRelation: "signals";
            referencedColumns: ["id"];
          },
        ];
      };
      processed_posts: {
        Row: {
          id: string;
          platform: string;
          external_id: string;
          user_id: string | null;
          processed_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          external_id: string;
          user_id?: string | null;
          processed_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          external_id?: string;
          user_id?: string | null;
          processed_at?: string;
        };
        Relationships: [];
      };
      cron_logs: {
        Row: {
          id: string;
          ran_at: string;
          signals_found: number;
          status: string;
          platform: string | null;
        };
        Insert: {
          id?: string;
          ran_at?: string;
          signals_found?: number;
          status: string;
          platform?: string | null;
        };
        Update: {
          id?: string;
          ran_at?: string;
          signals_found?: number;
          status?: string;
          platform?: string | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          subscription: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_survey: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          building: string;
          previous_tool: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source: string;
          building: string;
          previous_tool: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          building?: string;
          previous_tool?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_survey_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      author_history: {
        Row: {
          id: string;
          user_id: string;
          author: string;
          platform: string;
          mention_count: number;
          topics: string[];
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author: string;
          platform: string;
          mention_count?: number;
          topics?: string[];
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          author?: string;
          platform?: string;
          mention_count?: number;
          topics?: string[];
          last_seen_at?: string;
        };
        Relationships: [];
      };
      winning_responses: {
        Row: {
          id: string;
          user_id: string;
          signal_id: string | null;
          title: string | null;
          body: string;
          platform: string | null;
          converted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          signal_id?: string | null;
          title?: string | null;
          body: string;
          platform?: string | null;
          converted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          signal_id?: string | null;
          title?: string | null;
          body?: string;
          platform?: string | null;
          converted?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      signal_clusters: {
        Row: {
          id: string;
          user_id: string;
          canonical_signal_id: string | null;
          canonical_title: string | null;
          semantic_topic: string | null;
          platform_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          canonical_signal_id?: string | null;
          canonical_title?: string | null;
          semantic_topic?: string | null;
          platform_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          canonical_signal_id?: string | null;
          canonical_title?: string | null;
          semantic_topic?: string | null;
          platform_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cluster_members: {
        Row: {
          id: string;
          cluster_id: string;
          signal_id: string;
          platform: string;
        };
        Insert: {
          id?: string;
          cluster_id: string;
          signal_id: string;
          platform: string;
        };
        Update: {
          id?: string;
          cluster_id?: string;
          signal_id?: string;
          platform?: string;
        };
        Relationships: [];
      };
      agency_products: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          white_label_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          white_label_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          white_label_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          key_hash: string;
          label: string;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          key_hash: string;
          label?: string;
          created_at?: string;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          key_hash?: string;
          label?: string;
          created_at?: string;
          last_used_at?: string | null;
        };
        Relationships: [];
      };
      feature_sources: {
        Row: {
          id: string;
          user_id: string;
          source_type: string;
          config: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: string;
          config?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: string;
          config?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          reward_granted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          reward_granted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string;
          reward_granted?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      source_ingest_log: {
        Row: {
          id: string;
          user_id: string;
          source_type: string;
          external_id: string;
          ingested_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: string;
          external_id: string;
          ingested_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: string;
          external_id?: string;
          ingested_at?: string;
        };
        Relationships: [];
      };
      waitlist_reddit: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
