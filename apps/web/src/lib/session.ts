import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE, type SessionToken } from "@/lib/auth";

/** Текущая сессия (любая роль) или null. */
export async function getSession(): Promise<SessionToken | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * UUID текущего ребёнка. Страницы детской зоны защищены middleware,
 * поэтому здесь сессия почти всегда есть; fallback — демо-ребёнок
 * (используется только в /preview и при выключенном middleware).
 */
const DEMO_CHILD = "11111111-1111-1111-1111-111111111111";

export async function getCurrentChildId(): Promise<string> {
  const s = await getSession();
  return s?.role === "child" ? s.userId : DEMO_CHILD;
}

export async function hasChildSession(): Promise<boolean> {
  const s = await getSession();
  return s?.role === "child";
}
