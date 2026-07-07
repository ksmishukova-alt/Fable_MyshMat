-- МышМат — setup_all.sql: все миграции одним файлом (для Supabase SQL Editor).
-- Порядок: 0001 init → 0002 seed → 0003 auth → 0004 submit → 0005 platform → 0006 users → 0007 daily content → 0008 storage.

-- ═══════════════ packages/db/0001_init.sql ═══════════════
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

-- ═══════════════ packages/db/0002_seed.sql ═══════════════
-- МышМат — сид данных (демо-ребёнок Артём + банк заданий, совпадает с моками)

-- ребёнок
insert into child_profiles (id, name, grade, stars)
values ('11111111-1111-1111-1111-111111111111', 'Артём', 3, 245)
on conflict (id) do nothing;

-- награды-карточки (нужна хотя бы МышРутка для триггера)
insert into reward_cards (type, title, description) values
  ('myshroutka', 'МышРутка', 'Открывает игровой мир за выполненный Daily'),
  ('doneDaily', 'DoneDaily', 'Daily выполнен'),
  ('perfectDaily', 'PerfectDaily', 'Daily без единой доработки')
on conflict do nothing;

-- ЗАДАНИЯ ------------------------------------------------------
-- математика 1 (platform, 1 шаг)
with t as (
  insert into tasks (id, subject, title, mode, prompt, est_minutes)
  values ('a0000000-0000-0000-0000-000000000001','math','Сложение в пределах 100','platform','Реши пример.',8)
  on conflict (id) do nothing returning id
)
insert into task_steps (task_id, ord, kind, prompt, hint, options)
select 'a0000000-0000-0000-0000-000000000001',1,'question',
  'Сколько будет 47 + 38?',
  'Сложи десятки: 40 + 30 = 70. Потом единицы: 7 + 8 = 15. Сложи вместе.',
  '[{"id":"a","label":"75","is_correct":false},{"id":"b","label":"85","is_correct":true},{"id":"c","label":"95","is_correct":false},{"id":"d","label":"83","is_correct":false}]'
where not exists (select 1 from task_steps where task_id='a0000000-0000-0000-0000-000000000001' and ord=1);

-- математика 2 (worksheet)
insert into tasks (id, subject, title, mode, prompt, est_minutes)
values ('a0000000-0000-0000-0000-000000000002','math','Задача про конфеты','worksheet',
  'У Маши было 24 конфеты. Она разложила их поровну в 3 коробки, а потом добавила в каждую ещё по 2. Сколько конфет стало в каждой коробке? Реши на листочке и сфотографируй решение.',10)
on conflict (id) do nothing;

-- русский (worksheet)
insert into tasks (id, subject, title, mode, prompt, est_minutes)
values ('b0000000-0000-0000-0000-000000000001','russian','Безударные гласные','worksheet',
  'Спиши и вставь пропущенные буквы, обозначь ударение: «гр_за, тр_ва, с_сна, в_лна». Сфотографируй листочек.',8)
on conflict (id) do nothing;

-- чтение (platform, 3 шага)
insert into tasks (id, subject, title, mode, prompt, est_minutes)
values ('c0000000-0000-0000-0000-000000000001','reading','Понимаем прочитанное','platform','Прочитай отрывок и ответь на вопросы.',10)
on conflict (id) do nothing;
insert into task_steps (task_id, ord, kind, prompt, passage)
select 'c0000000-0000-0000-0000-000000000001',1,'reading','Шаг 1. Внимательно прочитай отрывок.',
  'Мальчик стоял у калитки и смотрел на темнеющее небо. Дома ждал тёплый ужин, но он не торопился — хотелось досмотреть, как загорается первая звезда. Когда она наконец вспыхнула над крышей соседнего дома, мальчик улыбнулся и побежал домой.'
