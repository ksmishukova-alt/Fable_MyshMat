/**
 * МышМат — дуэли: мини-игры на скорость мышления + таблица лидеров.
 * Соревновательность БЕЗ рейтинга по учёбе.
 */

export type DuelGameId = "mental-math" | "patterns" | "quick-logic";

export interface DuelGame {
  id: DuelGameId;
  title: string;
  description: string;
  glyph: string;
  /** Длительность раунда, сек. */
  roundSeconds: number;
}

export const DUEL_GAMES: Record<DuelGameId, DuelGame> = {
  "mental-math": {
    id: "mental-math",
    title: "Устный счёт",
    description: "Реши как можно больше примеров за минуту",
    glyph: "⚡",
    roundSeconds: 60,
  },
  patterns: {
    id: "patterns",
    title: "Закономерности",
    description: "Продолжи последовательность, найди лишнее",
    glyph: "🔮",
    roundSeconds: 90,
  },
  "quick-logic": {
    id: "quick-logic",
    title: "Быстрая логика",
    description: "Верно или неверно? Решай за секунды!",
    glyph: "🎯",
    roundSeconds: 60,
  },
};

export interface DuelResult {
  id: string;
  childId: string;
  gameId: DuelGameId;
  score: number;
  correct: number;
  wrong: number;
  playedAt: string;
}

export interface LeaderboardRow {
  childId: string;
  childName: string;
  bestScore: number;
  gamesPlayed: number;
  rank: number;
}
