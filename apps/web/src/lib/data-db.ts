import { getSupabase } from "@/lib/supabase";
import { STICKERS_TOTAL } from "@/lib/stickers-catalog";
import type {
  HomeScreenData,
  DailyTask,
  TaskContent,
  SubjectId,
  SubjectStatus,
  TaskStep,
  SubjectSummary,
} from "@/types/domain";
import { isMyshroutkaEarned, buildWeek } from "@/types/domain";

/** Supabase join может вернуть связанную таблицу как массив или объект. Приводим к объекту. */
function one<T>(rel: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(rel)) return rel[0];
  return rel ?? undefined;
}

const DEMO_CHILD = "11111111-1111-1111-1111-111111111111";
const SUBJECT_ORDER: SubjectId[] = ["math", "russian", "reading", "english"];

/** Сегодняшняя дата в ISO (YYYY-MM-DD). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Получить/создать сессию на сегодня. Возвращает id сессии. */
async function ensureSession(childId: string): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const date = today();

  const { data: existing } = await sb
    .from("daily_sessions")
    .select("id")
    .eq("child_id", childId)
    .eq("date", date)
    .maybeSingle();
  if (existing?.id) return existing.id as string;

  const { data: created } = await sb
    .from("daily_sessions")
    .insert({ child_id: childId, date, status: "notStarted" })
    .select("id")
    .single();
  return (created?.id as string) ?? null;
}

export async function getHomeDataDb(childId: string = DEMO_CHILD): Promise<HomeScreenData | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data: child } = await sb
    .from("child_profiles")
    .select("id,name,grade,stars,disabled_subjects")
    .eq("id", childId)
    .single();
  if (!child) return null;

  // расписание: Daily доступен только в назначенные методистом даты
  const { data: schedRow } = await sb
    .from("daily_schedule")
    .select("date")
    .eq("child_id", child.id)
    .eq("date", today())
    .maybeSingle();
  const scheduledToday = !!schedRow;

  const disabled = new Set(
    Array.isArray(child.disabled_subjects) ? (child.disabled_subjects as string[]) : [],
  );
  const subjectOrder = SUBJECT_ORDER.filter((sid) => !disabled.has(sid));

  const sessionId = await ensureSession(child.id);

  // прогресс по предметам (если нет строк — собираем из конфигурации)
  const { data: progressRows } = await sb
    .from("daily_subject_progress")
    .select("subject,status,tasks_total,tasks_done")
    .eq("session_id", sessionId);

  const { data: configs } = await sb
    .from("daily_task_configs")
    .select("subject,task_id")
    .eq("active", true);

  const subjects: SubjectSummary[] = subjectOrder.map((sid) => {
    const fromDb = progressRows?.find((r) => r.subject === sid);
    const total = configs?.filter((c) => c.subject === sid).length ?? 0;
    return {
      subjectId: sid,
      status: (fromDb?.status as SubjectStatus) ?? "notStarted",
      tasksTotal: fromDb?.tasks_total ?? total,
      tasksDone: fromDb?.tasks_done ?? 0,
    };
  });

  const myshroutkaGranted = isMyshroutkaEarned(subjects);

  const { data: revisionRows } = await sb
    .from("daily_task_attempts")
    .select("task_id,tasks(subject)")
    .eq("child_id", child.id)
    .eq("status", "needsRevision");

  return {
    profile: { id: child.id, name: child.name, grade: child.grade },
    session: {
      id: sessionId ?? "",
      childId: child.id,
      date: today(),
      status: myshroutkaGranted ? "submitted" : "inProgress",
      subjects,
      myshroutkaGranted,
      submittedAt: null,
    },
    revisions: {
      count: revisionRows?.length ?? 0,
      items:
        revisionRows?.map((r) => ({
          taskId: r.task_id as string,
          subjectId: one((r as unknown as { tasks?: { subject?: SubjectId } | { subject?: SubjectId }[] }).tasks)?.subject ?? "math",
        })) ?? [],
    },
    stickers: await stickersFromDb(child.id),
    week: buildWeek(new Date(), [0, 1], false),
    scheduledToday,
  };
}

