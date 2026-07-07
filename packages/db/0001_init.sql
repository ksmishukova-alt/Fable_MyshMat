-- МышМат — миграция 0001 (MVP, ТЗ v1 с механикой МышРутки)
-- Выполняется в Supabase SQL editor или через supabase db push.
-- Содержит только то, что нужно реализованным экранам:
-- профиль ребёнка, контент заданий/шагов, Daily-сессии, попытки,
-- пошаговую аналитику самостоятельности, награды и наклейки.

-- ─────────────────────────────────────────────
-- ENUM-типы
-- ─────────────────────────────────────────────
do $$ begin
  create type subject_id as enum ('math','russian','reading','english');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_mode as enum ('platform','worksheet');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subject_status as enum
    ('notStarted','inProgress','submitted','successful','perfect','needsRevision');
exception when duplicate_object then null; end $$;

do $$ begin
  create type daily_status as enum
    ('notStarted','inProgress','submitted','successful','perfect');
exception when duplicate_object then null; end $$;

do $$ begin
  create type step_kind as enum ('reading','question');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────
-- Профиль ребёнка
-- ─────────────────────────────────────────────
create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid,                 -- → auth.users.id (методист/родитель)
  name text not null,
  grade int not null default 3,
  avatar_url text,
  stars int not null default 0,   -- внутренняя валюта
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Контент: задания и шаги
-- ─────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  subject subject_id not null,
  title text not null,
  mode task_mode not null,
  prompt text not null default '',
  est_minutes int,
  created_at timestamptz not null default now()
);

create table if not exists task_steps (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  ord int not null,                 -- порядок шага
  kind step_kind not null,
  prompt text not null,
  passage text,
  hint text,                        -- доступна со 2-й попытки (логика на клиенте/сервере)
  -- варианты ответа: [{id,label,is_correct}]
  options jsonb not null default '[]'::jsonb,
  correct_input text,               -- для свободного ввода
  unique (task_id, ord)
);

-- Какие задания входят в Daily предмета на день (упрощённо для MVP)
create table if not exists daily_task_configs (
  id uuid primary key default gen_random_uuid(),
  subject subject_id not null,
  task_id uuid not null references tasks(id) on delete cascade,
  ord int not null,
  active bool not null default true
);

-- ─────────────────────────────────────────────
-- Daily-сессии и прогресс
-- ─────────────────────────────────────────────
create table if not exists daily_sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  date date not null,
  status daily_status not null default 'notStarted',
  -- v1.1: флаг выдачи МышРутки (открывает игровой мир целиком)
  myshroutka_granted bool not null default false,
  myshroutka_granted_at timestamptz,
  submitted_at timestamptz,
  unique (child_id, date)
);

-- агрегат по предмету в рамках сессии
create table if not exists daily_subject_progress (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references daily_sessions(id) on delete cascade,
  subject subject_id not null,
  status subject_status not null default 'notStarted',
  tasks_total int not null default 0,
  tasks_done int not null default 0,
  unique (session_id, subject)
);

-- попытка по заданию
create table if not exists daily_task_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references daily_sessions(id) on delete cascade,
  task_id uuid not null references tasks(id),
  child_id uuid not null references child_profiles(id),
  mode task_mode not null,
  answer jsonb,
  is_correct bool,
  uploaded_solution_url text,
  status subject_status not null default 'notStarted',
  -- v1.1 аналитика самостоятельности (агрегат по заданию)
  autonomy_score numeric(4,3),     -- 0..1: доля шагов решённых сам с 1-й попытки
  submitted_at timestamptz,
  checked_at timestamptz,
  feedback text,
  created_at timestamptz not null default now()
);

-- v1.1: пошаговая статистика (самостоятельность по каждому шагу)
create table if not exists task_step_stats (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references daily_task_attempts(id) on delete cascade,
  step_id uuid not null references task_steps(id),
  attempts int not null default 0,        -- сколько раз жал «Проверить»
  hint_used bool not null default false,  -- открыл подсказку (доступна со 2-й попытки)
  solved_first_try bool not null default false,
  skipped_with_error bool not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Награды и наклейки
-- ─────────────────────────────────────────────
do $$ begin
  create type reward_type as enum
    ('myshroutka','doneDaily','myshPechat','perfectDaily',
     'skill','effort','olympiad','collection','surprise','duel');
exception when duplicate_object then null; end $$;

create table if not exists reward_cards (
  id uuid primary key default gen_random_uuid(),
  type reward_type not null,
  title text not null,
  description text,
  icon_url text
);

create table if not exists child_rewards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  reward_id uuid not null references reward_cards(id),
  earned_at timestamptz not null default now()
);

create table if not exists stickers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text
);

create table if not exists child_stickers (
  child_id uuid not null references child_profiles(id) on delete cascade,
  sticker_id uuid not null references stickers(id),
  earned_at timestamptz not null default now(),
  primary key (child_id, sticker_id)
);

-- ─────────────────────────────────────────────
-- МышРутка: пересчёт статуса Daily и выдача
-- ─────────────────────────────────────────────
-- Вызывается после сохранения попытки. Если все предметы сессии достигли
-- статуса submitted (или выше) — сессия становится submitted и выдаётся МышРутка.
create or replace function recompute_daily_and_grant_myshroutka(p_session uuid)
returns void language plpgsql as $$
declare
  v_total int;
  v_submitted int;
  v_child uuid;
  v_already bool;
begin
  select count(*),
         count(*) filter (where status in ('submitted','successful','perfect'))
    into v_total, v_submitted
  from daily_subject_progress where session_id = p_session;

  if v_total > 0 and v_submitted = v_total then
    select child_id, myshroutka_granted into v_child, v_already
      from daily_sessions where id = p_session;

    update daily_sessions
      set status = 'submitted',
          submitted_at = coalesce(submitted_at, now()),
          myshroutka_granted = true,
          myshroutka_granted_at = coalesce(myshroutka_granted_at, now())
      where id = p_session;

    if not v_already then
      -- начислить карточку МышРутки
      insert into child_rewards (child_id, reward_id)
      select v_child, rc.id from reward_cards rc where rc.type = 'myshroutka' limit 1;
    end if;
  end if;
end $$;

-- ─────────────────────────────────────────────
-- RLS (включить при готовности auth; для MVP оставляем выключенным)
-- ─────────────────────────────────────────────
-- alter table daily_sessions enable row level security;
-- create policy child_own on daily_sessions for all
--   using (child_id in (select id from child_profiles where parent_id = auth.uid()));
