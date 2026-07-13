/**
 * МышМат — доменные типы.
 *
 * Это контракт между фронтендом и бэкендом. Все статусы и сущности
 * соответствуют ТЗ v1 (механика МышРутки).
 *
 * Ключевая идея МышРутки: ребёнок выполняет всё со своей стороны
 * (все 4 предмета доходят до статуса `submitted`), и СРАЗУ, не дожидаясь
 * проверки методиста, получает МышРутку — она открывает игровой мир
 * (Карту тем, Лайфхаки, Сундуки, Награды).
 */

// ─────────────────────────────────────────────────────────────
// Предметы
// ─────────────────────────────────────────────────────────────

export type SubjectId = "math" | "russian" | "reading" | "english";

export interface Subject {
  id: SubjectId;
  /** Отображаемое имя, напр. «Математика» */
  title: string;
  /** Короткая иконка-глиф для плашки, напр. «1+2», «АБ», «📖», «Aa» */
  glyph: string;
}

export const SUBJECTS: Record<SubjectId, Subject> = {
  math: { id: "math", title: "Математика", glyph: "1+2" },
  russian: { id: "russian", title: "Русский", glyph: "АБ" },
  reading: { id: "reading", title: "Чтение", glyph: "📖" },
  english: { id: "english", title: "Английский", glyph: "Aa" },
};

// ─────────────────────────────────────────────────────────────
// Статусы (из ТЗ v1)
// ─────────────────────────────────────────────────────────────

/**
 * Статус одного предмета в Daily.
 * notStarted → inProgress → submitted → (проверка) → successful | perfect
 * needsRevision — методист вернул на доработку (попадает в «Мои доработки»).
 */
export type SubjectStatus =
  | "notStarted"
  | "inProgress"
  | "submitted"
  | "successful"
  | "perfect"
  | "needsRevision";

/**
 * Статус всей Daily-сессии за день.
 * Daily становится `submitted`, когда ВСЕ предметы достигли `submitted`
 * (со стороны ребёнка) — в этот момент выдаётся МышРутка.
 */
export type DailyStatus =
  | "notStarted"
  | "inProgress"
  | "submitted" // все предметы submitted → выдана МышРутка
  | "successful" // методист проверил всё, всё зачтено
  | "perfect"; // всё зачтено без доработок

/**
 * Где выполняется задание:
 * - platform: проверяется автоматически на платформе (auto-check)
 * - worksheet: решается «на листочке», ребёнок загружает фото, проверяет взрослый
 */
export type TaskMode = "platform" | "worksheet";

// ─────────────────────────────────────────────────────────────
// Задания и попытки
// ─────────────────────────────────────────────────────────────

export interface DailyTask {
  id: string;
  subjectId: SubjectId;
  title: string;
  mode: TaskMode;
  /** Порядок в списке предмета */
  order: number;
  /** Оценочное время в минутах */
  estMinutes?: number;
  status: SubjectStatus;
}

/** Сводка по предмету для главного экрана */
export interface SubjectSummary {
  subjectId: SubjectId;
  status: SubjectStatus;
  tasksTotal: number;
  tasksDone: number;
}

// ─────────────────────────────────────────────────────────────
// Daily-сессия
// ─────────────────────────────────────────────────────────────

export interface DailySession {
  id: string;
  childId: string;
  /** ISO-дата дня, напр. «2026-06-15» */
  date: string;
  status: DailyStatus;
  subjects: SubjectSummary[];
  /** Выдана ли МышРутка (открыт ли игровой мир) */
  myshroutkaGranted: boolean;
  submittedAt: string | null;
}

// ─────────────────────────────────────────────────────────────
// МышРутка — логика разблокировки
// ─────────────────────────────────────────────────────────────

/** Предмет «сдан со стороны ребёнка», если дошёл до submitted и дальше. */
export function isSubjectSubmittedByChild(status: SubjectStatus): boolean {
  return (
    status === "submitted" ||
    status === "successful" ||
    status === "perfect"
  );
}

/**
 * МышРутка выдаётся, когда ВСЕ предметы выполнены со стороны ребёнка.
 * Это и есть условие разблокировки игрового мира.
 */
export function isMyshroutkaEarned(subjects: SubjectSummary[]): boolean {
  return (
    subjects.length > 0 &&
    subjects.every((s) => isSubjectSubmittedByChild(s.status))
  );
}

