import type { Sticker } from "@/types/rewards";

/**
 * Каталог наклеек (3 серии). art — id SVG-спрайта (components/StickerArt.tsx),
 * glyph — резервный эмодзи, пока спрайт не нарисован.
 */
export interface CatalogSticker extends Sticker {
  glyph: string;
}

export const STICKER_CATALOG: CatalogSticker[] = [
  // Серия «Мышиный город»
  { id: "mouse-hoodie", title: "Мыш в толстовке", art: "mouse-hoodie", glyph: "🐭", series: "Мышиный город", rarity: "epic" },
  { id: "mouse-cheese", title: "Сырная награда", art: "mouse-cheese", glyph: "🧀", series: "Мышиный город", rarity: "common" },
  { id: "mouse-bus", title: "МышРутка", art: "mouse-bus", glyph: "🚌", series: "Мышиный город", rarity: "rare" },
  { id: "mouse-house", title: "Домик Мыша", art: "mouse-house", glyph: "🏠", series: "Мышиный город", rarity: "common" },
  { id: "mouse-lamp", title: "Лампа идей", art: "mouse-lamp", glyph: "💡", series: "Мышиный город", rarity: "common" },
  { id: "mouse-book", title: "Книга загадок", art: "mouse-book", glyph: "📕", series: "Мышиный город", rarity: "common" },
  { id: "mouse-cap", title: "Кепка чемпиона", art: "mouse-cap", glyph: "🧢", series: "Мышиный город", rarity: "rare" },
  { id: "mouse-medal", title: "Медаль Мыша", art: "mouse-medal", glyph: "🏅", series: "Мышиный город", rarity: "epic" },
  // Серия «Космос»
  { id: "space-rocket", title: "Ракета", art: "space-rocket", glyph: "🚀", series: "Космос", rarity: "common" },
  { id: "space-planet", title: "Планета колец", art: "space-planet", glyph: "🪐", series: "Космос", rarity: "common" },
  { id: "space-star", title: "Сверхновая", art: "space-star", glyph: "🌟", series: "Космос", rarity: "rare" },
  { id: "space-moon", title: "Лунная база", art: "space-moon", glyph: "🌙", series: "Космос", rarity: "common" },
  { id: "space-comet", title: "Комета", art: "space-comet", glyph: "☄️", series: "Космос", rarity: "rare" },
  { id: "space-alien", title: "Дружелюбный гость", art: "space-alien", glyph: "👽", series: "Космос", rarity: "epic" },
  { id: "space-telescope", title: "Телескоп", art: "space-telescope", glyph: "🔭", series: "Космос", rarity: "common" },
  { id: "space-suit", title: "Скафандр", art: "space-suit", glyph: "👨‍🚀", series: "Космос", rarity: "rare" },
  // Серия «Математика»
  { id: "math-pi", title: "Число π", art: "math-pi", glyph: "🥧", series: "Математика", rarity: "rare" },
  { id: "math-cube", title: "Куб", art: "math-cube", glyph: "🎲", series: "Математика", rarity: "common" },
  { id: "math-infinity", title: "Бесконечность", art: "math-infinity", glyph: "♾️", series: "Математика", rarity: "epic" },
  { id: "math-compass", title: "Циркуль", art: "math-compass", glyph: "📐", series: "Математика", rarity: "common" },
  { id: "math-abacus", title: "Счёты", art: "math-abacus", glyph: "🧮", series: "Математика", rarity: "common" },
  { id: "math-graph", title: "Граф-звезда", art: "math-graph", glyph: "✨", series: "Математика", rarity: "rare" },
  { id: "math-scale", title: "Весы логики", art: "math-scale", glyph: "⚖️", series: "Математика", rarity: "common" },
  { id: "math-key", title: "Ключ к задаче", art: "math-key", glyph: "🗝️", series: "Математика", rarity: "epic" },
];

export const STICKERS_TOTAL = STICKER_CATALOG.length;

export function stickerById(id: string): CatalogSticker | undefined {
  return STICKER_CATALOG.find((s) => s.id === id);
}
