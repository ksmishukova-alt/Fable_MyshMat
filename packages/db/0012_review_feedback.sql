-- МышМат — миграция 0012: комментарий методиста к Daily-работе
-- (для отклонения через Telegram-кнопки и показа в «Доработках»).
alter table daily_task_attempts add column if not exists review_feedback text;
