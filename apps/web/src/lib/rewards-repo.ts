/**
 * МышМат — награды: кошелёк, киоск наклеек (пакетики), загадка дня, значки.
 * Звёзды тратятся на пакетики карточек «Команда МышМат» (3 случайные за пакетик).
 */
import { getSupabase } from "@/lib/supabase";
import type { DailyRiddle } from "@/types/rewards";
import { mockStarsBalance, mockOwnedStickers, mockGrantSticker, mockSpendStars } from "@/lib/chest";
import { getTopicNodes } from "@/lib/olympiad-repo";
import { TOPICS } from "@/lib/olympiad-bank";
import { STICKER_CATALOG, type CatalogSticker } from "@/lib/stickers-catalog";

// ─────────────────────────────────────────────
// Кошелёк
// ─────────────────────────────────────────────
export async function starsBalance(childId: string): Promise<number> {
  const db = getSupabase();
  if (db) {
    const { data } = await db.from("child_profiles").select("stars").eq("id", childId).single();
    return data?.stars ?? 0;
  }
  return mockStarsBalance(childId);
}

// ─────────────────────────────────────────────
// Киоск наклеек: пакетик из 3 случайных карточек
// ─────────────────────────────────────────────
export const PACK_PRICE = 25;
export const PACK_SIZE = 3;

const RARITY_WEIGHT: Record<CatalogSticker["rarity"], number> = {
  common: 70,
  rare: 25,
  epic: 5,
};

export async function ownedStickerIds(childId: string): Promise<string[]> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("sticker_ownership")
      .select("sticker_id")
      .eq("child_id", childId);
    return (data ?? []).map((r) => r.sticker_id as string);
  }
  return mockOwnedStickers(childId);
}

function pullWeighted(pool: CatalogSticker[]): CatalogSticker {
  const total = pool.reduce((acc, s) => acc + RARITY_WEIGHT[s.rarity], 0);
  let r = Math.random() * total;
  for (const s of pool) {
    r -= RARITY_WEIGHT[s.rarity];
    if (r <= 0) return s;
  }
  return pool[pool.length - 1];
}

export interface PackResult {
  ok: boolean;
  reason?: string;
  stickers?: string[];
  balance?: number;
}

/** Покупка пакетика: списывает звёзды, выдаёт до 3 недостающих карточек. */
export async function buyStickerPack(childId: string): Promise<PackResult> {
  const owned = await ownedStickerIds(childId);
  const missing = STICKER_CATALOG.filter((s) => !owned.includes(s.id));
  if (missing.length === 0) return { ok: false, reason: "collection-complete" };

  const balance = await starsBalance(childId);
  if (balance < PACK_PRICE) return { ok: false, reason: "not-enough-stars" };

  const pool = [...missing];
  const pulls: string[] = [];
  for (let i = 0; i < PACK_SIZE && pool.length > 0; i++) {
    const pick = pullWeighted(pool);
    pulls.push(pick.id);
    pool.splice(pool.indexOf(pick), 1);
  }

  const db = getSupabase();
  if (db) {
    await db.rpc("add_stars", {
      p_child: childId,
      p_delta: -PACK_PRICE,
      p_reason: "sticker-pack",
      p_ref: pulls.join(","),
    });
    await db
      .from("sticker_ownership")
      .upsert(pulls.map((id) => ({ child_id: childId, sticker_id: id })));
  } else {
    mockSpendStars(childId, PACK_PRICE);
    for (const id of pulls) mockGrantSticker(childId, id);
  }
  return { ok: true, stickers: pulls, balance: balance - PACK_PRICE };
}

// ─────────────────────────────────────────────
// Значки за темы (карта мышления)
// ─────────────────────────────────────────────
export type BadgeTier = "none" | "bronze" | "silver" | "gold";

export async function getBadges(childId: string) {
  const nodes = await getTopicNodes(childId);
  return TOPICS.map((t) => {
    const n = nodes.find((x) => x.topicId === t.id);
    // золото — тема освоена; серебро — дошёл до L3; бронза — дошёл до L2
    const tier: BadgeTier = n?.mastered
      ? "gold"
      : (n?.level ?? 1) >= 3
        ? "silver"
        : (n?.level ?? 1) >= 2
          ? "bronze"
          : "none";
    return {
      topicId: t.id,
      title: t.title,
      glyph: t.glyph,
      color: t.color,
      earned: n?.mastered ?? false,
      tier,
    };
  });
}

