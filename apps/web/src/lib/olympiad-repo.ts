/**
 * МышМат — прогресс по олимпиадному миру.
 * Правила (§3 plan.md, модель 3 уровней):
 *  - 4 решённых подряд без ошибок → уровень выше;
 *  - или все задачи уровня решены → уровень выше;
 *  - L3 закрыт → тема mastered (значок);
 *  - провал: подсказки → альтернативная задача → откат уровня → TG методисту.
 */
import { getSupabase } from "@/lib/supabase";
import {
  STREAK_TO_LEVEL_UP,
  type OlympiadLevel,
  type TopicProgress,
  type TopicNodeState,
  topicNodeState,
} from "@/types/olympiad";
import { TOPICS } from "@/lib/olympiad-bank";
import { loadProblemsFor } from "@/lib/olympiad-bank-db";
import { sendTelegram, methodistChatId } from "@/lib/telegram";

export interface TopicNode {
  topicId: string;
  state: TopicNodeState;
  level: OlympiadLevel;
  solvedOnLevel: number;
  totalOnLevel: number;
  mastered: boolean;
}

function emptyProgress(childId: string, topicId: string): TopicProgress {
  return {
    childId,
    topicId,
    level: 1,
    solvedByLevel: { 1: 0, 2: 0, 3: 0 },
    streak: 0,
    mastered: false,
    algebraDone: false,
  };
}

// ── мок-хранилище ──
const mockProgress = new Map<string, TopicProgress>(); // childId|topicId
const mockSolved = new Map<string, Set<string>>(); // childId -> problemIds
const mockFails = new Map<string, number>(); // childId|topicId -> fails in row

function pKey(childId: string, topicId: string) {
  return `${childId}|${topicId}`;
}

export async function getProgress(childId: string, topicId: string): Promise<TopicProgress> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("topic_progress")
      .select("*")
      .eq("child_id", childId)
      .eq("topic_id", topicId)
      .maybeSingle();
    if (!data) return emptyProgress(childId, topicId);
    return {
      childId,
      topicId,
      level: data.level as OlympiadLevel,
      solvedByLevel: { 1: data.solved_l1, 2: data.solved_l2, 3: data.solved_l3 },
      streak: data.streak,
      mastered: data.mastered,
      algebraDone: data.algebra_done,
    };
  }
  return mockProgress.get(pKey(childId, topicId)) ?? emptyProgress(childId, topicId);
}

async function saveProgress(p: TopicProgress, failsInRow: number): Promise<void> {
  const db = getSupabase();
  if (db) {
    await db.from("topic_progress").upsert({
      child_id: p.childId,
      topic_id: p.topicId,
      level: p.level,
      solved_l1: p.solvedByLevel[1],
      solved_l2: p.solvedByLevel[2],
      solved_l3: p.solvedByLevel[3],
      streak: p.streak,
      fails_in_row: failsInRow,
      mastered: p.mastered,
      algebra_done: p.algebraDone,
      updated_at: new Date().toISOString(),
    });
    return;
  }
  mockProgress.set(pKey(p.childId, p.topicId), p);
  mockFails.set(pKey(p.childId, p.topicId), failsInRow);
}

export async function getSolvedSet(childId: string): Promise<Set<string>> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("olympiad_attempts")
      .select("problem_id")
      .eq("child_id", childId)
      .in("status", ["solved", "pendingReview"]);
    return new Set((data ?? []).map((r) => r.problem_id as string));
  }
  return mockSolved.get(childId) ?? new Set();
}

async function getFailsInRow(childId: string, topicId: string): Promise<number> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("topic_progress")
      .select("fails_in_row")
      .eq("child_id", childId)
      .eq("topic_id", topicId)
      .maybeSingle();
    return data?.fails_in_row ?? 0;
  }
  return mockFails.get(pKey(childId, topicId)) ?? 0;
}

/** Карта: все темы с состояниями узлов. */
export async function getTopicNodes(childId: string): Promise<TopicNode[]> {
  const nodes: TopicNode[] = [];
  const masteredIds = new Set<string>();
  const progresses = new Map<string, TopicProgress>();
  for (const t of TOPICS) {
    const p = await getProgress(childId, t.id);
    progresses.set(t.id, p);
    if (p.mastered) masteredIds.add(t.id);
  }
  for (const t of TOPICS) {
    const p = progresses.get(t.id)!;
    nodes.push({
      topicId: t.id,
      state: topicNodeState(t, p, masteredIds),
      level: p.level,
      solvedOnLevel: p.solvedByLevel[p.level],
      totalOnLevel: (await loadProblemsFor(t.id, p.level)).length,
      mastered: p.mastered,
    });
  }
  return nodes;
}

