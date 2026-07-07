-- МышМат — миграция 0009: сид тем олимпиадного маршрута.
-- ВАЖНО: topic_progress ссылается на olympiad_topics по FK — без этих строк
-- прогресс не сохранялся бы. Плюс новая тема «Подсчёт фигур».

insert into olympiad_topics (id, title, description, glyph, color, depends_on, ord, has_algebra) values
  ('heads-legs', 'Головы и ноги', 'Приручи задачи про зайцев, змей и загадочные ноги!', '🐰', 'blue', '[]'::jsonb, 1, true),
  ('counting-figures', 'Подсчёт фигур', 'Сколько треугольников на рисунке? Больше, чем кажется!', '△', 'pink', '[]'::jsonb, 2, false),
  ('parity', 'Чётность', 'Чёт и нечет — волшебный ключ ко многим задачам.', '⚖️', 'purple', '[]'::jsonb, 3, false),
  ('logic', 'Логика', 'Рыцари, лжецы и хитрые рассуждения.', '🧩', 'green', '["parity"]'::jsonb, 4, false),
  ('dirichlet', 'Принцип Дирихле', 'Если кроликов больше, чем клеток…', '🕊️', 'orange', '["heads-legs","parity"]'::jsonb, 5, false)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  glyph = excluded.glyph,
  color = excluded.color,
  depends_on = excluded.depends_on,
  ord = excluded.ord,
  has_algebra = excluded.has_algebra;
