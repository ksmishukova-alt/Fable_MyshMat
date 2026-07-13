import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getCurrentChildId, getSession } from "@/lib/session";
import { sendTelegram, sendReviewRequest, methodistChatId, parentChatId } from "@/lib/telegram";
import type { StepStat } from "@/types/domain";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/attempts
 * Тело: { taskId, childId?, mode, isCorrect?, autonomyScore?, steps?: StepStat[] }
 *
 * Серверная логика целиком в RPC submit_task_attempt:
 * находит/создаёт сессию, сохраняет попытку, пересчитывает прогресс предмета,
 * пересчитывает Daily и при готовности выдаёт МышРутку.
 *
 * Без Supabase → ok:false (фронт работает на моках, это нормально).
 */
export async function POST(req: Request) {
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ ok: false, reason: "supabase-not-configured" });
  }

  let body: {
    taskId: string;
    childId?: string;
    mode: "platform" | "worksheet";
    isCorrect?: boolean;
    autonomyScore?: number;
    steps?: StepStat[];
    solutionUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const childId =
    body.childId && UUID_RE.test(body.childId)
      ? body.childId
      : await getCurrentChildId();
  const session = await getSession();
  const childName = session?.name ?? "Ученик";

  // была ли МышРутка уже выдана сегодня (чтобы не дублировать уведомление)
  const today = new Date().toISOString().slice(0, 10);
  const { data: prevSession } = await sb
    .from("daily_sessions")
    .select("myshroutka_granted")
    .eq("child_id", childId)
    .eq("date", today)
    .maybeSingle();
  const wasGranted = !!prevSession?.myshroutka_granted;

  // taskId должен быть реальным UUID из БД (на моках сюда не попадаем)
  if (!body.taskId || !UUID_RE.test(body.taskId)) {
    return NextResponse.json({ ok: false, reason: "task-id-not-uuid" });
  }

  const { data, error } = await sb.rpc("submit_task_attempt", {
    p_child: childId,
    p_task: body.taskId,
    p_mode: body.mode,
    p_is_correct: body.isCorrect ?? null,
    p_autonomy: body.autonomyScore ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  const result = data as { ok?: boolean; attemptId?: string } | null;
  const attemptId = result?.attemptId;

  // фото листочка: дописываем URL в созданную попытку + сразу зовём методиста
  if (body.solutionUrl && attemptId) {
    await sb
      .from("daily_task_attempts")
      .update({ uploaded_solution_url: body.solutionUrl })
      .eq("id", attemptId);
    const { data: t } = await sb.from("tasks").select("title").eq("id", body.taskId).maybeSingle();
    void sendReviewRequest({
      kind: "daily",
      attemptId,
      childName,
      title: t?.title ?? "задание",
      photoUrl: body.solutionUrl,
    });
  }

  // Daily завершён впервые за сегодня → сводка методисту + поздравление родителю
  const grantedNow = (data as { myshroutkaGranted?: boolean } | null)?.myshroutkaGranted;
  if (grantedNow && !wasGranted) {
    const { count: manualCount } = await sb
      .from("daily_task_attempts")
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .eq("status", "submitted")
      .eq("mode", "worksheet");
    void sendTelegram(
      methodistChatId(),
      `✅ <b>${childName}</b> завершил(а) Daily за сегодня!` +
        (manualCount
          ? ` Ручных работ на проверку: <b>${manualCount}</b>.`
          : " Все задания проверены автоматически."),
    );
    void sendTelegram(
      parentChatId(),
      `🎉 ${childName} сегодня выполнил(а) весь Daily — отличная работа! МышРутка уже везёт в олимпиадный мир.`,
    );
  }

  // пошаговая аналитика — только если step_id настоящие UUID (иначе пропускаем,
  // чтобы не падать на FK; на реальном контенте step.id приходит из БД)
  if (attemptId && body.steps?.length) {
    const realSteps = body.steps.filter((s) => UUID_RE.test(s.stepId));
    if (realSteps.length) {
      await sb.from("task_step_stats").insert(
        realSteps.map((s) => ({
          attempt_id: attemptId,
          step_id: s.stepId,
          attempts: s.attempts,
          hint_used: s.hintUsed,
          solved_first_try: s.solvedFirstTry,
          skipped_with_error: s.skippedWithError,
        }))
      );
    }
  }

  return NextResponse.json(data ?? { ok: true });
}
