-- Threadradar — schema inicial
-- Perfiles, productos, keywords, señales, conversiones y cache de posts procesados

-- ─── Perfiles de usuario ────────────────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'growth', 'pro')),
  slack_webhook_url text,
  notify_email boolean not null default true,
  notify_slack boolean not null default false,
  min_intent_score int not null default 7 check (min_intent_score between 1 and 10),
  payment_customer_id text,
  payment_subscription_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── Producto del usuario ───────────────────────────────────────────────────

create table public.user_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  target_customer text,
  pain_points text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index user_products_user_id_idx on public.user_products(user_id);

alter table public.user_products enable row level security;

create policy "Usuarios pueden ver sus productos"
  on public.user_products for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear productos"
  on public.user_products for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus productos"
  on public.user_products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuarios pueden eliminar sus productos"
  on public.user_products for delete
  using (auth.uid() = user_id);

-- ─── Keywords ───────────────────────────────────────────────────────────────

create table public.keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.user_products(id) on delete cascade,
  term text not null,
  platforms text[] not null default '{}',
  subreddits text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index keywords_user_id_is_active_idx on public.keywords(user_id, is_active);

alter table public.keywords enable row level security;

create policy "Usuarios pueden ver sus keywords"
  on public.keywords for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear keywords"
  on public.keywords for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus keywords"
  on public.keywords for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuarios pueden eliminar sus keywords"
  on public.keywords for delete
  using (auth.uid() = user_id);

-- ─── Señales ────────────────────────────────────────────────────────────────

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  keyword_id uuid references public.keywords(id) on delete set null,
  platform text not null check (platform in ('reddit', 'twitter', 'hn', 'ih')),
  external_id text not null,
  title text,
  body text,
  author text,
  url text not null,
  subreddit text,
  intent_score int check (intent_score between 1 and 10),
  intent_reason text,
  status text not null default 'new' check (status in ('new', 'viewed', 'replied', 'dismissed')),
  draft_reply text,
  reply_url text,
  found_at timestamptz not null default now(),
  alerted_at timestamptz,
  unique (platform, external_id, user_id)
);

create index signals_user_id_status_idx on public.signals(user_id, status);
create index signals_found_at_idx on public.signals(found_at desc);

alter table public.signals enable row level security;

create policy "Usuarios pueden ver sus señales"
  on public.signals for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus señales"
  on public.signals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Las señales las crea el pipeline del cron con service role (bypass RLS)

-- ─── Conversiones ───────────────────────────────────────────────────────────

create table public.conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  signal_id uuid references public.signals(id) on delete set null,
  utm_campaign text,
  clicks int not null default 0,
  signups int not null default 0,
  paid_conversions int not null default 0,
  created_at timestamptz not null default now()
);

create index conversions_user_id_idx on public.conversions(user_id);

alter table public.conversions enable row level security;

create policy "Usuarios pueden ver sus conversiones"
  on public.conversions for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear conversiones"
  on public.conversions for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus conversiones"
  on public.conversions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Cache de posts procesados (solo acceso interno vía service role) ───────

create table public.processed_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  external_id text not null,
  processed_at timestamptz not null default now(),
  unique (platform, external_id)
);

create index processed_posts_platform_external_id_idx
  on public.processed_posts(platform, external_id);

alter table public.processed_posts enable row level security;
-- Sin políticas para usuarios autenticados: solo service role accede

-- ─── Trigger: crear perfil al registrarse ───────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
