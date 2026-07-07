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
// Лавка и маскот-тамагочи
// ─────────────────────────────────────────────────────────────

export type ShopItemKind = "outfit" | "accessory" | "room" | "stickerPack";

export interface ShopItem {
  id: string;
  kind: ShopItemKind;
  title: string;
  priceStars: number;
  /** id SVG-слоя, который реально меняет маскота/комнату. */
  art: string;
  description: string;
}

/** Состояние маскота: растёт по мере ОЛИМПИАДНОГО маршрута (не Daily). */
export interface MascotState {
  childId: string;
  /** Ступень роста 1..5 — от освоенных тем. */
  growthStage: number;
  /** Надетые предметы (id ShopItem). */
  equipped: string[];
  /** Купленные предметы. */
  owned: string[];
}

export function mascotStage(masteredTopics: number): number {
  if (masteredTopics >= 8) return 5;
  if (masteredTopics >= 5) return 4;
  if (masteredTopics >= 3) return 3;
  if (masteredTopics >= 1) return 2;
  return 1;
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
