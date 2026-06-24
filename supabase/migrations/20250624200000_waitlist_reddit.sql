-- Waitlist para avisar cuando Reddit esté activo
create table if not exists public.waitlist_reddit (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_reddit_email_unique unique (email)
);

create index if not exists waitlist_reddit_created_at_idx
  on public.waitlist_reddit (created_at desc);

alter table public.waitlist_reddit enable row level security;
