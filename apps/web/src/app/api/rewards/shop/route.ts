import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { buyItem, toggleEquip } from "@/lib/rewards-repo";

/** POST /api/rewards/shop — { action: "buy"|"equip", itemId } */
export async function POST(req: Request) {
  let body: { action: string; itemId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const childId = await getCurrentChildId();

  if (body.action === "buy") {
    const res = await buyItem(childId, body.itemId);
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  }
  if (body.action === "equip") {
    const mascot = await toggleEquip(childId, body.itemId);
    return NextResponse.json({ ok: true, mascot });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
