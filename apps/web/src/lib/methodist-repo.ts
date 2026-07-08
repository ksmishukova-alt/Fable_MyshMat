/**
 * МышМат — операции методиста: аккаунты, расписание, план, очередь проверки, аналитика.
 * Мок-режим держит всё в памяти процесса, чтобы кабинет работал в демо.
 */
import { getSupabase } from "@/lib/supabase";
import { hashSecret } from "@/lib/hash";
import { normalizeLogin } from "@/lib/users-repo";
import { TOPICS } from "@/lib/olympiad-bank";

export interface ChildRow {
  id: string;
  name: string;
  grade: number;
  login: string | null;
  stars: number;
  disabledSubjects: string[];
  scheduledDates: string[];
  planOrder: string[]; // topicIds
}

// ── мок-хранилище ──
const mockChildren: ChildRow[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Артём",
    grade: 3,
    login: "artem",
    stars: 245,
    disabledSubjects: [],
    scheduledDates: [],
    planOrder: TOPICS.map((t) => t.id),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Маша",
    grade: 2,
    login: "masha",
    stars: 120,
    disabledSubjects: [],
    scheduledDates: [],
    planOrder: TOPICS.map((t) => t.id),
  },
];

export async function listChildren(methodistId: string): Promise<ChildRow[]> {
  const db = getSupabase();
  if (!db) return mockChildren;
  const { data } = await db
    .from("child_profiles")
    .select("id,name,grade,login,stars,disabled_subjects")
    .or(`methodist_id.eq.${methodistId},methodist_id.is.null`)
    .order("name");
  const rows: ChildRow[] = [];
  for (const c of data ?? []) {
    const { data: sched } = await db
      .from("daily_schedule")
      .select("date")
      .eq("child_id", c.id)
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date")
      .limit(60);
    const { data: plan } = await db
      .from("child_plan_nodes")
      .select("topic_id,ord")
      .eq("child_id", c.id)
      .order("ord");
    rows.push({
      id: c.id,
      name: c.name,
      grade: c.grade,
      login: c.login,
      stars: c.stars,
      disabledSubjects: Array.isArray(c.disabled_subjects) ? c.disabled_subjects : [],
      scheduledDates: (sched ?? []).map((s) => s.date as string),
      planOrder: plan?.length ? plan.map((p) => p.topic_id as string) : TOPICS.map((t) => t.id),
    });
  }
  return rows;
}

