-- Onboarding survey + trial Starter de 7 días

alter table public.profiles
  add column if not exists onboarding_survey_completed boolean not null default false,
  add column if not exists trial_ends_at timestamptz;

create table if not exists public.onboarding_survey (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null,
  building text not null,
  previous_tool text not null,
  role text not null,
  created_at timestamptz not null default now(),
  constraint onboarding_survey_user_id_unique unique (user_id)
);

create index if not exists onboarding_survey_created_at_idx
  on public.onboarding_survey (created_at desc);

alter table public.onboarding_survey enable row level security;

create policy "Users read own onboarding survey"
  on public.onboarding_survey for select
  using (auth.uid() = user_id);