/** Сколько предметов уже сдано (для прогресс-бара Daily). */
export function countSubmitted(subjects: SubjectSummary[]): number {
  return subjects.filter((s) => isSubjectSubmittedByChild(s.status)).length;
}

// ─────────────────────────────────────────────────────────────
// Игровой мир (разблокируется МышРуткой одним событием)
// ─────────────────────────────────────────────────────────────

/** Все эти зоны открываются вместе при получении МышРутки. */
export type WorldFeature =
  | "topicMap" // Карта тем (олимпиадный маршрут)
  | "lifehacks" // Лайфхаки
  | "chests" // Сундуки
  | "rewards" // Награды
  | "duels"; // Дуэли (на MVP — заглушка, всегда «скоро»)

/** Дуэли включены: три мини-игры + таблица лидеров (Фаза 3). */
export const DUELS_ENABLED_MVP = true;

export interface WorldState {
  unlocked: boolean; // = myshroutkaGranted
  features: Record<WorldFeature, boolean>;
}

/**
 * ВРЕМЕННО НА ВРЕМЯ ТЕСТИРОВАНИЯ: всё открыто.
 * Чтобы вернуть нормальную блокировку по МышРутке — поставьте false.
 */
export const UNLOCK_ALL_FOR_TESTING = true;

export function buildWorldState(session: DailySession): WorldState {
  const unlocked = UNLOCK_ALL_FOR_TESTING || session.myshroutkaGranted;
  return {
    unlocked,
    features: {
      topicMap: unlocked,
      lifehacks: unlocked,
      chests: unlocked,
      rewards: unlocked,
      duels: unlocked && DUELS_ENABLED_MVP,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Доработки и наклейки
// ─────────────────────────────────────────────────────────────

export interface RevisionItem {
  taskId: string;
  subjectId: SubjectId;
  /** Название задания (для списка доработок). */
  title?: string;
  /** Комментарий методиста (из проверки в кабинете или Telegram). */
  feedback?: string;
}

export interface RevisionsSummary {
  count: number;
  items: RevisionItem[];
}

export interface StickerAlbum {
  collected: number;
  total: number;
}

// ─────────────────────────────────────────────────────────────
// Профиль и неделя
// ─────────────────────────────────────────────────────────────

export interface ChildProfile {
  id: string;
  name: string;
  grade: number; // класс
  avatarUrl?: string;
}

export type DayMark = "done" | "missed" | "today" | "future";

/**
 * Реальная неделя (Пн–Пт) на основе текущего дня.
 * Система статусов (согласована в концепции):
 *  - done   : день прошёл/идёт и Daily сделан → зелёный кружок с галочкой
 *  - missed : день прошёл, Daily НЕ сделан → красная пунктирная рамка
 *  - today  : идёт сегодня, Daily ещё не завершён → синяя пунктирная рамка
 *  - future : день ещё не наступил → серый кружок с тремя точками
 *
 * doneDays — индексы (0=Пн..4=Пт) дней, где Daily выполнен.
 * doneToday — выполнен ли сегодняшний Daily.
 */
export function buildWeek(
  now: Date = new Date(),
  doneDays: number[] = [0, 1],
  doneToday = false,
): WeekDay[] {
  const labels = ["Пн", "Вт", "Ср", "Чт", "Пт"];
  const js = now.getDay();
  const todayIdx = js === 0 || js === 6 ? 5 : js - 1; // сб/вс → вся неделя прошла
  return labels.map((label, i) => {
    let mark: DayMark;
    if (i < todayIdx) {
      mark = doneDays.includes(i) ? "done" : "missed";
    } else if (i === todayIdx) {
      mark = doneToday ? "done" : "today";
    } else {
      mark = "future";
    }
    return { label, mark };
  });
}

export interface WeekDay {
  /** «Пн», «Вт», … */
  label: string;
  mark: DayMark;
}

export interface HomeScreenData {
  profile: ChildProfile;
  session: DailySession;
  revisions: RevisionsSummary;
  stickers: StickerAlbum;
  week: WeekDay[];
  /** Назначен ли Daily на сегодня методистом (нет строки в расписании → выходной). */
  scheduledToday?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Содержимое задания (экран /daily/[subject]/[task])
// ─────────────────────────────────────────────────────────────

/** Вариант ответа для шага-вопроса. */
export interface AnswerOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

/**
 * Тип одного шага задания:
 * - reading: показываем текст/условие, ответа нет, только «Далее»
 * - question: вопрос с вариантами или свободным вводом, есть проверка
 */
/** Лимит попыток на шаг (ТЗ): после 3 неудачных → «Пока не получилось» → доработки. */
export const MAX_ATTEMPTS = 3;

export type StepKind =
  | "reading"
  | "question"
  | "punctuation" // RU_PUNCTUATION_MARKER — знаки + заглавные
  | "order" // RU_SENTENCE_ORDER — карточки в правильном порядке
  | "wordfix" // RU_CONTEXT_WORD_FIX — найти неподходящее слово и заменить
  | "gapinput" // ввод в пропуск(и): орфограммы, проверочные, грамматика, анаграммы, vocab
  | "sort" // сортировка слов по колонкам (2-4 группы)
  | "fields" // поля-разбор: морфемы, словосочетание (несколько подписанных полей)
  | "audio" // аудиодиктант: плеер (лимит прослушиваний) + загрузка фото
  | "listening" // аудирование: диалог + вопросы (варианты и/или короткий ввод)
  | "proofread" // найти ошибки в тексте и исправить (клик по слову + ввод)
  | "readaloud"; // прочитать вслух и записать звук из браузера

/** Допустимый знак в раннере пунктуации. */
export type PunctMark = "." | "," | "?" | "!" | "";

/**
 * Один шаг внутри задания «на платформе».
 * Подсказка появляется ТОЛЬКО со второй попытки (после первой ошибки) —
 * это позволяет измерять самостоятельность ребёнка.
 */
export interface TaskStep {
  id: string;
  kind: StepKind;
  /** Заголовок/инструкция шага */
  prompt: string;
  /** Текст для чтения (reading) или контекст вопроса */
  passage?: string;
  /** Подсказка (question) — доступна со 2-й попытки */
  hint?: string;
  /** Варианты (question). Пусто → свободный ввод. */
  options?: AnswerOption[];
  /** Правильный ответ для свободного ввода */
  correctInput?: string;
  /** Если задано — показываем трекер чтения на N минут (дневник читателя) */
  readingTimerMinutes?: number;

  // ── punctuation (RU_PUNCTUATION_MARKER) ──
  /** Слова исходного текста (без знаков), между ними слоты для знаков. */
  words?: string[];
  /** Эталон: знак после каждого слова по индексу (для слота i). */
  expectedMarks?: PunctMark[];
  /** Эталон: индексы слов, которые должны быть с заглавной буквы. */
  expectedCapitals?: number[];

  // ── order (RU_SENTENCE_ORDER) ──
  /** Карточки в перемешанном виде (то, что видит ребёнок). */
  cards?: string[];
  /** Один или несколько допустимых порядков (массив индексов исходных cards). */
  acceptedOrders?: number[][];

  // ── wordfix (RU_CONTEXT_WORD_FIX) ──
  /** Слова предложения (кликабельные). */
  sentenceWords?: string[];
  /** Индекс неподходящего слова. */
  wrongWordIndex?: number;
  /** Варианты замены (тексты). */
  replacements?: string[];
  /** Правильная замена (текст из replacements). */
  correctReplacement?: string;

  // ── gapinput (ввод в пропуск) ──
  /**
   * Элементы с пропусками. Каждый: текст с маркером пропуска "_" и ответ(ы).
   * Подходит для орфограмм, проверочных слов, грамматики, анаграмм, vocab.
   */
  gaps?: {
    /** Подпись/контекст слева (напр. "л_сной" или "I ___ a student"). */
    label: string;
    /** Допустимые ответы (регистр и пробелы игнорируются при сверке). */
    accepted: string[];
    /** Необязательная подсказка к конкретному пропуску. */
    note?: string;
  }[];

  // ── sort (сортировка по колонкам) ──
  /** Заголовки колонок (2-4). */
  columns?: string[];
  /** Чипы-слова: текст + индекс правильной колонки. */
  chips?: { text: string; column: number }[];

  // ── fields (поля-разбор) ──
  /** Слово/пара, которую разбираем (показывается крупно). */
  fieldsSubject?: string;
  /** Поля разбора: подпись + допустимые ответы. */
  fields?: { label: string; accepted: string[] }[];

  // ── audio (аудиодиктант) ──
  /** Путь к аудиофайлу (если есть). Пусто → плеер-заглушка. */
  audioUrl?: string;
  /** Лимит прослушиваний (по умолчанию 2). */
  listenLimit?: number;

  // ── listening (аудирование: диалог + вопросы) ──
  /**
   * Вопросы по прослушанному. Каждый: либо варианты (options), либо короткий ввод (accepted).
   */
  listenQuestions?: {
    q: string;
    options?: string[]; // если заданы — выбор варианта
    correct?: string; // правильный вариант (из options)
    accepted?: string[]; // если options нет — короткий ввод, допустимые ответы
  }[];

  // ── proofread (найти и исправить ошибки) ──
  /** Слова текста. Кликабельны; ошибочные ребёнок должен найти и исправить. */
  proofWords?: string[];
  /**
   * Карта исправлений: индекс слова → допустимые правильные написания.
   * Только эти индексы считаются ошибочными; остальные — верные.
   */
  proofFixes?: { index: number; accepted: string[] }[];

  // ── readaloud (прочитать вслух, записать звук) ──
  /** Текст, который ребёнок читает вслух. */
  readText?: string;
}

/**
 * Полное содержимое задания. Экран ветвится по `mode`:
 * - platform: проходим шаги по порядку (steps), мгновенная проверка
 * - worksheet: показываем prompt + загрузка фото, отправка взрослому
 */
export interface TaskContent {
  id: string;
  subjectId: SubjectId;
  title: string;
  mode: TaskMode;
  order: number;
  total: number; // всего заданий в предмете (для «N из M»)
  estMinutes?: number;
  /** Условие/вопрос (для worksheet, и как интро для platform) */
  prompt: string;
  /** Шаги (только platform). Если 1 шаг — это обычное одношаговое задание. */
  steps?: TaskStep[];
}

// ─────────────────────────────────────────────────────────────
// Аналитика прохождения (самостоятельность)
// ─────────────────────────────────────────────────────────────

/**
 * Статистика по одному шагу — отправляется на бэкенд.
 * solvedFirstTry === true и hintUsed === false → ребёнок справился сам.
 */
export interface StepStat {
  stepId: string;
  attempts: number; // сколько раз нажал «Проверить» до верного
  hintUsed: boolean; // открывал ли подсказку (доступна со 2-й попытки)
  solvedFirstTry: boolean; // верно с первой попытки, без подсказки
  skippedWithError: boolean; // ушёл дальше, не решив верно
}

/** Сводка по всему заданию для оценки самостоятельности. */
export interface TaskAttemptReport {
  taskId: string;
  steps: StepStat[];
  /** доля шагов, решённых с первой попытки без подсказки (0..1) */
  autonomyScore: number;
}

export function computeAutonomy(steps: StepStat[]): number {
  const answerable = steps.filter((s) => s.attempts > 0 || s.skippedWithError);
  if (answerable.length === 0) return 1;
  const clean = answerable.filter((s) => s.solvedFirstTry && !s.hintUsed).length;
  return clean / answerable.length;
}


// ─────────────────────────────────────────────────────────────
// Панель методиста — очередь проверки заданий «на листочке»
// ─────────────────────────────────────────────────────────────

/** Вердикт методиста по работе. */
export type ReviewVerdict = "successful" | "perfect" | "needsRevision";

/** Элемент очереди проверки. */
export interface ReviewItem {
  attemptId: string;
  childId: string;
  childName: string;
  subjectId: SubjectId;
  taskId: string;
  taskTitle: string;
  /** URL загруженного фото решения */
  solutionUrl: string;
  submittedAt: string; // ISO
}

/** Решение методиста, отправляемое на бэкенд. */
export interface ReviewDecision {
  attemptId: string;
  verdict: ReviewVerdict;
  feedback: string;
}

export const VERDICT_LABELS: Record<ReviewVerdict, { label: string; tone: string }> = {
  perfect: { label: "Отлично", tone: "green" },
  successful: { label: "Зачёт", tone: "blue" },
  needsRevision: { label: "На доработку", tone: "orange" },
};
