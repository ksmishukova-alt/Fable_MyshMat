import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { WEEK1 } from "@/lib/week1-content";
import { WEEKS_2_10 } from "@/lib/weeks-content";
import type { TaskContent } from "@/types/domain";

/**
 * POST /api/admin/seed-daily — переносит контент Daily недель 1–10 из TS-файлов
 * в tasks/task_steps и строит daily_task_configs ПО УЧЕБНЫМ ДНЯМ:
 * n-й DayPlan предмета → day_index n (день ребёнка считается по расписанию).
 * Идемпотентно: задачи ищутся по slug, конфиги пересобираются целиком.
 */
export async function POST() {
  const session = await getSession();
  if (session?.role !== "methodist") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ error: "supabase-not-configured" }, { status: 400 });
  }

  const days = [...WEEK1, ...WEEKS_2_10];

  // 1) upsert задач и шагов (по slug)
  const { data: existing } = await sb.from("tasks").select("id, slug").not("slug", "is", null);
  const bySlug = new Map<string, string>((existing ?? []).map((r) => [r.slug as string, r.id as string]));

  let inserted = 0;
  for (const day of days) {
    for (const content of day.tasks) {
      const slug = content.id;
      if (bySlug.has(slug)) continue;
      const { data: task, error } = await sb
        .from("tasks")
        .insert({
          slug,
          subject: content.subjectId,
          title: content.title,
          mode: content.mode,
          prompt: content.prompt,
          est_minutes: content.estMinutes ?? null,
        })
        .select("id")
        .single();
      if (error || !task) {
        return NextResponse.json(
          { error: error?.message ?? "insert failed", at: slug, inserted },
          { status: 500 },
        );
      }
      bySlug.set(slug, task.id as string);
      if (content.steps?.length) {
        const rows = content.steps.map((s, i) => ({
          task_id: task.id,
          ord: i,
          kind: s.kind,
          prompt: s.prompt,
          passage: s.passage ?? null,
          hint: s.hint ?? null,
          options: s.options ?? [],
          correct_input: s.correctInput ?? null,
          payload: extraPayload(s),
        }));
        const { error: stepErr } = await sb.from("task_steps").insert(rows);
        if (stepErr) {
          return NextResponse.json({ error: stepErr.message, at: slug, inserted }, { status: 500 });
        }
      }
      inserted++;
    }
  }

  // 2) пересборка конфигов по учебным дням (для каждого предмета свой счётчик дней)
  const dayCounter: Record<string, number> = {};
  const configs: { subject: string; task_id: string; ord: number; day_index: number; active: boolean }[] = [];
  for (const day of days) {
    const idx = dayCounter[day.subject] ?? 0;
    dayCounter[day.subject] = idx + 1;
    day.tasks.forEach((t, ord) => {
      const id = bySlug.get(t.id);
      if (id) configs.push({ subject: day.subject, task_id: id, ord, day_index: idx, active: true });
    });
  }
  const del = await sb.from("daily_task_configs").delete().not("id", "is", null);
  if (del.error) {
    return NextResponse.json({ error: del.error.message, inserted }, { status: 500 });
  }
  for (let i = 0; i < configs.length; i += 500) {
    const { error } = await sb.from("daily_task_configs").insert(configs.slice(i, i + 500));
    if (error) {
      return NextResponse.json({ error: error.message, inserted }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    tasksTotal: bySlug.size,
    tasksInserted: inserted,
    configs: configs.length,
    daysPerSubject: dayCounter,
  });
}

/** Специфика раннеров: всё вне базовых колонок — в jsonb payload. */
function extraPayload(s: TaskContent["steps"] extends (infer T)[] | undefined ? T : never) {
  const {
    id: _id,
    kind: _kind,
    prompt: _prompt,
    passage: _passage,
    hint: _hint,
    options: _options,
    correctInput: _correctInput,
    ...rest
  } = s as unknown as Record<string, unknown> & { id: string };
  return rest;
}
