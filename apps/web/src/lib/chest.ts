/**
 * МышМат — ежедневный сундук. Ключ — МышРутка (все предметы Daily submitted).
 * Приз: наклейка / звёзды / бонус. Один сундук в день.
 */
import { getSupabase } from "@/lib/supabase";
import type { ChestPrize, ChestState } from "@/types/rewards";
import { STICKER_CATALOG, stickerById } from "@/lib/stickers-catalog";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Розыгрыш приза: 55% звёзды, 35% наклейка, 10% бонус. */
export function rollPrize(ownedStickers: string[]): ChestPrize {
  const r = Math.random();
  if (r < 0.55) {
    const amount = 5 + Math.floor(Math.random() * 11); // 5..15
    return { kind: "stars", amount, label: `+${amount} звёзд` };
  }
  if (r < 0.9) {
    const left = STICKER_CATALOG.filter((s) => !ownedStickers.includes(s.id));
    if (left.length > 0) {
      const pick = left[Math.floor(Math.random() * left.length)];
      return { kind: "sticker", stickerId: pick.id, label: `Наклейка «${pick.title}»` };
    }
    return { kind: "stars", amount: 12, label: "+12 звёзд" };
  }
  return { kind: "bonus", bonusId: "skip-daily", label: "Пропуск одного Daily" };
}

// ── Мок-хранилище (без БД): живёт в памяти процесса ──
const mockOpens = new Map<string, ChestPrize>(); // key: childId|date
const mockStickers = new Map<string, string[]>(); // childId -> stickerIds
const mockStars = new Map<string, number>();

export function mockOwnedStickers(childId: string): string[] {
  return mockStickers.get(childId) ?? [];
}
export function mockGrantSticker(childId: string, stickerId: string): void {
  const owned = mockStickers.get(childId) ?? [];
  if (!owned.includes(stickerId)) mockStickers.set(childId, [...owned, stickerId]);
}
export function mockStarsBalance(childId: string): number {
  return mockStars.get(childId) ?? 245;
}
export function mockAddStars(childId: string, delta: number): void {
  mockStars.set(childId, mockStarsBalance(childId) + delta);
}
export function mockSpendStars(childId: string, amount: number): void {
  mockStars.set(childId, Math.max(0, mockStarsBalance(childId) - amount));
}

/** Состояние сундука на сегодня. */
export async function getChestState(childId: string, unlocked: boolean): Promise<ChestState> {
  const date = todayISO();
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("chest_opens")
      .select("prize")
      .eq("child_id", childId)
      .eq("date", date)
      .maybeSingle();
    return {
      childId,
      date,
      unlocked,
      opened: !!data,
      prize: (data?.prize as ChestPrize) ?? undefined,
    };
  }
  const prize = mockOpens.get(`${childId}|${date}`);
  return { childId, date, unlocked, opened: !!prize, prize };
}

/** Открыть сундук (идемпотентно: повторный вызов вернёт тот же приз). */
export async function openChest(
  childId: string,
  unlocked: boolean,
): Promise<{ ok: boolean; prize?: ChestPrize; reason?: string }> {
  if (!unlocked) return { ok: false, reason: "locked" };
  const date = todayISO();
  const db = getSupabase();

  if (db) {
    const existing = await db
      .from("chest_opens")
      .select("prize")
      .eq("child_id", childId)
      .eq("date", date)
      .maybeSingle();
    if (existing.data) return { ok: true, prize: existing.data.prize as ChestPrize };

    const owned = await db
      .from("sticker_ownership")
      .select("sticker_id")
      .eq("child_id", childId);
    const prize = rollPrize((owned.data ?? []).map((r) => r.sticker_id as string));

    const ins = await db.from("chest_opens").insert({ child_id: childId, date, prize });
    if (ins.error) return { ok: false, reason: ins.error.message };

    if (prize.kind === "stars" && prize.amount) {
      await db.rpc("add_stars", { p_child: childId, p_delta: prize.amount, p_reason: "chest" });
    }
    if (prize.kind === "sticker" && prize.stickerId) {
      await db
        .from("sticker_ownership")
        .upsert({ child_id: childId, sticker_id: prize.stickerId });
    }
    return { ok: true, prize };
  }

  // мок-режим
  const key = `${childId}|${date}`;
  const already = mockOpens.get(key);
  if (already) return { ok: true, prize: already };
  const owned = mockStickers.get(childId) ?? [];
  const prize = rollPrize(owned);
  mockOpens.set(key, prize);
  if (prize.kind === "stars" && prize.amount) {
    mockStars.set(childId, mockStarsBalance(childId) + prize.amount);
  }
  if (prize.kind === "sticker" && prize.stickerId) {
    mockStickers.set(childId, [...owned, prize.stickerId]);
  }
  return { ok: true, prize };
}

export function prizeGlyph(prize: ChestPrize): string {
  if (prize.kind === "stars") return "⭐";
  if (prize.kind === "bonus") return "🎟️";
  return stickerById(prize.stickerId ?? "") ? "🎴" : "🎁";
}
