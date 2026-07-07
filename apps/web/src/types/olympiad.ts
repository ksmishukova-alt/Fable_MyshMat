/**
 * МышМат — олимпиадное ядро (игровой мир).
 *
 * Модель уровней (согласована): тема = один узел карты, проходимый на 3 глубинах.
 *  L1 «Тренировка»       — пошаговый мастер с подсказками; типовые и нетиповые задачи.
 *  L2 «С поддержкой»     — сжатые шаги: собрать план, выбрать действие, записать
 *                          выражение, найти ошибку; подсказок минимум.
 *  L3 «Самостоятельно»   — олимпиадный формат: решение на листочке (фото методисту),
 *                          ответ проверяется автоматически.
 * Алгебраический метод — опциональный блок ВНУТРИ темы (flag), не уровень.
 */

// ─────────────────────────────────────────────────────────────
// Уровни
// ─────────────────────────────────────────────────────────────

export type OlympiadLevel = 1 | 2 | 3;

export const LEVEL_INFO: Record<OlympiadLevel, { title: string; short: string; hint: string }> = {
  1: { title: "Тренировка", short: "L1", hint: "Идём по шагам вместе с Мышом" },
  2: { title: "С поддержкой", short: "L2", hint: "Сам строишь план — Мыш рядом" },
  3: { title: "Самостоятельно", short: "L3", hint: "Настоящая олимпиадная задача" },
};

/** Задач на уровень (ориентир банка). */
export const PROBLEMS_PER_LEVEL = 10;
/** Решено подряд без ошибок → автоматический перевод на уровень выше. */
export const STREAK_TO_LEVEL_UP = 4;
/** Попытки на задачу (как в Daily). */
export const OLYMPIAD_MAX_ATTEMPTS = 3;

// ─────────────────────────────────────────────────────────────
// Темы и карта мира
// ─────────────────────────────────────────────────────────────

export interface OlympiadTopic {
  id: string;
  title: string;
  /** Короткое детское описание («Приручи задачи про головы и ноги!») */
  description: string;
  /** Эмодзи/глиф узла на карте */
  glyph: string;
  /** Темы, которые нужно пройти раньше (id). Пусто → открыта сразу. */
  dependsOn: string[];
  /** Порядок в шаблонном плане (методист может переопределить per-child). */
  order: number;
  /** Есть ли у темы алгебраический метод (опциональный блок). */
  hasAlgebra: boolean;
  /** Цвет узла на карте (токен), напр. "blue" | "purple" | "green" | "orange" | "pink" */
  color: string;
}

export type TopicNodeState = "locked" | "open" | "inProgress" | "mastered";

/** Прогресс ребёнка по теме. */
export interface TopicProgress {
  childId: string;
  topicId: string;
  /** Текущая глубина работы. */
  level: OlympiadLevel;
  /** Решено задач на каждом уровне. */
  solvedByLevel: Record<OlympiadLevel, number>;
  /** Текущая серия «подряд без ошибок» на активном уровне. */
  streak: number;
  /** Тема пройдена целиком (L3 закрыт) → значок на карте мышления. */
  mastered: boolean;
  /** Пройден ли алгебраический блок (если есть). */
  algebraDone: boolean;
}

// ─────────────────────────────────────────────────────────────
// Задача
// ─────────────────────────────────────────────────────────────

/** Шаг раннера-под-тему (L1): система ведёт за руку. */
export interface GuidedStep {
  id: string;
  /** Вопрос шага, напр. «Сколько ног было бы, если бы все были змеями?» */
  prompt: string;
  /** Пояснение метода (показывается после верного ответа). */
  explain?: string;
  /** Варианты. Пусто → числовой/текстовый ввод. */
  options?: { id: string; label: string; isCorrect: boolean }[];
  /** Допустимые ответы свободного ввода. */
  accepted?: string[];
  /** Подсказка шага (со 2-й попытки). */
  hint?: string;
}

/** Конфигурация поддержки на L2. */
export interface SupportConfig {
  /** Собрать план: карточки-шаги в перемешанном виде. */
  planCards?: string[];
  /** Правильный порядок карточек (индексы planCards). */
  planOrder?: number[];
  /** Действия: ребёнок выбирает тип действия и записывает выражение. */
  actions?: {
    /** Варианты «что это за действие» (один верный). */
    kinds: string[];
    correctKind: number;
    /** Допустимые выражения (нормализуются: пробелы/регистр). */
    acceptedExpressions: string[];
    /** Ожидаемое значение выражения (авто-вычисление для сверки). */
    value?: number;
  }[];
  /** «Найди ошибку»: чужое решение с ошибкой в одном шаге. */
  findError?: { lines: string[]; wrongLine: number; acceptedFixes: string[] };
}

export interface OlympiadProblem {
  id: string;
  topicId: string;
  level: OlympiadLevel;
  order: number;
  title: string;
  statement: string;
  imageUrl?: string;
  /** Число действий (опора на L2). */
  actionsCount?: number;
  /** Эталонный ответ + допустимые формы. */
  expectedAnswer: string;
  acceptedAnswers: string[];
  /** Нарастающие подсказки (каскад провала). */
  hints: string[];
  /** L1: пошаговый мастер. */
  guidedSteps?: GuidedStep[];
  /** L2: конфигурация поддержки. */
  support?: SupportConfig;
  /** Алгебраический блок (если тема hasAlgebra). */
  algebra?: { formula: string; explanation: string };
  rewardStars: number;
}

// ─────────────────────────────────────────────────────────────
// Попытки и каскад провала
// ─────────────────────────────────────────────────────────────

export type OlympiadAttemptStatus =
  | "solving"
  | "solved" // в рамках 3 попыток
  | "failed" // 3 попытки исчерпаны → каскад
  | "pendingReview"; // L3: фото листочка у методиста

export interface OlympiadAttempt {
  id: string;
  childId: string;
  problemId: string;
  topicId: string;
  level: OlympiadLevel;
  status: OlympiadAttemptStatus;
  attempts: number;
  hintsUsed: number;
  /** мс от открытия до решения/провала */
  durationMs: number;
  /** L3: фото листочка. */
  worksheetUrl?: string;
  answerGiven?: string;
  startedAt: string;
  finishedAt?: string;
}

/**
 * Каскад провала: подсказки нарастают → альтернативная задача →
 * откат на уровень ниже → уведомление методисту (Telegram).
 */
export type FailEscalation = "hint" | "alternative" | "levelDown" | "notifyMethodist";

export function nextEscalation(failedInARow: number): FailEscalation {
  if (failedInARow <= 1) return "hint";
  if (failedInARow === 2) return "alternative";
  if (failedInARow === 3) return "levelDown";
  return "notifyMethodist";
}

/** Верный ответ? Нормализация: регистр, пробелы, запятая→точка. */
export function isAnswerAccepted(given: string, accepted: string[]): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(",", ".");
  return accepted.some((a) => norm(a) === norm(given));
}

/** Состояние узла карты для ребёнка. */
export function topicNodeState(
  topic: OlympiadTopic,
  progress: TopicProgress | undefined,
  masteredIds: Set<string>,
): TopicNodeState {
  if (progress?.mastered) return "mastered";
  const depsOk = topic.dependsOn.every((d) => masteredIds.has(d));
  if (!depsOk) return "locked";
  return progress && (progress.streak > 0 || Object.values(progress.solvedByLevel).some((n) => n > 0))
    ? "inProgress"
    : "open";
}