where not exists (select 1 from task_steps where task_id='c0000000-0000-0000-0000-000000000001' and ord=1);
insert into task_steps (task_id, ord, kind, prompt, hint, options)
select 'c0000000-0000-0000-0000-000000000001',2,'question','Шаг 2. Чего ждал мальчик у калитки?',
  'Перечитай, на что он смотрел и что хотел досмотреть.',
  '[{"id":"a","label":"Когда позовут ужинать","is_correct":false},{"id":"b","label":"Когда загорится первая звезда","is_correct":true},{"id":"c","label":"Когда придёт сосед","is_correct":false}]'
where not exists (select 1 from task_steps where task_id='c0000000-0000-0000-0000-000000000001' and ord=2);
insert into task_steps (task_id, ord, kind, prompt, hint, options)
select 'c0000000-0000-0000-0000-000000000001',3,'question','Шаг 3. Что сделал мальчик, когда звезда вспыхнула?',
  'Последнее предложение отрывка.',
  '[{"id":"a","label":"Улыбнулся и побежал домой","is_correct":true},{"id":"b","label":"Загадал желание","is_correct":false},{"id":"c","label":"Остался у калитки до утра","is_correct":false}]'
where not exists (select 1 from task_steps where task_id='c0000000-0000-0000-0000-000000000001' and ord=3);

-- дневник читателя (platform, свободный ввод)
insert into tasks (id, subject, title, mode, prompt, est_minutes)
values ('c0000000-0000-0000-0000-000000000002','reading','Дневник читателя · 30 минут','platform','Запиши, что читаешь сегодня.',30)
on conflict (id) do nothing;
insert into task_steps (task_id, ord, kind, prompt, correct_input)
select 'c0000000-0000-0000-0000-000000000002',1,'question',
  'Напиши название книги и одно предложение о том, что понравилось.',''
where not exists (select 1 from task_steps where task_id='c0000000-0000-0000-0000-000000000002' and ord=1);

-- английский (platform, 1 шаг)
insert into tasks (id, subject, title, mode, prompt, est_minutes)
values ('d0000000-0000-0000-0000-000000000001','english','Present Simple','platform','Choose the correct form.',9)
on conflict (id) do nothing;
insert into task_steps (task_id, ord, kind, prompt, hint, options)
select 'd0000000-0000-0000-0000-000000000001',1,'question','«She ___ to school every day.»',
  'Present Simple, 3rd person singular → глагол получает -s/-es.',
  '[{"id":"a","label":"go","is_correct":false},{"id":"b","label":"goes","is_correct":true},{"id":"c","label":"going","is_correct":false},{"id":"d","label":"gone","is_correct":false}]'
where not exists (select 1 from task_steps where task_id='d0000000-0000-0000-0000-000000000001' and ord=1);

-- состав Daily по предметам
insert into daily_task_configs (subject, task_id, ord) values
  ('math','a0000000-0000-0000-0000-000000000001',1),
  ('math','a0000000-0000-0000-0000-000000000002',2),
  ('russian','b0000000-0000-0000-0000-000000000001',1),
  ('reading','c0000000-0000-0000-0000-000000000001',1),
  ('reading','c0000000-0000-0000-0000-000000000002',2),
  ('english','d0000000-0000-0000-0000-000000000001',1)
on conflict do nothing;

-- ═══════════════ packages/db/0003_auth.sql ═══════════════
-- МышМат — миграция 0003: вход ребёнка (PIN + короткий код)
-- Добавляет к child_profiles поля аутентификации, которые использует /api/login.

alter table child_profiles
  add column if not exists pin_hash text,       -- bcrypt-хэш 4-значного PIN
  add column if not exists short_code text;     -- короткий код входа, напр. MISH42

-- короткий код уникален среди детей
create unique index if not exists child_profiles_short_code_key
  on child_profiles (short_code)
  where short_code is not null;

-- Демо-данные для входа (совпадают с моками).
-- ВНИМАНИЕ: в проде pin_hash хранит bcrypt('1234'), здесь — текст-плейсхолдер.
-- Реальная проверка PIN должна выполняться через bcrypt-сравнение на сервере.
update child_profiles
  set short_code = 'MISH42'
  where id = '11111111-1111-1111-1111-111111111111'
    and short_code is null;

