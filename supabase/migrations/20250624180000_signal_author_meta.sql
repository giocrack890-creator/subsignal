-- Metadata de autor Reddit para detección de shills y perfiles
alter table public.signals
  add column if not exists author_meta jsonb;

comment on column public.signals.author_meta is
  'Perfil Reddit del autor: karma, edad de cuenta, shill_risk, etc.';
