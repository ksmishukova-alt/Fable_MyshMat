import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { buyStickerPack } from "@/lib/rewards-repo";

/** POST /api/rewards/shop — { action: "pack" }: покупка пакетика наклеек. */
export async function POST(req: Request) {
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const childId = await getCurrentChildId();
  if (body.action === "pack") {
    const res = await buyStickerPack(childId);
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
