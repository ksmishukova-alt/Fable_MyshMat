import { NextResponse } from "next/server";
import { loadProblemById } from "@/lib/olympiad-bank-db";
import { isAnswerAccepted } from "@/types/olympiad";

/**
 * POST /api/olympiad/check — серверная проверка одного действия ребёнка.
 * Тело: { problemId, kind, ... }:
 *  - kind:"step"      { stepId, optionId? , input? }        (L1)
 *  - kind:"plan"      { order: number[] }                   (L2)
 *  - kind:"action"    { index, kindIndex, expression }      (L2)
 *  - kind:"findError" { lineIndex, fix }                    (L2)
 *  - kind:"final"     { answer }                            (все уровни)
 * Ответ: { correct, explain?, hint? } (hint — подсказка шага для 2-й попытки).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const p = await loadProblemById(String(body.problemId ?? ""));
  if (!p) return NextResponse.json({ error: "unknown problem" }, { status: 404 });

  const norm = (s: unknown) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/,/g, ".")
      .replace(/[×·]/g, "*")
      .replace(/[:÷]/g, "/")
      .replace(/−/g, "-");

  switch (body.kind) {
    case "step": {
      const step = p.guidedSteps?.find((s) => s.id === body.stepId);
      if (!step) return NextResponse.json({ error: "unknown step" }, { status: 404 });
      let correct = false;
      if (step.options?.length) {
        correct = !!step.options.find((o) => o.id === body.optionId)?.isCorrect;
      } else {
        correct = (step.accepted ?? []).some((a) => norm(a) === norm(body.input));
      }
      return NextResponse.json({
        correct,
        explain: correct ? step.explain : undefined,
        hint: correct ? undefined : step.hint,
      });
    }
    case "plan": {
      const expected = p.support?.planOrder ?? [];
      const got = Array.isArray(body.order) ? (body.order as number[]) : [];
      const correct =
        expected.length > 0 &&
        got.length === expected.length &&
        expected.every((v, i) => got[i] === v);
      return NextResponse.json({ correct });
    }
    case "action": {
      const a = p.support?.actions?.[Number(body.index)];
      if (!a) return NextResponse.json({ error: "unknown action" }, { status: 404 });
      const kindOk = Number(body.kindIndex) === a.correctKind;
      const exprOk = a.acceptedExpressions.some((e) => norm(e) === norm(body.expression));
      return NextResponse.json({
        correct: kindOk && exprOk,
        kindOk,
        exprOk,
        value: kindOk && exprOk ? a.value : undefined,
      });
    }
    case "findError": {
      const fe = p.support?.findError;
      if (!fe) return NextResponse.json({ error: "no findError" }, { status: 404 });
      const lineOk = Number(body.lineIndex) === fe.wrongLine;
      const fixOk =
        !fe.acceptedFixes.length ||
        fe.acceptedFixes.some((f) => norm(body.fix).includes(norm(f)));
      return NextResponse.json({ correct: lineOk && fixOk, lineOk });
    }
    case "final": {
      const correct = isAnswerAccepted(String(body.answer ?? ""), p.acceptedAnswers);
      return NextResponse.json({ correct });
    }
    default:
      return NextResponse.json({ error: "unknown kind" }, { status: 400 });
  }
}
