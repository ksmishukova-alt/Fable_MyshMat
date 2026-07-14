-- 0013: коллекция «Команда МышМат» (Panini-карточки) + удаление тамагочи
-- Скрипт самодостаточный: можно выполнять на любом состоянии базы, повторно — безопасно.

-- 0) таблицы наклеек (если базу ставили без 0005 — создадим)
create table if not exists stickers_catalog (
  id text primary key,
  title text not null,
  art text not null,
  series text not null,
  rarity text not null default 'common'
);
create table if not exists sticker_ownership (
  child_id uuid not null references child_profiles(id) on delete cascade,
  sticker_id text not null references stickers_catalog(id) on delete cascade,
  obtained_at timestamptz not null default now(),
  primary key (child_id, sticker_id)
);

-- 1) чистим старый каталог (каскадом уйдут и старые владения наклейками)
delete from sticker_ownership;
delete from stickers_catalog;

-- 2) сеем 24 карточки трёх команд (id должны совпадать с apps/web/src/lib/stickers-catalog.ts)
insert into stickers_catalog (id, title, art, series, rarity) values
  ('mat-plus', 'Капитан Плюс', 'mat-plus', 'Матемышата', 'epic'),
  ('mat-chet', 'Королева Чётность', 'mat-chet', 'Матемышата', 'rare'),
  ('mat-iks', 'Икс Неизвестный', 'mat-iks', 'Матемышата', 'rare'),
  ('mat-minus', 'Профессор Минус', 'mat-minus', 'Матемышата', 'common'),
  ('mat-drob', 'Мадам Дробь', 'mat-drob', 'Матемышата', 'common'),
  ('mat-cirkul', 'Граф Циркуль', 'mat-cirkul', 'Матемышата', 'common'),
  ('mat-nol', 'Малыш Ноль', 'mat-nol', 'Матемышата', 'common'),
  ('mat-tablica', 'Тётя Таблица', 'mat-tablica', 'Матемышата', 'common'),
  ('slo-zapyataya', 'Мисс Запятая', 'slo-zapyataya', 'Словогрызы', 'epic'),
  ('slo-glagol', 'Дядя Глагол', 'slo-glagol', 'Словогрызы', 'rare'),
  ('slo-chitaika', 'Читайка Быстрая', 'slo-chitaika', 'Словогрызы', 'rare'),
  ('slo-bukvoed', 'Буквоед Гоша', 'slo-bukvoed', 'Словогрызы', 'common'),
  ('slo-suffiks', 'Шёпот Суффикс', 'slo-suffiks', 'Словогрызы', 'common'),
  ('slo-diktant', 'Пан Диктант', 'slo-diktant', 'Словогрызы', 'common'),
  ('slo-udarenie', 'Ася Ударение', 'slo-udarenie', 'Словогрызы', 'common'),
  ('slo-tochka', 'Точка-Непоседа', 'slo-tochka', 'Словогрызы', 'common'),
  ('eng-cheese', 'Mister Cheese', 'eng-cheese', 'Инглиш Старз', 'epic'),
  ('eng-hello', 'Captain Hello', 'eng-hello', 'Инглиш Старз', 'rare'),
  ('eng-apple', 'Lady Apple', 'eng-apple', 'Инглиш Старз', 'rare'),
  ('eng-sunny', 'Sunny Mouse', 'eng-sunny', 'Инглиш Старз', 'common'),
  ('eng-bobby', 'Bobby Book', 'eng-bobby', 'Инглиш Старз', 'common'),
  ('eng-molly', 'Molly Moon', 'eng-molly', 'Инглиш Старз', 'common'),
  ('eng-danny', 'Danny Dog', 'eng-danny', 'Инглиш Старз', 'common'),
  ('eng-tiny', 'Tiny Tail', 'eng-tiny', 'Инглиш Старз', 'common')
on conflict (id) do nothing;

-- 3) тамагочи убран из продукта: сносим его таблицы, если они есть
do $$
begin
  if to_regclass('public.mascot_state') is not null then
    execute 'drop table public.mascot_state cascade';
  end if;
  if to_regclass('public.shop_items') is not null then
    execute 'drop table public.shop_items cascade';
  end if;
end $$;