// ─────────────────────────────────────────────
// Загадка дня (детерминированная по дате из пула)
// ─────────────────────────────────────────────
const RIDDLES: Omit<DailyRiddle, "id" | "date">[] = [
  { question: "У Миши 3 пары носков. Сколько носков у Миши?", acceptedAnswers: ["6", "шесть"], hint: "Пара — это два.", rewardStars: 5 },
  { question: "Что тяжелее: килограмм ваты или килограмм железа?", acceptedAnswers: ["одинаково", "равны", "ничего", "поровну"], hint: "Читай внимательно: кило-грамм!", rewardStars: 5 },
  { question: "Горело 7 свечей, 2 задули. Сколько свечей останется?", acceptedAnswers: ["2", "две"], hint: "Задутые не сгорят!", rewardStars: 5 },
  { question: "Пара лошадей пробежала 20 км. Сколько километров пробежала каждая?", acceptedAnswers: ["20", "двадцать"], hint: "Они бежали вместе.", rewardStars: 5 },
  { question: "На дереве сидели 5 ворон. Охотник выстрелил и попал в одну. Сколько ворон осталось на дереве?", acceptedAnswers: ["0", "ноль", "ни одной"], hint: "Что сделают остальные после выстрела?", rewardStars: 5 },
  { question: "Сколько месяцев в году имеют 28 дней?", acceptedAnswers: ["12", "все", "двенадцать"], hint: "В каждом месяце есть 28-е число!", rewardStars: 5 },
  { question: "Два отца и два сына съели 3 яблока, каждый по одному. Как так?", acceptedAnswers: ["дед отец и сын", "дед, отец и сын", "их трое", "3 человека", "три человека"], hint: "Кто-то из них сразу и отец, и сын.", rewardStars: 7 },
];

export function riddleOfDay(dateISO: string): DailyRiddle {
  const dayNum = Math.floor(new Date(dateISO + "T00:00:00Z").getTime() / 86400000);
  const r = RIDDLES[dayNum % RIDDLES.length];
  return { id: `riddle-${dateISO}`, date: dateISO, ...r };
}

const mockRiddleSolved = new Map<string, Set<string>>(); // childId -> dates

export async function isRiddleSolved(childId: string, dateISO: string): Promise<boolean> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("riddle_solves")
      .select("riddle_id")
      .eq("child_id", childId)
      .eq("riddle_id", await ensureRiddleRow(dateISO))
      .maybeSingle();
    return !!data;
  }
  return mockRiddleSolved.get(childId)?.has(dateISO) ?? false;
}

async function ensureRiddleRow(dateISO: string): Promise<string> {
  const db = getSupabase()!;
  const r = riddleOfDay(dateISO);
  const { data } = await db.from("daily_riddles").select("id").eq("date", dateISO).maybeSingle();
  if (data?.id) return data.id as string;
  const { data: ins } = await db
    .from("daily_riddles")
    .insert({
      date: dateISO,
      question: r.question,
      accepted_answers: r.acceptedAnswers,
      hint: r.hint,
      reward_stars: r.rewardStars,
    })
    .select("id")
    .single();
  return (ins?.id as string) ?? "";
}

export async function solveRiddle(
  childId: string,
  dateISO: string,
  answer: string,
): Promise<{ correct: boolean; stars?: number; already?: boolean }> {
  const r = riddleOfDay(dateISO);
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const correct = r.acceptedAnswers.some((a) => norm(a) === norm(answer));
  if (!correct) return { correct: false };

  const already = await isRiddleSolved(childId, dateISO);
  if (already) return { correct: true, already: true };

  const db = getSupabase();
  if (db) {
    const riddleId = await ensureRiddleRow(dateISO);
    await db.from("riddle_solves").insert({ child_id: childId, riddle_id: riddleId });
    await db.rpc("add_stars", {
      p_child: childId,
      p_delta: r.rewardStars,
      p_reason: "riddle",
      p_ref: dateISO,
    });
  } else {
    const set = mockRiddleSolved.get(childId) ?? new Set<string>();
    set.add(dateISO);
    mockRiddleSolved.set(childId, set);
    const { mockAddStars } = await import("@/lib/chest");
    mockAddStars(childId, r.rewardStars);
  }
  return { correct: true, stars: r.rewardStars };
}
