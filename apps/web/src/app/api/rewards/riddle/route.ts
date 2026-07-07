import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { solveRiddle } from "@/lib/rewards-repo";
import { todayISO } from "@/lib/chest";

/** POST /api/rewards/riddle — { answer } → загадка дня. */
export async function POST(req: Request) {
  let body: { answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const childId = await getCurrentChildId();
  const res = await solveRiddle(childId, todayISO(), body.answer ?? "");
  return NextResponse.json(res);
}
