-- МышМат — миграция 0008: бакеты Storage.
-- worksheets — фото листочков L3 и письменных заданий; uploads — аудио решения.
insert into storage.buckets (id, name, public)
values ('worksheets', 'worksheets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
