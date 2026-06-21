-- Per-user deduplication en processed_posts (multi-tenant correcto)

alter table public.processed_posts
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

-- Eliminar constraint global si existe
alter table public.processed_posts
  drop constraint if exists processed_posts_platform_external_id_key;

-- Nuevo unique por usuario
alter table public.processed_posts
  drop constraint if exists processed_posts_platform_external_id_user_id_key;

alter table public.processed_posts
  add constraint processed_posts_platform_external_id_user_id_key
  unique (platform, external_id, user_id);

create index if not exists processed_posts_user_lookup_idx
  on public.processed_posts (user_id, platform, external_id);
