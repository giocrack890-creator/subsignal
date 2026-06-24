-- Fuentes extendidas + LTD + white-label

alter table public.profiles
  add column if not exists ltd_purchased_at timestamptz,
  add column if not exists white_label_name text,
  add column if not exists white_label_logo_url text,
  add column if not exists zapier_webhook_url text;

-- Ampliar plataformas en señales
alter table public.signals drop constraint if exists signals_platform_check;
alter table public.signals add constraint signals_platform_check
  check (platform in (
    'reddit', 'twitter', 'hn', 'ih',
    'github', 'rss', 'google_alert', 'app_store', 'slack'
  ));

-- Ingest log para Google Alerts / webhooks
create table if not exists public.source_ingest_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null,
  external_id text not null,
  ingested_at timestamptz not null default now(),
  unique (user_id, source_type, external_id)
);

alter table public.source_ingest_log enable row level security;

do $$ begin
  create policy "Usuarios ven su ingest log"
    on public.source_ingest_log for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;
