import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { starsBalance, getMascot, getBadges, SHOP_ITEMS, riddleOfDay, isRiddleSolved } from "@/lib/rewards-repo";
import { mockOwnedStickers, todayISO } from "@/lib/chest";
import { STICKER_CATALOG } from "@/lib/stickers-catalog";

/** GET /api/rewards — сводка: звёзды, маскот, значки, лавка, наклейки, загадка дня. */
export async function GET() {
  const childId = await getCurrentChildId();
  const date = todayISO();
  const db = getSupabase();

  let owned: string[];
  if (db) {
    const { data } = await db
      .from("sticker_ownership")
      .select("sticker_id")
      .eq("child_id", childId);
    owned = (data ?? []).map((r) => r.sticker_id as string);
  } else {
    owned = mockOwnedStickers(childId);
  }

  const riddle = riddleOfDay(date);
  return NextResponse.json({
    stars: await starsBalance(childId),
    mascot: await getMascot(childId),
    badges: await getBadges(childId),
    shop: SHOP_ITEMS,
    stickers: { catalog: STICKER_CATALOG, owned },
    riddle: {
      question: riddle.question,
      hint: riddle.hint,
      rewardStars: riddle.rewardStars,
      solved: await isRiddleSolved(childId, date),
    },
  });
}
