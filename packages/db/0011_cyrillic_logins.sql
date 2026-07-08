-- МышМат — миграция 0011: кириллические логины детей.
-- Вход нормализуется на сервере: нижний регистр, ё→е.
-- Демо-логины переводим на кириллицу (е вместо ё — так хранится нормализованная форма).

update child_profiles set login = 'артем'
 where id = '11111111-1111-1111-1111-111111111111' and (login = 'artem' or login is null);

update child_profiles set login = 'маша'
 where id = '22222222-2222-2222-2222-222222222222' and (login = 'masha' or login is null);