export async function createChild(args: {
  methodistId: string;
  name: string;
  grade: number;
  login: string;
  pin: string;
  parentEmail?: string;
  parentPassword?: string;
  parentName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const db = getSupabase();
  if (!db) {
    mockChildren.push({
      id: crypto.randomUUID(),
      name: args.name,
      grade: args.grade,
      login: normalizeLogin(args.login),
      stars: 0,
      disabledSubjects: [],
      scheduledDates: [],
      planOrder: TOPICS.map((t) => t.id),
    });
    return { ok: true };
  }

  let parentId: string | null = null;
  if (args.parentEmail) {
    const email = args.parentEmail.trim().toLowerCase();
    const { data: existing } = await db.from("parents").select("id").eq("email", email).maybeSingle();
    if (existing?.id) {
      parentId = existing.id as string;
    } else {
      const { data: created, error } = await db
        .from("parents")
        .insert({
          email,
          name: args.parentName || "Родитель",
          password_hash: hashSecret(args.parentPassword || crypto.randomUUID().slice(0, 8)),
          created_by: args.methodistId,
        })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      parentId = created?.id ?? null;
      if (parentId) {
        await db.from("subscriptions").upsert({ parent_id: parentId, status: "trial", plan: "monthly" });
      }
    }
  }

  const { error } = await db.from("child_profiles").insert({
    name: args.name,
    grade: args.grade,
    login: normalizeLogin(args.login),
    pin_hash: hashSecret(args.pin),
    real_parent_id: parentId,
    methodist_id: args.methodistId,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateChild(args: {
  childId: string;
  pin?: string;
  disabledSubjects?: string[];
  scheduledDates?: string[]; // полная замена будущих дат
  planOrder?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const db = getSupabase();
  if (!db) {
    const c = mockChildren.find((x) => x.id === args.childId);
    if (!c) return { ok: false, error: "not found" };
    if (args.disabledSubjects) c.disabledSubjects = args.disabledSubjects;
    if (args.scheduledDates) c.scheduledDates = args.scheduledDates;
    if (args.planOrder) c.planOrder = args.planOrder;
    return { ok: true };
  }

  if (args.pin) {
    const { error } = await db
      .from("child_profiles")
      .update({ pin_hash: hashSecret(args.pin) })
      .eq("id", args.childId);
    if (error) return { ok: false, error: error.message };
  }
  if (args.disabledSubjects) {
    const { error } = await db
      .from("child_profiles")
      .update({ disabled_subjects: args.disabledSubjects })
      .eq("id", args.childId);
    if (error) return { ok: false, error: error.message };
  }
  if (args.scheduledDates) {
    const today = new Date().toISOString().slice(0, 10);
    await db.from("daily_schedule").delete().eq("child_id", args.childId).gte("date", today);
    if (args.scheduledDates.length) {
      const { error } = await db
        .from("daily_schedule")
        .insert(args.scheduledDates.map((date) => ({ child_id: args.childId, date })));
      if (error) return { ok: false, error: error.message };
    }
  }
  if (args.planOrder) {
    await db.from("child_plan_nodes").delete().eq("child_id", args.childId);
    const { error } = await db
      .from("child_plan_nodes")
      .insert(args.planOrder.map((topicId, i) => ({ child_id: args.childId, topic_id: topicId, ord: i })));
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

// ─────────────────────────────────────────────
// Очередь проверки: Daily-ручные + олимпиадные листочки L3
// ─────────────────────────────────────────────
export interface ReviewQueueItem {
  kind: "daily" | "olympiad";
  attemptId: string;
  childName: string;
  title: string;
  solutionUrl: string | null;
  submittedAt: string;
}

export async function reviewQueue(): Promise<ReviewQueueItem[]> {
  const db = getSupabase();
  if (!db) return [];
  const items: ReviewQueueItem[] = [];

  const { data: daily } = await db
    .from("daily_task_attempts")
    .select("id, uploaded_solution_url, submitted_at, child_profiles(name), tasks(title)")
    .eq("status", "submitted")
    .eq("mode", "worksheet")
    .order("submitted_at", { ascending: true })
    .limit(50);
  for (const r of daily ?? []) {
    const row = r as unknown as {
      id: string;
      uploaded_solution_url: string | null;
      submitted_at: string | null;
      child_profiles: { name: string } | { name: string }[] | null;
      tasks: { title: string } | { title: string }[] | null;
    };
    const child = Array.isArray(row.child_profiles) ? row.child_profiles[0] : row.child_profiles;
    const task = Array.isArray(row.tasks) ? row.tasks[0] : row.tasks;
    items.push({
      kind: "daily",
      attemptId: row.id,
      childName: child?.name ?? "—",
      title: task?.title ?? "Задание",
      solutionUrl: row.uploaded_solution_url,
      submittedAt: row.submitted_at ?? "",
    });
  }

  const { data: oly } = await db
    .from("olympiad_attempts")
    .select("id, worksheet_url, started_at, topic_id, child_profiles(name)")
    .eq("status", "pendingReview")
    .order("started_at", { ascending: true })
    .limit(50);
  for (const r of oly ?? []) {
    const row = r as unknown as {
      id: string;
      worksheet_url: string | null;
      started_at: string;
      topic_id: string;
      child_profiles: { name: string } | { name: string }[] | null;
    };
    const child = Array.isArray(row.child_profiles) ? row.child_profiles[0] : row.child_profiles;
    items.push({
      kind: "olympiad",
      attemptId: row.id,
      childName: child?.name ?? "—",
      title: `Листочек L3 · ${TOPICS.find((t) => t.id === row.topic_id)?.title ?? row.topic_id}`,
      solutionUrl: row.worksheet_url,
      submittedAt: row.started_at,
    });
  }

  return items.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
}

export async function decideReview(args: {
  kind: "daily" | "olympiad";
  attemptId: string;
  verdict: "successful" | "perfect" | "needsRevision";
  feedback?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const db = getSupabase();
  if (!db) return { ok: true };
  if (args.kind === "daily") {
    const { error } = await db
      .from("daily_task_attempts")
      .update({ status: args.verdict })
      .eq("id", args.attemptId);
    return error ? { ok: false, error: error.message } : { ok: true };
  }
  const { error } = await db
    .from("olympiad_attempts")
    .update({
      status: args.verdict === "needsRevision" ? "failed" : "solved",
      review_verdict: args.verdict,
      review_feedback: args.feedback ?? null,
    })
    .eq("id", args.attemptId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─────────────────────────────────────────────
// Аналитика по ребёнку
// ─────────────────────────────────────────────
export interface ChildAnalytics {
  totalAttempts: number;
  solved: number;
  failed: number;
  avgDurationS: number;
  hintsUsed: number;
  byTopic: { topicId: string; title: string; level: number; solved: number; failed: number }[];
  recent: { kind: string; when: string; payload: Record<string, unknown> }[];
}

export async function childAnalytics(childId: string): Promise<ChildAnalytics> {
  const db = getSupabase();
  const empty: ChildAnalytics = {
    totalAttempts: 0,
    solved: 0,
    failed: 0,
    avgDurationS: 0,
    hintsUsed: 0,
    byTopic: [],
    recent: [],
  };
  if (!db) return empty;

  const { data: attempts } = await db
    .from("olympiad_attempts")
    .select("topic_id, level, status, duration_ms, hints_used, started_at")
    .eq("child_id", childId)
    .order("started_at", { ascending: false })
    .limit(500);

  const rows = attempts ?? [];
  const solved = rows.filter((r) => r.status === "solved" || r.status === "pendingReview").length;
  const failed = rows.filter((r) => r.status === "failed").length;
  const totalDur = rows.reduce((s, r) => s + (r.duration_ms ?? 0), 0);
  const hints = rows.reduce((s, r) => s + (r.hints_used ?? 0), 0);

  const byTopicMap = new Map<string, { level: number; solved: number; failed: number }>();
  for (const r of rows) {
    const cur = byTopicMap.get(r.topic_id) ?? { level: r.level, solved: 0, failed: 0 };
    if (r.status === "failed") cur.failed++;
    else cur.solved++;
    cur.level = Math.max(cur.level, r.level);
    byTopicMap.set(r.topic_id, cur);
  }

  const { data: events } = await db
    .from("analytics_events")
    .select("kind, payload, created_at")
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    totalAttempts: rows.length,
    solved,
    failed,
    avgDurationS: rows.length ? Math.round(totalDur / rows.length / 1000) : 0,
    hintsUsed: hints,
    byTopic: [...byTopicMap.entries()].map(([topicId, v]) => ({
      topicId,
      title: TOPICS.find((t) => t.id === topicId)?.title ?? topicId,
      ...v,
    })),
    recent: (events ?? []).map((e) => ({
      kind: e.kind as string,
      when: e.created_at as string,
      payload: (e.payload ?? {}) as Record<string, unknown>,
    })),
  };
}
