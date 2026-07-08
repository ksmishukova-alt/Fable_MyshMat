/**
 * МышМат — награды: кошелёк, лавка, маскот-тамагочи, загадка дня, значки.
 * Маскот растёт от ОЛИМПИАДНОГО маршрута (mastered-темы), не от Daily.
 */
import { getSupabase } from "@/lib/supabase";
import type { MascotState, ShopItem, DailyRiddle } from "@/types/rewards";
import { mascotStage } from "@/types/rewards";
import { mockStarsBalance, mockOwnedStickers } from "@/lib/chest";
import { getTopicNodes } from "@/lib/olympiad-repo";
import { TOPICS } from "@/lib/olympiad-bank";

// ─────────────────────────────────────────────
// Лавка (SVG-слои маскота — components/MascotView.tsx)
// ─────────────────────────────────────────────
export const SHOP_ITEMS: ShopItem[] = [
  { id: "cap-blue", kind: "outfit", title: "Кепка чемпиона", priceStars: 40, art: "cap-blue", description: "Синяя кепка для смелых идей" },
  { id: "scarf-orange", kind: "outfit", title: "Оранжевый шарф", priceStars: 30, art: "scarf-orange", description: "Тепло и стильно" },
  { id: "glasses", kind: "accessory", title: "Умные очки", priceStars: 50, art: "glasses", description: "Видно каждую закономерность" },
  { id: "crown", kind: "outfit", title: "Корона олимпиадника", priceStars: 120, art: "crown", description: "Для настоящих чемпионов" },
  { id: "cape-purple", kind: "outfit", title: "Плащ супергероя", priceStars: 80, art: "cape-purple", description: "Развевается от скорости мысли" },
  { id: "flag", kind: "accessory", title: "Флажок победы", priceStars: 25, art: "flag", description: "Отмечай каждую вершину" },
];

export function shopItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

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
// Маскот
// ─────────────────────────────────────────────
const mockMascot = new Map<string, MascotState>();

export async function getMascot(childId: string): Promise<MascotState> {
  const db = getSupabase();
  const masteredCount = (await getTopicNodes(childId)).filter((n) => n.mastered).length;
  const stage = mascotStage(masteredCount);
  if (db) {
    const { data } = await db.from("mascot_state").select("*").eq("child_id", childId).maybeSingle();
    return {
      childId,
      growthStage: stage,
      equipped: (data?.equipped as string[]) ?? [],
      owned: (data?.owned as string[]) ?? [],
    };
  }
  const m = mockMascot.get(childId);
  return { childId, growthStage: stage, equipped: m?.equipped ?? [], owned: m?.owned ?? [] };
}

export async function buyItem(
  childId: string,
  itemId: string,
): Promise<{ ok: boolean; reason?: string; balance?: number }> {
  const item = shopItemById(itemId);
  if (!item) return { ok: false, reason: "unknown item" };
  const mascot = await getMascot(childId);
  if (mascot.owned.includes(itemId)) return { ok: false, reason: "already owned" };
  const balance = await starsBalance(childId);
  if (balance < item.priceStars) return { ok: false, reason: "not enough stars" };

  const db = getSupabase();
  if (db) {
    await db.rpc("add_stars", {
      p_child: childId,
      p_delta: -item.priceStars,
      p_reason: "shop",
      p_ref: itemId,
    });
    await db.from("mascot_state").upsert({
      child_id: childId,
      owned: [...mascot.owned, itemId],
      equipped: [...mascot.equipped, itemId],
      updated_at: new Date().toISOString(),
    });
    return { ok: true, balance: balance - item.priceStars };
  }
  mockMascot.set(childId, {
    ...mascot,
    owned: [...mascot.owned, itemId],
    equipped: [...mascot.equipped, itemId],
  });
  // мок-звёзды хранятся в chest.ts — там же спишем
  const { mockSpendStars } = await import("@/lib/chest");
  mockSpendStars(childId, item.priceStars);
  return { ok: true, balance: balance - item.priceStars };
}

export async function toggleEquip(childId: string, itemId: string): Promise<MascotState> {
  const mascot = await getMascot(childId);
  if (!mascot.owned.includes(itemId)) return mascot;
  const equipped = mascot.equipped.includes(itemId)
    ? mascot.equipped.filter((x) => x !== itemId)
    : [...mascot.equipped, itemId];
  const db = getSupabase();
  if (db) {
    await db.from("mascot_state").upsert({
      child_id: childId,
      owned: mascot.owned,
      equipped,
      updated_at: new Date().toISOString(),
    });
  } else {
    mockMascot.set(childId, { ...mascot, equipped });
  }
  return { ...mascot, equipped };
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
