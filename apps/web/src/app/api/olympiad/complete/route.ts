import { NextResponse } from "next/server";
import { getSession, getCurrentChildId } from "@/lib/session";
import { completeProblem } from "@/lib/olympiad-repo";
import { loadProblemById } from "@/lib/olympiad-bank-db";

/**
 * POST /api/olympiad/complete — итог работы над задачей.
 * Тело: { problemId, solved, attempts, hintsUsed, durationMs, answerGiven?, worksheetUrl? }
 */
export async function POST(req: Request) {
  let body: {
    problemId: string;
    solved: boolean;
    attempts: number;
    hintsUsed: number;
    durationMs: number;
    answerGiven?: string;
    worksheetUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const p = await loadProblemById(body.problemId);
  if (!p) return NextResponse.json({ error: "unknown problem" }, { status: 404 });

  const session = await getSession();
  const childId = await getCurrentChildId();

  const result = await completeProblem({
    childId,
    childName: session?.name ?? "Ученик",
    problemId: p.id,
    topicId: p.topicId,
    level: p.level,
    solved: !!body.solved,
    attempts: Math.max(0, Number(body.attempts) || 0),
    hintsUsed: Math.max(0, Number(body.hintsUsed) || 0),
    durationMs: Math.max(0, Number(body.durationMs) || 0),
    answerGiven: body.answerGiven,
    worksheetUrl: body.worksheetUrl,
    rewardStars: p.rewardStars,
  });

  return NextResponse.json(result);
}
