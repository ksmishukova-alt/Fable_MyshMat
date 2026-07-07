# МышМат 2.0

Образовательная платформа: ежедневный Daily по четырём предметам — ворота в
олимпиадный игровой мир с темами глубины **L1 Тренировка → L2 С поддержкой → L3 Самостоятельно**.

## Структура

```
├── apps/web/            Next.js 15 + React 19 + TypeScript
│   ├── src/app/         страницы (ребёнок / родитель / методист) + API
│   ├── src/components/  экраны, раннеры Daily, раннеры олимпиады, маскот
│   ├── src/lib/         репозитории (Supabase + мок-fallback), auth, csv, telegram, юkassa
│   └── src/types/       доменные типы (Daily, олимпиада, награды, дуэли, роли)
├── packages/db/         SQL-миграции 0001–0008 + setup_all.sql (всё одним файлом)
└── ПЛАН-РЕАЛИЗАЦИИ.md   согласованный план
```

## Запуск

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000
```

Без ключей Supabase всё работает на демо-данных.
Демо-входы: ученик `artem` / PIN `1234` (и `masha`/`1234`), методист
`metodist@myshmat.ru` / `demo1234`, родитель `parent@myshmat.ru` / `demo1234`.

## Подключение Supabase

1. Ключи уже в `apps/web/.env.local` (файл не коммитится).
2. В Supabase SQL Editor выполни **`packages/db/setup_all.sql`** (идемпотентно).
3. `npm run dev` → войти методистом (`ks.mishukova@gmail.com` / `demo1234` — сменить пароль!)
   → вкладка «Банк задач» → «Загрузить недели 1–10 в БД».
4. `/api/health` должен показать `db: "supabase"` и childCount.

## Роли и flow

- **Ребёнок** (логин+PIN): главная → Daily (10 раннеров, 3 попытки) → все предметы
  submitted → МышРутка → сундук дня → олимпиадный мир: карта тем → уровни L1–L3,
  каскад провала (подсказки → альтернатива → откат → Telegram методисту),
  4 «чистых» решения подряд → уровень выше; L3 — листочек с фото. Награды: звёзды,
  лавка (SVG-наряды реально меняют маскота-тамагочи), альбом наклеек, значки-темы,
  загадка дня, дуэли (3 мини-игры + лидерборд).
- **Методист** (email+пароль): создаёт детей и родителей, PIN, набор предметов Daily,
  расписание (будни на N недель), порядок тем; очередь проверки (аудио/листочки);
  банк задач: сид недель 1–10 + CSV-импорт (daily/olympiad); аналитика по ребёнку.
- **Родитель**: сводный отчёт (время, темы, ошибки, рекомендации), несколько детей,
  расписание, подписка ЮKassa (без ключей — тестовый режим), отчёт в Telegram.

## CSV-импорт (кабинет методиста → «Банк задач»)

- Daily: `slug,subject,title,mode,prompt,est_minutes,steps_json`
- Олимпиада: `topic,level,order,title,statement,answer,accepted_json,hints_json,actions_count,guided_json,support_json,algebra_json,reward`

JSON-поля в кавычках, внутренние кавычки удваиваются (стандарт CSV).

## Перед боевым запуском

1. `src/types/domain.ts` → `UNLOCK_ALL_FOR_TESTING = false` (сейчас `true`, чтобы
   на приёмке игровой мир был открыт без прохождения Daily).
2. Сменить пароли демо-аккаунтов и PIN детей (кабинет методиста).
3. ЮKassa: `YOOKASSA_SHOP_ID` + `YOOKASSA_SECRET_KEY` в `.env.local`
   (и в переменных Vercel); webhook в ЛК ЮKassa → `https://<домен>/api/yookassa/webhook`.
4. В Vercel добавить переменные из `.env.local` (Settings → Environment Variables).

## Деплой (GitHub + Vercel)

```bash
git init && git add -A && git commit -m "MyshMat 2.0"
git remote add origin <репозиторий>
git push -u origin main            # или запусти push.bat
```

В Vercel: Import repo → **Root Directory = `apps/web`** → добавить env-переменные → Deploy.

## Проверка качества

`npm run typecheck` — строгие типы; `npm run build` — прод-сборка.
Смоук-тесты пройдены: scrypt-хэши (включая сиды 0006), JWT (подпись/подделка),
CSV-парсер (кавычки, запятые, JSON-поля), генератор «Головы и ноги» (все уровни).
