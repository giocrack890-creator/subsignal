-- Persistir tour, tooltips y banner de setup en perfil (no solo localStorage)

alter table public.profiles
  add column if not exists guided_tour_completed boolean not null default false,
  add column if not exists tooltips_dismissed text[] not null default '{}',
  add column if not exists setup_celebration_seen boolean not null default false;

-- Usuarios que ya usaban el producto: no repetir onboarding UI
update public.profiles p
set
  onboarding_survey_completed = true,
  guided_tour_completed = true,
  setup_celebration_seen = true,
  tooltips_dismissed = array[
    'keywords_page',
    'signals_page',
    'drafts_page',
    'analytics_page'
  ]
where
  p.setup_completed = true
  or exists (select 1 from public.keywords k where k.user_id = p.id)
  or exists (select 1 from public.signals s where s.user_id = p.id)
  or p.created_at < timestamptz '2025-06-25';
