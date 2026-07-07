import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { saveDuelResult, leaderboard } from "@/lib/duels-repo";
import { DUEL_GAMES, type DuelGameId } from "@/types/duels";

/** GET /api/duels?game=mental-math — таблица лидеров. */
export async function GET(req: Request) {
  const game = new URL(req.url).searchParams.get("game") as DuelGameId | null;
  if (!game || !DUEL_GAMES[game]) {
    return NextResponse.json({ error: "unknown game" }, { status: 400 });
  }
  return NextResponse.json({ leaderboard: await leaderboard(game) });
}

/** POST /api/duels — { gameId, score, correct, wrong } */
export async function POST(req: Request) {
  let body: { gameId: DuelGameId; score: number; correct: number; wrong: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!DUEL_GAMES[body.gameId]) {
    return NextResponse.json({ error: "unknown game" }, { status: 400 });
  }
  const childId = await getCurrentChildId();
  await saveDuelResult({
    childId,
    gameId: body.gameId,
    score: Math.max(0, Math.min(9999, Number(body.score) || 0)),
    correct: Math.max(0, Number(body.correct) || 0),
    wrong: Math.max(0, Number(body.wrong) || 0),
  });
  return NextResponse.json({ ok: true, leaderboard: await leaderboard(body.gameId) });
}
