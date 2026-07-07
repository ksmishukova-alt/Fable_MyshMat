import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { fetchHomeData } from "@/lib/data";
import { isMyshroutkaEarned, UNLOCK_ALL_FOR_TESTING } from "@/types/domain";
import { getChestState, openChest } from "@/lib/chest";

async function unlockedToday(childId: string): Promise<boolean> {
  const home = await fetchHomeData(childId);
  return UNLOCK_ALL_FOR_TESTING || isMyshroutkaEarned(home.session.subjects);
}

/** GET /api/chest — состояние сундука на сегодня. */
export async function GET() {
  const childId = await getCurrentChildId();
  const unlocked = await unlockedToday(childId);
  return NextResponse.json(await getChestState(childId, unlocked));
}

/** POST /api/chest — открыть сундук (раз в день). */
export async function POST() {
  const childId = await getCurrentChildId();
  const unlocked = await unlockedToday(childId);
  const result = await openChest(childId, unlocked);
  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
