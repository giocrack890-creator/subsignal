-- ThreadPulse — schema para backlog completo de features (olas 1–4)

-- ─── profiles: preferencias avanzadas ───────────────────────────────────────

alter table public.profiles
  add column if not exists score_adjustment int not null default 0,
  add column if not exists buyers_only_default boolean not null default false,
  add column if not exists language_filter text not null default 'any'
    check (language_filter in ('any', 'en', 'es')),
  add column if not exists focus_mode boolean not null default false,
  add column if not exists anonymous_draft_mode boolean not null default false,
  add column if not exists onboarding_vertical text
    check (onboarding_vertical is null or onboarding_vertical in ('saas_b2b', 'agency', 'indie')),
  add column if not exists ui_theme text not null default 'dark'
    check (ui_theme in ('dark', 'light', 'hn')),
  add column if not exists api_webhook_url text,
  add column if not exists api_webhook_min_score int not null default 9
    check (api_webhook_min_score between 1 and 10),
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null,
  add column if not exists ph_launch_mode_until timestamptz,
  add column if not exists sandbox_mode boolean not null default false,
  add column if not exists leaderboard_opt_in boolean not null default false;

-- ─── keywords: competidores, negativas, sinónimos, idioma ───────────────────

alter table public.keywords
  add column if not exists keyword_type text not null default 'product'
    check (keyword_type in ('product', 'competitor')),
  add column if not exists exclude_terms text[] not null default '{}',
  add column if not exists synonyms text[] not null default '{}',
  add column if not exists language text not null default 'any'
    check (language in ('any', 'en', 'es')),
  add column if not exists health_score int
    check (health_score is null or health_score between 0 and 100),
  add column if not exists last_signal_at timestamptz;

-- ─── signals: inteligencia, CRM, clusters ───────────────────────────────────

alter table public.signals
  add column if not exists cluster_id uuid,
  add column if not exists hot_score numeric,
  add column if not exists reply_window_ends_at timestamptz,
  add column if not exists reply_window_hours int,
  add column if not exists semantic_cluster text,
  add column if not exists intent_type text
    check (intent_type is null or intent_type in ('seeking_solution', 'complaining', 'comparing', 'other')),
  add column if not exists is_buyer_intent boolean not null default false,
  add column if not exists detected_language text,
  add column if not exists geo_region text,
  add column if not exists lead_stage text
    check (lead_stage is null or lead_stage in ('new', 'contacted', 'qualified', 'won', 'lost')),
  add column if not exists lead_notes text,
  add column if not exists assigned_to uuid references public.profiles(id) on delete set null,
  add column if not exists is_lead boolean not null default false,
  add column if not exists converted boolean not null default false,
  add column if not exists churn_detected boolean not null default false,
  add column if not exists competitor_mentioned text,
  add column if not exists previous_status text,
  add column if not exists replied_at timestamptz,
  add column if not exists follow_up_reminder_at timestamptz,
  add column if not exists engagement_velocity numeric,
  add column if not exists translated_title text,
  add column if not exists translated_body text,
  add column if not exists skip_reason text;

create index if not exists signals_cluster_id_idx on public.signals(cluster_id);
create index if not exists signals_hot_score_idx on public.signals(hot_score desc nulls last);
create index if not exists signals_semantic_cluster_idx on public.signals(semantic_cluster);
create index if not exists signals_is_lead_idx on public.signals(user_id, is_lead) where is_lead = true;

-- ─── signal_clusters ────────────────────────────────────────────────────────

create table if not exists public.signal_clusters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  canonical_signal_id uuid references public.signals(id) on delete set null,
  canonical_title text,
  semantic_topic text,
  platform_count int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signal_clusters_user_id_idx on public.signal_clusters(user_id);

alter table public.signal_clusters enable row level security;

do $$ begin
  create policy "Usuarios ven sus clusters"
    on public.signal_clusters for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios actualizan sus clusters"
    on public.signal_clusters for update using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- FK signals → clusters (después de crear tabla)
