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
