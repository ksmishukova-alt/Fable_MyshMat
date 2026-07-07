/**
 * МышМат — данные для кабинета родителя: дети, сводный отчёт, подписка.
 * Отчёт: время на платформе, пройденные темы, частые ошибки, рекомендации.
 */
import { getSupabase } from "@/lib/supabase";
import { TOPICS } from "@/lib/olympiad-bank";
import { getTopicNodes } from "@/lib/olympiad-repo";
import type { SubscriptionStatus } from "@/types/users";

export interface ParentChild {
  id: string;
  name: string;
  grade: number;
  stars: number;
}

export interface ParentReport {
  timeOnPlatformMin: number;
  daysActive: number;
  topicsMastered: { title: string; glyph: string }[];
  topicsInProgress: { title: string; level: number }[];
  frequentMistakes: { topic: string; fails: number }[];
  recommendations: string[];
  scheduledDates: string[];
}

const DEMO_CHILDREN: ParentChild[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Артём", grade: 3, stars: 245 },
  { id: "22222222-2222-2222-2222-222222222222", name: "Маша", grade: 2, stars: 120 },
];

export async function listChildrenForParent(parentId: string): Promise<ParentChild[]> {
  const db = getSupabase();
  if (!db) return DEMO_CHILDREN;
  const { data } = await db
    .from("child_profiles")
    .select("id,name,grade,stars")
    .eq("real_parent_id", parentId)
    .order("name");
  return (data ?? []) as ParentChild[];
}

export async function subscriptionStatus(parentId: string): Promise<{
  status: SubscriptionStatus;
  paidUntil: string | null;
}> {
  const db = getSupabase();
  if (!db) return { status: "trial", paidUntil: null };
  const { data } = await db
    .from("subscriptions")
    .select("status,paid_until")
    .eq("parent_id", parentId)
    .maybeSingle();
  return {
    status: (data?.status as SubscriptionStatus) ?? "trial",
    paidUntil: data?.paid_until ?? null,
  };
}

export async function buildParentReport(childId: string): Promise<ParentReport> {
  const db = getSupabase();
  const nodes = await getTopicNodes(childId);
  const mastered = nodes
    .filter((n) => n.mastered)
    .map((n) => {
      const t = TOPICS.find((x) => x.id === n.topicId)!;
      return { title: t.title, glyph: t.glyph };
    });
  const inProgress = nodes
    .filter((n) => !n.mastered && n.state === "inProgress")
    .map((n) => ({
      title: TOPICS.find((x) => x.id === n.topicId)?.title ?? n.topicId,
      level: n.level,
    }));

  let timeMin = 0;
  let daysActive = 0;
  let mistakes: { topic: string; fails: number }[] = [];
  let scheduledDates: string[] = [];

  if (db) {
    const { data: attempts } = await db
      .from("olympiad_attempts")
      .select("topic_id,status,duration_ms,started_at")
      .eq("child_id", childId)
      .limit(1000);
    const rows = attempts ?? [];
    timeMin = Math.round(rows.reduce((s, r) => s + (r.duration_ms ?? 0), 0) / 60000);
    daysActive = new Set(rows.map((r) => String(r.started_at).slice(0, 10))).size;

    const failMap = new Map<string, number>();
    for (const r of rows.filter((x) => x.status === "failed")) {
      failMap.set(r.topic_id, (failMap.get(r.topic_id) ?? 0) + 1);
    }
    mistakes = [...failMap.entries()]
      .map(([tid, fails]) => ({
        topic: TOPICS.find((t) => t.id === tid)?.title ?? tid,
        fails,
      }))
      .sort((a, b) => b.fails - a.fails)
      .slice(0, 3);

    const { data: sched } = await db
      .from("daily_schedule")
      .select("date")
      .eq("child_id", childId)
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date")
      .limit(14);
    scheduledDates = (sched ?? []).map((s) => s.date as string);
  }

  const recommendations: string[] = [];
  if (mistakes.length) {
    recommendations.push(
      `Стоит вернуться к теме «${mistakes[0].topic}» — там больше всего ошибок. Методист уже видит это в своей аналитике.`,
    );
  }
  if (mastered.length) {
    recommendations.push(
      `Отличный прогресс: приручено тем — ${mastered.length}. Похвалите ребёнка за самостоятельность!`,
    );
  } else {
    recommendations.push(
      "Первая приручённая тема уже близко — поддержите регулярность: короткие занятия каждый будний день работают лучше длинных рывков.",
    );
  }
  if (!scheduledDates.length) {
    recommendations.push("Расписание Daily на ближайшие дни не назначено — напишите методисту.");
  }

  return {
    timeOnPlatformMin: timeMin,
    daysActive,
    topicsMastered: mastered,
    topicsInProgress: inProgress,
    frequentMistakes: mistakes,
    recommendations,
    scheduledDates,
  };
}
