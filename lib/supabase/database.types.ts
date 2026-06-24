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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