/** Наклейки ребёнка из БД (каталог — TS-файл). */
async function stickersFromDb(childId: string): Promise<{ collected: number; total: number }> {
  const sb = getSupabase();
  if (!sb) return { collected: 0, total: STICKERS_TOTAL };
  const { count } = await sb
    .from("sticker_ownership")
    .select("*", { count: "exact", head: true })
    .eq("child_id", childId);
  return { collected: count ?? 0, total: STICKERS_TOTAL };
}

export async function getSubjectTasksDb(
  subjectId: SubjectId
): Promise<DailyTask[] | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data } = await sb
    .from("daily_task_configs")
    .select("ord,tasks(id,subject,title,mode,est_minutes)")
    .eq("subject", subjectId)
    .eq("active", true)
    .order("ord");
  if (!data) return null;

  return data.map((row, i) => {
    const r = row as unknown as {
      ord: number;
      tasks: { id: string; title: string; mode: string; est_minutes: number | null }
        | { id: string; title: string; mode: string; est_minutes: number | null }[];
    };
    const t = one(r.tasks);
    if (!t) {
      return {
        id: "", subjectId, title: "", mode: "platform" as DailyTask["mode"],
        order: r.ord ?? i + 1, status: "notStarted" as const,
      };
    }
    return {
      id: t.id,
      subjectId,
      title: t.title,
      mode: t.mode as DailyTask["mode"],
      order: r.ord ?? i + 1,
      estMinutes: t.est_minutes ?? undefined,
      status: "notStarted",
    };
  });
}

export async function getTaskContentDb(taskId: string): Promise<TaskContent | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data: task } = await sb
    .from("tasks")
    .select("id,subject,title,mode,prompt,est_minutes")
    .eq("id", taskId)
    .single();
  if (!task) return null;

  const { data: steps } = await sb
    .from("task_steps")
    .select("id,ord,kind,prompt,passage,hint,options,correct_input,payload")
    .eq("task_id", taskId)
    .order("ord");

  // позиция в предмете
  const { data: cfg } = await sb
    .from("daily_task_configs")
    .select("task_id,ord")
    .eq("subject", task.subject)
    .eq("active", true)
    .order("ord");
  const order = (cfg?.findIndex((c) => c.task_id === taskId) ?? 0) + 1;

  const mappedSteps: TaskStep[] | undefined = steps?.map((row) => {
    const s = row as unknown as {
      id: string; kind: string; prompt: string;
      passage: string | null; hint: string | null;
      options: { id: string; label: string; is_correct: boolean; isCorrect?: boolean }[] | null;
      correct_input: string | null;
      payload: Record<string, unknown> | null;
    };
    return {
      // payload — специфика раннеров (words/cards/gaps/…), см. 0007_daily_content.sql
      ...((s.payload ?? {}) as Partial<TaskStep>),
      id: s.id,
      kind: s.kind as TaskStep["kind"],
      prompt: s.prompt,
      passage: s.passage ?? undefined,
      hint: s.hint ?? undefined,
      options:
        s.options?.map((o) => ({ id: o.id, label: o.label, isCorrect: o.isCorrect ?? o.is_correct })) ?? undefined,
      correctInput: s.correct_input ?? undefined,
    };
  });

  return {
    id: task.id,
    subjectId: (task.subject as unknown) as SubjectId,
    title: task.title,
    mode: (task.mode as unknown) as TaskContent["mode"],
    order,
    total: cfg?.length ?? 1,
    estMinutes: task.est_minutes ?? undefined,
    prompt: task.prompt ?? "",
    steps: mappedSteps,
  };
}

export async function getNextTaskIdDb(
  subjectId: SubjectId,
  currentId: string
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("daily_task_configs")
    .select("task_id,ord")
    .eq("subject", subjectId)
    .eq("active", true)
    .order("ord");
  if (!data) return null;
  const idx = data.findIndex((c) => c.task_id === currentId);
  if (idx === -1 || idx === data.length - 1) return null;
  return data[idx + 1].task_id as string;
}

/** Профили детей для экрана входа (из БД). */
export async function getLoginProfilesDb(): Promise<
  { id: string; name: string; grade: number; shortCode: string }[] | null
> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("child_profiles")
    .select("id,name,grade,short_code")
    .order("name");
  if (!data) return null;
  return data.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    grade: (r.grade as number) ?? 0,
    shortCode: (r.short_code as string) ?? "",
  }));
}