/** Следующая задача на текущем уровне (первая нерешённая; alt=true → следующая после неё). */
export async function nextProblemId(
  childId: string,
  topicId: string,
  alt = false,
): Promise<string | null> {
  const p = await getProgress(childId, topicId);
  const solved = await getSolvedSet(childId);
  const pool = (await loadProblemsFor(topicId, p.level)).filter((x) => !solved.has(x.id));
  if (pool.length === 0) return null;
  return (alt && pool.length > 1 ? pool[1] : pool[0]).id;
}

export interface CompleteResult {
  starsEarned: number;
  levelUp: boolean;
  levelDown: boolean;
  mastered: boolean;
  escalation: "none" | "alternative" | "levelDown" | "notified";
  newLevel: OlympiadLevel;
}

/** Итог работы над задачей (solved=false — исчерпаны 3 попытки). */
export async function completeProblem(args: {
  childId: string;
  childName: string;
  problemId: string;
  topicId: string;
  level: OlympiadLevel;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  durationMs: number;
  answerGiven?: string;
  worksheetUrl?: string;
  rewardStars: number;
}): Promise<CompleteResult> {
  const db = getSupabase();
  const p = await getProgress(args.childId, args.topicId);
  let fails = await getFailsInRow(args.childId, args.topicId);
  const res: CompleteResult = {
    starsEarned: 0,
    levelUp: false,
    levelDown: false,
    mastered: false,
    escalation: "none",
    newLevel: p.level,
  };

  // запись попытки
  const status = args.solved ? (args.level === 3 ? "pendingReview" : "solved") : "failed";
  if (db) {
    await db.from("olympiad_attempts").insert({
      child_id: args.childId,
      problem_id: args.problemId,
      topic_id: args.topicId,
      level: args.level,
      status,
      attempts: args.attempts,
      hints_used: args.hintsUsed,
      duration_ms: args.durationMs,
      worksheet_url: args.worksheetUrl ?? null,
      answer_given: args.answerGiven ?? null,
      finished_at: new Date().toISOString(),
    });
    await db.from("analytics_events").insert({
      child_id: args.childId,
      kind: args.solved ? "olympiad_solved" : "olympiad_failed",
      payload: {
        problemId: args.problemId,
        topicId: args.topicId,
        level: args.level,
        attempts: args.attempts,
        hintsUsed: args.hintsUsed,
        durationMs: args.durationMs,
      },
    });
  } else {
    if (args.solved) {
      const set = mockSolved.get(args.childId) ?? new Set<string>();
      set.add(args.problemId);
      mockSolved.set(args.childId, set);
    }
  }

  if (args.solved) {
    fails = 0;
    // чистое решение (без ошибок) = 1 попытка и без подсказок
    const clean = args.attempts <= 1 && args.hintsUsed === 0;
    p.streak = clean ? p.streak + 1 : 0;
    p.solvedByLevel[p.level] += 1;
    res.starsEarned = args.rewardStars;
    if (db) {
      await db.rpc("add_stars", {
        p_child: args.childId,
        p_delta: args.rewardStars,
        p_reason: "olympiad",
        p_ref: args.problemId,
      });
    }

    const levelDone =
      p.solvedByLevel[p.level] >= (await loadProblemsFor(args.topicId, p.level)).length;
    if (p.streak >= STREAK_TO_LEVEL_UP || levelDone) {
      if (p.level < 3) {
        p.level = (p.level + 1) as OlympiadLevel;
        p.streak = 0;
        res.levelUp = true;
      } else if (levelDone) {
        p.mastered = true;
        res.mastered = true;
      }
    }
  } else {
    p.streak = 0;
    fails += 1;
    if (fails === 2) {
      res.escalation = "alternative";
    } else if (fails === 3) {
      if (p.level > 1) {
        p.level = (p.level - 1) as OlympiadLevel;
        res.levelDown = true;
        res.escalation = "levelDown";
      } else {
        res.escalation = "alternative";
      }
    } else if (fails >= 4) {
      res.escalation = "notified";
      void sendTelegram(
        methodistChatId(),
        `⚠️ <b>${args.childName}</b> застревает в теме «${args.topicId}» (уровень L${args.level}): ${fails} неудач подряд. Загляните в кабинет методиста.`,
      );
      fails = 0;
    }
  }

  res.newLevel = p.level;
  await saveProgress(p, fails);

  if (args.solved && args.level === 3 && args.worksheetUrl) {
    void sendTelegram(
      methodistChatId(),
      `📝 <b>${args.childName}</b> сдал листочек L3 по теме «${args.topicId}» — нужна проверка.`,
    );
  }

  return res;
}
