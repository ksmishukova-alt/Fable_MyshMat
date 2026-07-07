import type { HomeScreenData, DailyTask, TaskContent, SubjectId } from "@/types/domain";
import { getHomeData, getSubjectTasks, getTaskContent, getNextTaskId } from "@/lib/mock-data";
import {
  getHomeDataDb,
  getSubjectTasksDb,
  getTaskContentDb,
  getNextTaskIdDb,
} from "@/lib/data-db";

/**
 * Единый слой данных. Если Supabase настроен (есть env) — берём из БД;
 * иначе — моки. Сигнатуры одинаковые, компоненты не зависят от источника.
 */

export async function fetchHomeData(childId?: string): Promise<HomeScreenData> {
  return (await getHomeDataDb(childId)) ?? getHomeData();
}

export async function fetchSubjectTasks(subjectId: SubjectId): Promise<DailyTask[]> {
  return (await getSubjectTasksDb(subjectId)) ?? getSubjectTasks(subjectId);
}

export async function fetchTaskContent(taskId: string): Promise<TaskContent | null> {
  const db = await getTaskContentDb(taskId);
  if (db) return db;
  return getTaskContent(taskId);
}

export async function fetchNextTaskId(
  subjectId: SubjectId,
  currentId: string
): Promise<string | null> {
  const db = await getNextTaskIdDb(subjectId, currentId);
  if (db !== null) return db;
  return getNextTaskId(subjectId, currentId);
}
