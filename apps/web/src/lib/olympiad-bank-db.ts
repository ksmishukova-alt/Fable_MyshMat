/**
 * МышМат — гибридный доступ к банку олимпиадных задач:
 * демо-банк из TS (olympiad-bank.ts) + задачи из БД (olympiad_problems, CSV-импорт).
 * Все раннеры/проверки ходят через эти async-функции.
 */
import { getSupabase } from "@/lib/supabase";
import { problemsFor as tsProblemsFor, problemById as tsProblemById } from "@/lib/olympiad-bank";
import type { OlympiadProblem, OlympiadLevel } from "@/types/olympiad";

interface DbRow {
  id: string;
  topic_id: string;
  level: number;
  ord: number;
  title: string;
  statement: string;
  image_url: string | null;
  actions_count: number | null;
  expected_answer: string;
  accepted_answers: string[] | null;
  hints: string[] | null;
  guided_steps: OlympiadProblem["guidedSteps"] | null;
  support: OlympiadProblem["support"] | null;
  algebra: OlympiadProblem["algebra"] | null;
  reward_stars: number;
}

function fromRow(r: DbRow): OlympiadProblem {
  return {
    id: r.id,
    topicId: r.topic_id,
    level: r.level as OlympiadLevel,
    order: r.ord,
    title: r.title,
    statement: r.statement,
    imageUrl: r.image_url ?? undefined,
    actionsCount: r.actions_count ?? undefined,
    expectedAnswer: r.expected_answer,
    acceptedAnswers: r.accepted_answers?.length ? r.accepted_answers : [r.expected_answer],
    hints: r.hints ?? [],
    guidedSteps: r.guided_steps ?? undefined,
    support: r.support ?? undefined,
    algebra: r.algebra ?? undefined,
    rewardStars: r.reward_stars,
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Задачи темы и уровня: демо (TS) + импортированные (БД), по order. */
export async function loadProblemsFor(
  topicId: string,
  level: OlympiadLevel,
): Promise<OlympiadProblem[]> {
  const ts = tsProblemsFor(topicId, level);
  const db = getSupabase();
  if (!db) return ts;
  const { data } = await db
    .from("olympiad_problems")
    .select("*")
    .eq("topic_id", topicId)
    .eq("level", level)
    .eq("active", true)
    .order("ord");
  const dbProblems = ((data ?? []) as DbRow[]).map(fromRow);
  return [...ts, ...dbProblems].sort((a, b) => a.order - b.order);
}

/** Задача по id: UUID → БД, иначе — TS-банк. */
export async function loadProblemById(id: string): Promise<OlympiadProblem | null> {
  if (!UUID_RE.test(id)) return tsProblemById(id) ?? null;
  const db = getSupabase();
  if (!db) return null;
  const { data } = await db.from("olympiad_problems").select("*").eq("id", id).maybeSingle();
  return data ? fromRow(data as DbRow) : null;
}