do $$ begin
  alter table public.signals
    add constraint signals_cluster_id_fkey
    foreign key (cluster_id) references public.signal_clusters(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- ─── cluster_members ────────────────────────────────────────────────────────

create table if not exists public.cluster_members (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.signal_clusters(id) on delete cascade,
  signal_id uuid not null references public.signals(id) on delete cascade,
  platform text not null,
  unique (cluster_id, signal_id)
);

create index if not exists cluster_members_signal_id_idx on public.cluster_members(signal_id);

alter table public.cluster_members enable row level security;

do $$ begin
  create policy "Usuarios ven miembros de sus clusters"
    on public.cluster_members for select
    using (
      exists (
        select 1 from public.signal_clusters sc
        where sc.id = cluster_id and sc.user_id = auth.uid()
      )
    );
exception when duplicate_object then null;
end $$;

-- ─── author_history ─────────────────────────────────────────────────────────

create table if not exists public.author_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author text not null,
  platform text not null,
  mention_count int not null default 1,
  topics text[] not null default '{}',
  last_seen_at timestamptz not null default now(),
  unique (user_id, author, platform)
);

create index if not exists author_history_user_author_idx
  on public.author_history(user_id, author);

alter table public.author_history enable row level security;

do $$ begin
  create policy "Usuarios ven su author history"
    on public.author_history for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── winning_responses (biblioteca) ─────────────────────────────────────────

create table if not exists public.winning_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  signal_id uuid references public.signals(id) on delete set null,
  title text,
  body text not null,
  platform text,
  converted boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists winning_responses_user_id_idx on public.winning_responses(user_id);

alter table public.winning_responses enable row level security;

do $$ begin
  create policy "Usuarios ven sus winning responses"
    on public.winning_responses for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios crean winning responses"
    on public.winning_responses for insert with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios eliminan winning responses"
    on public.winning_responses for delete using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── team_members ───────────────────────────────────────────────────────────

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  member_email text not null,
  member_id uuid references public.profiles(id) on delete set null,
  role text not null default 'viewer'
    check (role in ('viewer', 'responder', 'admin')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (owner_id, member_email)
);

alter table public.team_members enable row level security;

do $$ begin
  create policy "Owners ven su equipo"
    on public.team_members for select using (auth.uid() = owner_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Owners gestionan su equipo"
    on public.team_members for all using (auth.uid() = owner_id);
exception when duplicate_object then null;
end $$;

-- ─── agency_products (plan agency) ──────────────────────────────────────────

create table if not exists public.agency_products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  white_label_name text,
  created_at timestamptz not null default now(),
  unique (owner_id, slug)
);

alter table public.agency_products enable row level security;

do $$ begin
  create policy "Owners ven agency products"
    on public.agency_products for select using (auth.uid() = owner_id);
exception when duplicate_object then null;
end $$;

-- ─── feature_sources (fuentes configurables) ────────────────────────────────

create table if not exists public.feature_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null
    check (source_type in (
      'google_alerts', 'rss', 'github', 'app_store', 'slack_community',
      'product_hunt', 'devto', 'medium'
    )),
  config jsonb not null default '{}',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, source_type)
);

alter table public.feature_sources enable row level security;

do $$ begin
  create policy "Usuarios gestionan sus feature sources"
    on public.feature_sources for all using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── api_keys (API pública) ─────────────────────────────────────────────────

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  key_hash text not null unique,
  label text not null default 'default',
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

alter table public.api_keys enable row level security;

do $$ begin
  create policy "Usuarios ven sus api keys"
    on public.api_keys for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── user_streaks (leaderboard personal) ────────────────────────────────────

create table if not exists public.user_streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_reply_date date,
  replies_this_week int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

do $$ begin
  create policy "Usuarios ven su streak"
    on public.user_streaks for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── referrals ──────────────────────────────────────────────────────────────

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  reward_granted boolean not null default false,
  created_at timestamptz not null default now(),
  unique (referred_id)
);

alter table public.referrals enable row level security;

do $$ begin
  create policy "Usuarios ven sus referrals"
    on public.referrals for select
    using (auth.uid() = referrer_id or auth.uid() = referred_id);
exception when duplicate_object then null;
end $$;
