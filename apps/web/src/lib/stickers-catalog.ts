import type { Sticker } from "@/types/rewards";

/**
 * Коллекция «Команда МышМат» — карточки персонажей в духе футбольных
 * альбомов (Panini): 3 команды по 8 героев. Портрет — DiceBear (open source),
 * рендер через components/StickerCard.tsx.
 */
export interface CatalogSticker extends Sticker {
  /** стиль DiceBear для портрета */
  look: string;
  /** seed портрета */
  seed: string;
  /** фирменный цвет команды */
  color: string;
  /** пастельный фон карточки */
  cardBg: string;
  /** «статистика» героя на плашке */
  fact: string;
}

const MAT = { series: "Матемышата", look: "adventurer", color: "#e86a00", cardBg: "#ffe9d1" };
const SLO = { series: "Словогрызы", look: "big-smile", color: "#1f9d4d", cardBg: "#dff5e4" };
const ENG = { series: "Инглиш Старз", look: "fun-emoji", color: "#2e77e6", cardBg: "#dcecff" };

export const STICKER_CATALOG: CatalogSticker[] = [
  // ── Команда «Матемышата» ──
  { id: "mat-plus", title: "Капитан Плюс", seed: "kapitan-plus", fact: "9 лет · считает в уме до миллиона", rarity: "epic", art: "mat-plus", ...MAT },
  { id: "mat-chet", title: "Королева Чётность", seed: "koroleva-chet", fact: "8 лет · делит всё пополам", rarity: "rare", art: "mat-chet", ...MAT },
  { id: "mat-iks", title: "Икс Неизвестный", seed: "iks-tainstvennyi", fact: "возраст неизвестен · мастер загадок", rarity: "rare", art: "mat-iks", ...MAT },
  { id: "mat-minus", title: "Профессор Минус", seed: "prof-minus", fact: "10 лет · отнимает только лишнее", rarity: "common", art: "mat-minus", ...MAT },
  { id: "mat-drob", title: "Мадам Дробь", seed: "madame-drob", fact: "8½ лет · любит делиться", rarity: "common", art: "mat-drob", ...MAT },
  { id: "mat-cirkul", title: "Граф Циркуль", seed: "graf-cirkul", fact: "9 лет · рисует идеальные круги", rarity: "common", art: "mat-cirkul", ...MAT },
  { id: "mat-nol", title: "Малыш Ноль", seed: "malysh-nol", fact: "0 лет · без него никуда", rarity: "common", art: "mat-nol", ...MAT },
  { id: "mat-tablica", title: "Тётя Таблица", seed: "tetya-tablica", fact: "7×8 лет · знает все умножения", rarity: "common", art: "mat-tablica", ...MAT },
  // ── Команда «Словогрызы» ──
  { id: "slo-zapyataya", title: "Мисс Запятая", seed: "miss-zapyataya", fact: "8 лет · ставит паузы точно в цель", rarity: "epic", art: "slo-zapyataya", ...SLO },
  { id: "slo-glagol", title: "Дядя Глагол", seed: "dyadya-glagol", fact: "11 лет · человек действия", rarity: "rare", art: "slo-glagol", ...SLO },
  { id: "slo-chitaika", title: "Читайка Быстрая", seed: "chitaika", fact: "9 лет · 120 слов в минуту", rarity: "rare", art: "slo-chitaika", ...SLO },
  { id: "slo-bukvoed", title: "Буквоед Гоша", seed: "bukvoed-gosha", fact: "8 лет · съел все словари", rarity: "common", art: "slo-bukvoed", ...SLO },
  { id: "slo-suffiks", title: "Шёпот Суффикс", seed: "shepot-suffiks", fact: "7 лет · прячется в конце слова", rarity: "common", art: "slo-suffiks", ...SLO },
  { id: "slo-diktant", title: "Пан Диктант", seed: "pan-diktant", fact: "10 лет · пишет без единой ошибки", rarity: "common", art: "slo-diktant", ...SLO },
  { id: "slo-udarenie", title: "Ася Ударение", seed: "asya-udarenie", fact: "8 лет · всегда попадает в слог", rarity: "common", art: "slo-udarenie", ...SLO },
  { id: "slo-tochka", title: "Точка-Непоседа", seed: "tochka-neposeda", fact: "6 лет · завершает любое дело", rarity: "common", art: "slo-tochka", ...SLO },
  // ── Команда «Инглиш Старз» ──
  { id: "eng-cheese", title: "Mister Cheese", seed: "mister-cheese", fact: "9 y.o. · says «yes» to everything", rarity: "epic", art: "eng-cheese", ...ENG },
  { id: "eng-hello", title: "Captain Hello", seed: "captain-hello", fact: "8 y.o. · знает 100 приветствий", rarity: "rare", art: "eng-hello", ...ENG },
  { id: "eng-apple", title: "Lady Apple", seed: "lady-apple", fact: "7 y.o. · A — значит Apple", rarity: "rare", art: "eng-apple", ...ENG },
  { id: "eng-sunny", title: "Sunny Mouse", seed: "sunny-mouse", fact: "8 y.o. · улыбается по-английски", rarity: "common", art: "eng-sunny", ...ENG },
  { id: "eng-bobby", title: "Bobby Book", seed: "bobby-book", fact: "9 y.o. · читает даже во сне", rarity: "common", art: "eng-bobby", ...ENG },
  { id: "eng-molly", title: "Molly Moon", seed: "molly-moon", fact: "8 y.o. · мечтает на двух языках", rarity: "common", art: "eng-molly", ...ENG },
  { id: "eng-danny", title: "Danny Dog", seed: "danny-dog", fact: "7 y.o. · верный друг словаря", rarity: "common", art: "eng-danny", ...ENG },
  { id: "eng-tiny", title: "Tiny Tail", seed: "tiny-tail", fact: "6 y.o. · самый маленький чемпион", rarity: "common", art: "eng-tiny", ...ENG },
];

export const STICKERS_TOTAL = STICKER_CATALOG.length;

export function stickerById(id: string): CatalogSticker | undefined {
  return STICKER_CATALOG.find((s) => s.id === id);
}

/** Номер карточки внутри её команды (1..8) — печатается на карточке. */
export function stickerNumber(id: string): number {
  const s = stickerById(id);
  if (!s) return 0;
  return STICKER_CATALOG.filter((x) => x.series === s.series).findIndex((x) => x.id === id) + 1;
}
