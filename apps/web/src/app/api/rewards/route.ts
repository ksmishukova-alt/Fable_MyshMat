import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import {
  starsBalance,
  getBadges,
  riddleOfDay,
  isRiddleSolved,
  ownedStickerIds,
  PACK_PRICE,
} from "@/lib/rewards-repo";
import { todayISO } from "@/lib/chest";
import { STICKER_CATALOG } from "@/lib/stickers-catalog";

/** GET /api/rewards — сводка: звёзды, значки, коллекция карточек, загадка дня. */
export async function GET() {
  const childId = await getCurrentChildId();
  const date = todayISO();
  const owned = await ownedStickerIds(childId);
  const riddle = riddleOfDay(date);
  return NextResponse.json({
    stars: await starsBalance(childId),
    badges: await getBadges(childId),
    stickers: { total: STICKER_CATALOG.length, owned, packPrice: PACK_PRICE },
    riddle: {
      question: riddle.question,
      hint: riddle.hint,
      rewardStars: riddle.rewardStars,
      solved: await isRiddleSolved(childId, date),
    },
  });
}
