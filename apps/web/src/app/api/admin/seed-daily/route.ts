import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { WEEK1 } from "@/lib/week1-content";
import { WEEKS_2_10 } from "@/lib/weeks-content";
import type { TaskContent } from "@/types/domain";

/**
 * POST /api/admin/seed-daily — переносит контент Daily недель 1–10 из TS-файлов
 * в таблицы tasks/task_steps/daily_task_configs. Только методист. Идемпотентно:
 * задание с тем же slug (метка в prompt-префиксе) не дублируется.
 *
 * Дальше банк пополняется через CSV-импорт в кабинете методиста.
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
  const all: { content: TaskContent; slug: string }[] = [];
  for (const day of days) {
    for (const t of day.tasks) {
      all.push({ content: t, slug: t.id });
    }
  }

  // уже загруженные слаги (slug храним в колонке tasks.slug)
  const { data: existing } = await sb.from("tasks").select("slug").not("slug", "is", null);
  const have = new Set((existing ?? []).map((r) => r.slug as string));

  let inserted = 0;
  for (const { content, slug } of all) {
    if (have.has(slug)) continue;
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
        return NextResponse.json(
          { error: stepErr.message, at: slug, inserted },
          { status: 500 },
        );
      }
    }
    inserted++;
  }

  return NextResponse.json({ ok: true, total: all.length, inserted });
}

/** Специфика раннеров (punctuation/order/gapinput/…): всё вне базовых колонок — в jsonb. */
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
