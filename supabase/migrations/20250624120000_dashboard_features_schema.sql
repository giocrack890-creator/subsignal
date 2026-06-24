-- Threadradar — schema para features del dashboard (1–15)
-- Ejecutar en Supabase antes de desplegar las features.

-- ─── profiles: setup progress + preferencias ─────────────────────────────────

alter table public.profiles
  add column if not exists setup_product_done boolean not null default false,
  add column if not exists setup_keyword_done boolean not null default false,
  add column if not exists setup_signal_received boolean not null default false,
  add column if not exists setup_draft_copied boolean not null default false,
  add column if not exists setup_completed boolean not null default false,
  add column if not exists draft_tone text not null default 'conversational'
    check (draft_tone in ('technical', 'conversational', 'formal')),
  add column if not exists weekly_digest boolean not null default true,
  add column if not exists notify_push boolean not null default true;

-- ─── signals: drafts, dismiss, regeneraciones ────────────────────────────────

alter table public.signals
  add column if not exists draft_regenerations int not null default 0,
  add column if not exists dismiss_reason text;

-- draft_copied / draft_copied_at pueden existir de migraciones previas
alter table public.signals
  add column if not exists draft_copied boolean not null default false,
  add column if not exists draft_copied_at timestamptz;

-- ─── push_subscriptions ──────────────────────────────────────────────────────

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

do $$ begin
  create policy "Usuarios ven sus push subscriptions"
    on public.push_subscriptions for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios crean sus push subscriptions"
    on public.push_subscriptions for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios eliminan sus push subscriptions"
    on public.push_subscriptions for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Usuarios actualizan sus push subscriptions"
    on public.push_subscriptions for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- ─── cron_logs ───────────────────────────────────────────────────────────────

create table if not exists public.cron_logs (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  signals_found int not null default 0,
  status text not null,
  platform text
);

create index if not exists cron_logs_ran_at_idx
  on public.cron_logs(ran_at desc);

alter table public.cron_logs enable row level security;

do $$ begin
  create policy "Lectura pública de cron_logs"
    on public.cron_logs for select
    using (true);
exception when duplicate_object then null;
end $$;

-- Backfill setup progress para usuarios existentes
update public.profiles p
set
  setup_product_done = exists (
    select 1 from public.user_products up
    where up.user_id = p.id and up.is_active = true
  ),
  setup_keyword_done = exists (
    select 1 from public.keywords k
    where k.user_id = p.id and k.is_active = true
  ),
  setup_signal_received = exists (
    select 1 from public.signals s where s.user_id = p.id
  ),
  setup_draft_copied = exists (
    select 1 from public.signals s
    where s.user_id = p.id and s.draft_copied = true
  );

update public.profiles
set setup_completed = (
  setup_product_done
  and setup_keyword_done
  and setup_signal_received
  and setup_draft_copied
)
where setup_completed = false;
