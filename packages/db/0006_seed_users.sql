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
