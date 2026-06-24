-- Tracking de copia de borradores en signal cards
alter table public.signals
  add column if not exists draft_copied boolean not null default false,
  add column if not exists draft_copied_at timestamptz;
