-- МышМат — миграция 0005: полная платформа.
-- Роли и доступ, олимпиадное ядро (3 уровня), награды/лавка/тамагочи,
-- планы и расписание, дуэли, платежи, загадка дня, аналитика.

-- ─────────────────────────────────────────────
-- Взрослые аккаунты (самореги нет — заводит методист)
-- ─────────────────────────────────────────────
create table if not exists methodists (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  telegram_chat_id text,
  created_at timestamptz not null default now()
);

create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  telegram_chat_id text,
  created_by uuid references methodists(id),
  created_at timestamptz not null default now()
);

alter table child_profiles
  add column if not exists login text,
  add column if not exists real_parent_id uuid references parents(id),
  add column if not exists methodist_id uuid references methodists(id),
  add column if not exists disabled_subjects jsonb not null default '[]'::jsonb;

create unique index if not exists child_profiles_login_key
  on child_profiles (login) where login is not null;

-- ─────────────────────────────────────────────
-- Расписание Daily и индивидуальный план
-- ─────────────────────────────────────────────
create table if not exists daily_schedule (
  child_id uuid not null references child_profiles(id) on delete cascade,
  date date not null,
  primary key (child_id, date)
);

create table if not exists child_plan_nodes (
  child_id uuid not null references child_profiles(id) on delete cascade,
  topic_id text not null,
  ord int not null,
  primary key (child_id, topic_id)
);

-- ─────────────────────────────────────────────
-- Олимпиадное ядро: темы, задачи, прогресс, попытки
-- Уровни: 1 тренировка · 2 с поддержкой · 3 самостоятельно
-- ─────────────────────────────────────────────
create table if not exists olympiad_topics (
  id text primary key,                 -- slug: 'heads-legs', 'parity'…
  title text not null,
  description text not null default '',
  glyph text not null default '🏔️',
  color text not null default 'blue',
  depends_on jsonb not null default '[]'::jsonb,  -- массив id
  ord int not null default 0,
  has_algebra bool not null default false
);

create table if not exists olympiad_problems (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references olympiad_topics(id) on delete cascade,
  level int not null check (level between 1 and 3),
  ord int not null default 0,
  title text not null,
  statement text not null,
  image_url text,
  actions_count int,
  expected_answer text not null,
  accepted_answers jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,          -- нарастающие подсказки
  guided_steps jsonb,                                -- L1: раннер-под-тему
  support jsonb,                                     -- L2: план/действия/найди ошибку
  algebra jsonb,                                     -- опциональный алгебраический блок
  reward_stars int not null default 10,
  active bool not null default true,
  created_at timestamptz not null default now()
);
create index if not exists olympiad_problems_topic_level
  on olympiad_problems (topic_id, level, ord);

create table if not exists topic_progress (
  child_id uuid not null references child_profiles(id) on delete cascade,
  topic_id text not null references olympiad_topics(id) on delete cascade,
  level int not null default 1 check (level between 1 and 3),
  solved_l1 int not null default 0,
  solved_l2 int not null default 0,
  solved_l3 int not null default 0,
  streak int not null default 0,
  fails_in_row int not null default 0,
  mastered bool not null default false,
  algebra_done bool not null default false,
  updated_at timestamptz not null default now(),
  primary key (child_id, topic_id)
);

create table if not exists olympiad_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  problem_id uuid not null references olympiad_problems(id) on delete cascade,
  topic_id text not null,
  level int not null,
  status text not null default 'solving',   -- solving|solved|failed|pendingReview
  attempts int not null default 0,
  hints_used int not null default 0,
  duration_ms bigint not null default 0,
  worksheet_url text,                       -- L3: фото листочка
  answer_given text,
  review_verdict text,                      -- методист по листочку
  review_feedback text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists olympiad_attempts_child
  on olympiad_attempts (child_id, started_at desc);

-- ─────────────────────────────────────────────
-- Награды: кошелёк уже в child_profiles.stars; сундук, наклейки, лавка, маскот
-- ─────────────────────────────────────────────
create table if not exists chest_opens (
  child_id uuid not null references child_profiles(id) on delete cascade,
  date date not null,
  prize jsonb not null,                    -- {kind, amount|stickerId|bonusId, label}
  opened_at timestamptz not null default now(),
  primary key (child_id, date)
);

create table if not exists stickers_catalog (
  id text primary key,
  title text not null,
  art text not null,                        -- id SVG-спрайта
  series text not null,
  rarity text not null default 'common'
);

create table if not exists sticker_ownership (
  child_id uuid not null references child_profiles(id) on delete cascade,
  sticker_id text not null references stickers_catalog(id) on delete cascade,
  obtained_at timestamptz not null default now(),
  primary key (child_id, sticker_id)
);

create table if not exists shop_items (
  id text primary key,
  kind text not null,                       -- outfit|accessory|room|stickerPack
  title text not null,
  price_stars int not null,
  art text not null,
  description text not null default ''
);

create table if not exists mascot_state (
  child_id uuid primary key references child_profiles(id) on delete cascade,
  equipped jsonb not null default '[]'::jsonb,
  owned jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists star_transactions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  delta int not null,
  reason text not null,                     -- problem|chest|shop|riddle|duel…
  ref text,
  created_at timestamptz not null default now()
);
create index if not exists star_tx_child on star_transactions (child_id, created_at desc);

-- ─────────────────────────────────────────────
-- Загадка дня
-- ─────────────────────────────────────────────
create table if not exists daily_riddles (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  question text not null,
  accepted_answers jsonb not null default '[]'::jsonb,
  hint text not null default '',
  reward_stars int not null default 5
);

create table if not exists riddle_solves (
  child_id uuid not null references child_profiles(id) on delete cascade,
  riddle_id uuid not null references daily_riddles(id) on delete cascade,
  solved_at timestamptz not null default now(),
  primary key (child_id, riddle_id)
);

-- ─────────────────────────────────────────────
-- Дуэли
-- ─────────────────────────────────────────────
create table if not exists duel_results (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  game_id text not null,                    -- mental-math|patterns|quick-logic
  score int not null,
  correct int not null default 0,
  wrong int not null default 0,
  played_at timestamptz not null default now()
);
create index if not exists duel_results_board on duel_results (game_id, score desc);

-- ─────────────────────────────────────────────
-- Платежи (ЮKassa) и подписки
-- ─────────────────────────────────────────────
create table if not exists subscriptions (
  parent_id uuid primary key references parents(id) on delete cascade,
  status text not null default 'trial',     -- trial|active|expired|canceled
  plan text not null default 'monthly',     -- monthly|school
  paid_until date
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references parents(id) on delete cascade,
  amount_rub numeric(10,2) not null,
  status text not null default 'pending',   -- pending|succeeded|canceled
  yookassa_id text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- События аналитики (хранить ВСЁ: попытки, ошибки, тайминги)
-- ─────────────────────────────────────────────
create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  child_id uuid references child_profiles(id) on delete set null,
  kind text not null,                       -- attempt|hint|fail|levelUp|levelDown|login…
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_child on analytics_events (child_id, created_at desc);

-- ─────────────────────────────────────────────
-- RPC: начисление/списание звёзд с журналом
-- ─────────────────────────────────────────────
create or replace function add_stars(p_child uuid, p_delta int, p_reason text, p_ref text default null)
returns int language plpgsql security definer as $$
declare new_balance int;
begin
  update child_profiles set stars = greatest(0, stars + p_delta)
    where id = p_child returning stars into new_balance;
  insert into star_transactions (child_id, delta, reason, ref)
    values (p_child, p_delta, p_reason, p_ref);
  return new_balance;
end $$;
