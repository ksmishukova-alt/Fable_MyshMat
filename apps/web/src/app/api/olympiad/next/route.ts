import { NextResponse } from "next/server";
import { getCurrentChildId } from "@/lib/session";
import { getProgress, nextProblemId } from "@/lib/olympiad-repo";
import { topicById } from "@/lib/olympiad-bank";
import { loadProblemById } from "@/lib/olympiad-bank-db";
import type { OlympiadProblem } from "@/types/olympiad";

/**
 * GET /api/olympiad/next?topic=heads-legs[&alt=1]
 * Отдаёт следующую задачу БЕЗ ответов (проверка — на сервере).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const topicId = url.searchParams.get("topic") ?? "";
  const alt = url.searchParams.get("alt") === "1";
  const topic = topicById(topicId);
  if (!topic) return NextResponse.json({ error: "unknown topic" }, { status: 404 });

  const childId = await getCurrentChildId();
  const progress = await getProgress(childId, topicId);
  const pid = await nextProblemId(childId, topicId, alt);
  if (!pid) {
    return NextResponse.json({ done: true, progress });
  }
  const p = (await loadProblemById(pid))!;
  return NextResponse.json({ problem: sanitize(p), progress });
}

/** Убираем ответы/флаги правильности из задачи перед отправкой клиенту. */
function sanitize(p: OlympiadProblem) {
  return {
    id: p.id,
    topicId: p.topicId,
    level: p.level,
    title: p.title,
    statement: p.statement,
    imageUrl: p.imageUrl,
    actionsCount: p.actionsCount,
    hintsTotal: p.hints.length,
    rewardStars: p.rewardStars,
    guidedSteps: p.guidedSteps?.map((s) => ({
      id: s.id,
      prompt: s.prompt,
      options: s.options?.map((o) => ({ id: o.id, label: o.label })),
      freeInput: !s.options?.length,
    })),
    support: p.support
      ? {
          planCards: p.support.planCards,
          actions: p.support.actions?.map((a) => ({ kinds: a.kinds })),
          findError: p.support.findError ? { lines: p.support.findError.lines } : undefined,
        }
      : undefined,
    algebra: p.algebra,
  };
}

export type SanitizedProblem = ReturnType<typeof sanitize>;