-- второй демо-ребёнок (Маша), если его ещё нет
insert into child_profiles (id, name, grade, stars, short_code)
values ('22222222-2222-2222-2222-222222222222', 'Маша', 2, 120, 'MISH88')
on conflict (id) do nothing;

-- ═══════════════ packages/db/0004_submit_attempt.sql ═══════════════
-- МышМат — миграция 0004: надёжное серверное сохранение попытки
-- Одна RPC делает всё атомарно:
--   1. находит/создаёт сегодняшнюю сессию ребёнка
--   2. сохраняет попытку (daily_task_attempts)
--   3. пересчитывает статус предмета в daily_subject_progress
--   4. пересчитывает Daily и при готовности выдаёт МышРутку
--
-- Клиент шлёт только: child_id, task_id, режим/результат, аналитику.
-- session_id вычисляется на сервере — клиенту его знать не нужно.

create or replace function submit_task_attempt(
  p_child uuid,
  p_task uuid,
  p_mode task_mode,
  p_is_correct bool,
  p_autonomy numeric default null
)
returns jsonb language plpgsql as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_session uuid;
  v_subject subject_id;
  v_attempt uuid;
  v_status subject_status;
  v_subj_total int;
  v_subj_done int;
  v_subj_status subject_status;
  v_granted bool;
begin
  -- предмет задания
  select subject into v_subject from tasks where id = p_task;
  if v_subject is null then
    return jsonb_build_object('ok', false, 'reason', 'task-not-found');
  end if;

  -- сессия на сегодня (создаём при отсутствии)
  select id into v_session from daily_sessions
    where child_id = p_child and date = v_today;
  if v_session is null then
    insert into daily_sessions (child_id, date, status)
      values (p_child, v_today, 'inProgress')
      returning id into v_session;
  end if;

  -- статус попытки
  v_status := case
    when p_mode = 'worksheet' then 'submitted'      -- листочек → на проверку взрослому
    when p_is_correct then 'successful'             -- платформа, решено верно
    else 'submitted'                                -- платформа, отправлено (есть ошибки)
  end;

  -- сохранить попытку
  insert into daily_task_attempts
    (session_id, task_id, child_id, mode, is_correct, autonomy_score, status, submitted_at)
  values
    (v_session, p_task, p_child, p_mode, p_is_correct, p_autonomy, v_status, now())
  returning id into v_attempt;

  -- сколько заданий в предмете всего и сколько уже сдано (по последним попыткам)
  select count(*) into v_subj_total
    from daily_task_configs where subject = v_subject and active = true;

  select count(distinct dtc.task_id) into v_subj_done
    from daily_task_configs dtc
    join daily_task_attempts a
      on a.task_id = dtc.task_id
     and a.session_id = v_session
     and a.status in ('submitted','successful','perfect')
   where dtc.subject = v_subject and dtc.active = true;

  -- статус предмета: всё сдано → submitted (минимум), иначе inProgress
  v_subj_status := case when v_subj_total > 0 and v_subj_done >= v_subj_total
                        then 'submitted' else 'inProgress' end;

  -- upsert прогресса предмета
  insert into daily_subject_progress (session_id, subject, status, tasks_total, tasks_done)
  values (v_session, v_subject, v_subj_status, v_subj_total, v_subj_done)
  on conflict (session_id, subject) do update
    set status = excluded.status,
        tasks_total = excluded.tasks_total,
        tasks_done = excluded.tasks_done;

  -- пересчёт Daily + выдача МышРутки (использует уже существующую функцию)
  perform recompute_daily_and_grant_myshroutka(v_session);

  select myshroutka_granted into v_granted from daily_sessions where id = v_session;

  return jsonb_build_object(
    'ok', true,
    'attemptId', v_attempt,
    'sessionId', v_session,
    'subject', v_subject,
    'subjectDone', v_subj_done,
    'subjectTotal', v_subj_total,
    'myshroutkaGranted', coalesce(v_granted, false)
  );
