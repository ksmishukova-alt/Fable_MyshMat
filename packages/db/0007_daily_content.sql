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
