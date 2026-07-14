/**
 * МышМат — награды, лавка, тамагочи, наклейки, значки, загадка дня.
 * Звёзды — валюта (тратятся). Сундук — ежедневный, ключ = МышРутка.
 */

export interface StarsWallet {
  childId: string;
  balance: number;
  earnedTotal: number;
}

// ─────────────────────────────────────────────────────────────
// Сундук
// ─────────────────────────────────────────────────────────────

export type ChestPrizeKind = "sticker" | "stars" | "bonus";

export interface ChestPrize {
  kind: ChestPrizeKind;
  /** stars: количество; sticker: id наклейки; bonus: id бонуса. */
  amount?: number;
  stickerId?: string;
  bonusId?: string; // напр. "skip-daily"
  label: string;
}

export interface ChestState {
  childId: string;
  date: string; // ISO-день
  /** Ключ получен (МышРутка за сегодня). */
  unlocked: boolean;
  /** Уже открыт сегодня. */
  opened: boolean;
  prize?: ChestPrize;
}

// ─────────────────────────────────────────────────────────────
// Наклейки и значки
// ─────────────────────────────────────────────────────────────

export interface Sticker {
  id: string;
  title: string;
  /** SVG-арт: id спрайта из коллекции. */
  art: string;
  /** Серия альбома («Космос», «Мышиный город»…). */
  series: string;
  rarity: "common" | "rare" | "epic";
}

export interface StickerOwnership {
  childId: string;
  stickerId: string;
  obtainedAt: string;
}

/** Значок за освоенную тему — элемент карты мышления. */
export interface TopicBadge {
  topicId: string;
  title: string;
  art: string;
  earnedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// Загадка дня
// ─────────────────────────────────────────────────────────────

export interface DailyRiddle {
  id: string;
  date: string;
  question: string;
  acceptedAnswers: string[];
  hint: string;
  rewardStars: number;
}
