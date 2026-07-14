import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getCurrentChildId, getSession } from "@/lib/session";
import { sendTelegram, sendReviewRequest, methodistChatId, parentChatId } from "@/lib/telegram";
import { SUBJECTS, type SubjectId, type StepStat } from "@/types/domain";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/attempts
 * Тело: { taskId, childId?, mode, isCorrect?, autonomyScore?, steps?: StepStat[] }
 *
 * Серверная логика целиком в RPC submit_task_attempt:
 * находит/создаёт сессию, сохраняет попытку, пересчитывает прогресс предмета,
 * пересчитывает Daily и при готовности выдаёт МышРутку.
 *
 * Telegram методисту: каждый впервые завершённый предмет («2/4») и итог дня.
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

  // taskId должен быть реальным UUID из БД (на моках сюда не попадаем)
  if (!body.taskId || !UUID_RE.test(body.taskId)) {
    return NextResponse.json({ ok: false, reason: "task-id-not-uuid" });
  }

  const { data: taskRow } = await sb
    .from("tasks")
    .select("subject,title")
    .eq("id", body.taskId)
    .maybeSingle();
  const subject = (taskRow?.subject ?? null) as SubjectId | null;

  // состояние ДО попытки: выдана ли МышРутка и был ли предмет уже завершён
  const today = new Date().toISOString().slice(0, 10);
  const { data: prevSession } = await sb
    .from("daily_sessions")
    .select("id, myshroutka_granted")
    .eq("child_id", childId)
    .eq("date", today)
    .maybeSingle();
  const wasGranted = !!prevSession?.myshroutka_granted;
  let subjWasDone = false;
  if (prevSession?.id && subject) {
    const { data: sp } = await sb
      .from("daily_subject_progress")
      .select("status")
      .eq("session_id", prevSession.id)
      .eq("subject", subject)
      .maybeSingle();
    subjWasDone = ["submitted", "successful", "perfect"].includes(sp?.status ?? "");
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

  const result = data as {
    ok?: boolean;
    attemptId?: string;
    subjectStatus?: string;
    myshroutkaGranted?: boolean;
  } | null;
  const attemptId = result?.attemptId;

  // фото листочка: дописываем URL в созданную попытку + сразу зовём методиста
  if (body.solutionUrl && attemptId) {
    await sb
      .from("daily_task_attempts")
      .update({ uploaded_solution_url: body.solutionUrl })
      .eq("id", attemptId);
    void sendReviewRequest({
      kind: "daily",
      attemptId,
      childName,
      title: taskRow?.title ?? "задание",
      photoUrl: body.solutionUrl,
    });
  }

  const grantedNow = !!result?.myshroutkaGranted && !wasGranted;

  // предмет завершён впервые → уведомление методисту «(2/4)»
  // (на последнем предмете вместо него уйдёт сводка о полном Daily)
  if (result?.subjectStatus === "submitted" && !subjWasDone && subject && !grantedNow) {
    try {
      const { data: sessNow } = await sb
        .from("daily_sessions")
        .select("id")
        .eq("child_id", childId)
        .eq("date", today)
        .maybeSingle();
      const { data: dayIdx } = await sb.rpc("child_day_index", { p_child: childId });
      const { data: cfgs } = await sb
        .from("daily_task_configs")
        .select("subject")
        .eq("active", true)
        .eq("day_index", (dayIdx as number) ?? 1);
      const totalSubjects = new Set((cfgs ?? []).map((r) => r.subject as string)).size || 4;
      let doneSubjects = 1;
      if (sessNow?.id) {
        const { data: rows } = await sb
          .from("daily_subject_progress")
          .select("status")
          .eq("session_id", sessNow.id);
        doneSubjects = (rows ?? []).filter((r) =>
          ["submitted", "successful", "perfect"].includes(r.status as string),
        ).length;
      }
      void sendTelegram(
        methodistChatId(),
        `📗 <b>${childName}</b> завершил(а) предмет «${SUBJECTS[subject].title}» ` +
          `(${doneSubjects}/${totalSubjects}).`,
      );
    } catch {
      // уведомление не должно ломать сохранение попытки
    }
  }

  // Daily завершён впервые за сегодня → сводка методисту + поздравление родителю
  if (grantedNow) {
    const { count: manualCount } = await sb
      .from("daily_task_attempts")
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .eq("status", "submitted")
      .eq("mode", "worksheet");
    void sendTelegram(
      methodistChatId(),
      `✅ <b>${childName}</b> завершил(а) весь Daily за сегодня!` +
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
