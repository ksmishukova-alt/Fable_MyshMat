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
