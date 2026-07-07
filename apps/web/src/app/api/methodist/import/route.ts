import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { parseCsvObjects } from "@/lib/csv";
import { topicById } from "@/lib/olympiad-bank";

/**
 * POST /api/methodist/import — CSV-импорт банка задач.
 * Тело: { type: "daily" | "olympiad", csv: string }
 *
 * Daily-колонки:    slug,subject,title,mode,prompt,est_minutes,steps_json
 *   steps_json — JSON-массив шагов TaskStep (kind, prompt, options, gaps, words…).
 * Олимпиада-колонки: topic,level,order,title,statement,answer,accepted_json,hints_json,
 *                    actions_count,guided_json,support_json,algebra_json,reward
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "methodist") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = getSupabase();
  if (!db) return NextResponse.json({ error: "supabase-not-configured" }, { status: 400 });

  let body: { type: string; csv: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const rows = parseCsvObjects(body.csv ?? "");
  if (!rows.length) return NextResponse.json({ error: "csv is empty" }, { status: 400 });

  const errors: string[] = [];
  let inserted = 0;

  if (body.type === "daily") {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.slug || !r.subject || !r.title) throw new Error("нужны slug, subject, title");
        const { data: task, error } = await db
          .from("tasks")
          .upsert(
            {
              slug: r.slug,
              subject: r.subject,
              title: r.title,
              mode: r.mode === "worksheet" ? "worksheet" : "platform",
              prompt: r.prompt ?? "",
              est_minutes: r.est_minutes ? Number(r.est_minutes) : null,
            },
            { onConflict: "slug" },
          )
          .select("id")
          .single();
        if (error || !task) throw new Error(error?.message ?? "insert failed");

        if (r.steps_json) {
          const steps = JSON.parse(r.steps_json) as Record<string, unknown>[];
          await db.from("task_steps").delete().eq("task_id", task.id);
          const { error: se } = await db.from("task_steps").insert(
            steps.map((st, ord) => {
              const { kind, prompt, passage, hint, options, correctInput, ...rest } = st;
              return {
                task_id: task.id,
                ord,
                kind: kind ?? "question",
                prompt: prompt ?? "",
                passage: passage ?? null,
                hint: hint ?? null,
                options: options ?? [],
                correct_input: correctInput ?? null,
                payload: rest,
              };
            }),
          );
          if (se) throw new Error(se.message);
        }
        inserted++;
      } catch (e) {
        errors.push(`строка ${i + 2}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } else if (body.type === "olympiad") {
    for (const [i, r] of rows.entries()) {
      try {
        if (!topicById(r.topic)) throw new Error(`неизвестная тема «${r.topic}»`);
        const level = Number(r.level);
        if (![1, 2, 3].includes(level)) throw new Error("level должен быть 1, 2 или 3");
        const { error } = await db.from("olympiad_problems").insert({
          topic_id: r.topic,
          level,
          ord: Number(r.order) || 100,
          title: r.title || "Задача",
          statement: r.statement || "",
          actions_count: r.actions_count ? Number(r.actions_count) : null,
          expected_answer: r.answer ?? "",
          accepted_answers: r.accepted_json ? JSON.parse(r.accepted_json) : [r.answer ?? ""],
          hints: r.hints_json ? JSON.parse(r.hints_json) : [],
          guided_steps: r.guided_json ? JSON.parse(r.guided_json) : null,
          support: r.support_json ? JSON.parse(r.support_json) : null,
          algebra: r.algebra_json ? JSON.parse(r.algebra_json) : null,
          reward_stars: Number(r.reward) || level * 10,
        });
        if (error) throw new Error(error.message);
        inserted++;
      } catch (e) {
        errors.push(`строка ${i + 2}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } else {
    return NextResponse.json({ error: "type должен быть daily или olympiad" }, { status: 400 });
  }

  return NextResponse.json({ ok: errors.length === 0, inserted, errors });
}