end $$;

-- ═══════════════ packages/db/0005_platform.sql ═══════════════
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

-- ═══════════════ packages/db/0006_seed_users.sql ═══════════════
-- МышМат — миграция 0006: стартовые аккаунты.
-- Пароли/PIN хэшированы scrypt (см. apps/web/src/lib/hash.ts).
-- Демо-доступы: дети artem/masha (PIN 1234), методист ks.mishukova@gmail.com (demo1234),
-- родитель parent@myshmat.ru (demo1234). СМЕНИТЬ ПАРОЛИ после первого входа.

insert into methodists (id, email, name, password_hash, telegram_chat_id) values
  ('33333333-3333-3333-3333-333333333333', 'ks.mishukova@gmail.com', 'Ксения',
   'scrypt$6df72dcc5b035442478440957e29d093$edf443e93f7622db69a207295aeeac05c32807868b5cd61c9d32ac36bddb12e7',
   '881071570')
on conflict (email) do nothing;

insert into parents (id, email, name, password_hash, telegram_chat_id, created_by) values
  ('44444444-4444-4444-4444-444444444444', 'parent@myshmat.ru', 'Родитель',
   'scrypt$66b4c8973c19f6056541f9431171c6b6$14d106d690ae0940933d06e1b08d35a4d694b4cc1ca7fe32e23cdf5581fea65e',
   '881071570',
   '33333333-3333-3333-3333-333333333333')
on conflict (email) do nothing;

-- Дети (профили создаёт 0002/0003; здесь — логины, PIN и связи)
update child_profiles set
  login = 'artem',
  pin_hash = 'scrypt$3412f8b9356864fcef49c962d495d48a$24250c2453d709416f27edfcb44d7a7d2c2ba31ecaf2895e6cd88ff782acfb29',
  real_parent_id = '44444444-4444-4444-4444-444444444444',
  methodist_id = '33333333-3333-3333-3333-333333333333'
where id = '11111111-1111-1111-1111-111111111111';

update child_profiles set
  login = 'masha',
  pin_hash = 'scrypt$1b1514d147026ceda16eca18586427f5$613232943176d25dbcb6bf6413b9dcb22b7b8600bfa848beb3aee6277b93a5bb',
  real_parent_id = '44444444-4444-4444-4444-444444444444',
  methodist_id = '33333333-3333-3333-3333-333333333333'
where id = '22222222-2222-2222-2222-222222222222';

insert into subscriptions (parent_id, status, plan) values
  ('44444444-4444-4444-4444-444444444444', 'trial', 'monthly')
on conflict (parent_id) do nothing;

-- ═══════════════ packages/db/0007_daily_content.sql ═══════════════
-- МышМат — миграция 0007: банк Daily-контента под все 10 раннеров.
-- 1) tasks.slug — идемпотентный импорт (TS-сид и CSV).
-- 2) task_steps.payload — специфика раннера (words/cards/gaps/columns/…).
-- 3) step_kind расширяется до всех типов раннеров.

alter table tasks add column if not exists slug text;
create unique index if not exists tasks_slug_key on tasks (slug) where slug is not null;

alter table task_steps add column if not exists payload jsonb not null default '{}'::jsonb;

-- расширение enum (в Postgres — add value; порядок не важен)
do $$ begin alter type step_kind add value if not exists 'punctuation'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'order'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'wordfix'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'gapinput'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'sort'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'fields'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'audio'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'listening'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'proofread'; exception when others then null; end $$;
do $$ begin alter type step_kind add value if not exists 'readaloud'; exception when others then null; end $$;

-- ═══════════════ packages/db/0008_storage.sql ═══════════════
-- МышМат — миграция 0008: бакеты Storage.
-- worksheets — фото листочков L3 и письменных заданий; uploads — аудио решения.
insert into storage.buckets (id, name, public)
values ('worksheets', 'worksheets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

