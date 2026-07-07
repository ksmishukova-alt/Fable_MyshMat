/**
 * МышМат — доступ к аккаунтам (дети, родители, методисты).
 * Supabase настроен → боевые таблицы; иначе — демо-аккаунты (моки).
 */
import { verifySecret } from "@/lib/hash";
import { getSupabase } from "@/lib/supabase";
import type { Role } from "@/types/users";

export interface AuthedUser {
  role: Role;
  id: string;
  name: string;
}

/** Демо-аккаунты (работают без БД). */
const DEMO_CHILDREN = [
  { id: "11111111-1111-1111-1111-111111111111", login: "artem", pin: "1234", name: "Артём", grade: 3 },
  { id: "22222222-2222-2222-2222-222222222222", login: "masha", pin: "1234", name: "Маша", grade: 2 },
];
const DEMO_ADULTS: { email: string; password: string; role: Role; id: string; name: string }[] = [
  {
    email: "metodist@myshmat.ru",
    password: "demo1234",
    role: "methodist",
    id: "33333333-3333-3333-3333-333333333333",
    name: "Ксения",
  },
  {
    email: "parent@myshmat.ru",
    password: "demo1234",
    role: "parent",
    id: "44444444-4444-4444-4444-444444444444",
    name: "Родитель",
  },
];

/** Вход ребёнка: логин + PIN. */
export async function authChild(login: string, pin: string): Promise<AuthedUser | null> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("child_profiles")
      .select("id, name, login, pin_hash")
      .eq("login", login.trim().toLowerCase())
      .maybeSingle();
    if (data?.pin_hash && verifySecret(pin, data.pin_hash)) {
      return { role: "child", id: data.id, name: data.name };
    }
    return null;
  }
  const demo = DEMO_CHILDREN.find((c) => c.login === login.trim().toLowerCase() && c.pin === pin);
  return demo ? { role: "child", id: demo.id, name: demo.name } : null;
}

/** Вход взрослого: email + пароль (родитель или методист). */
export async function authAdult(email: string, password: string): Promise<AuthedUser | null> {
  const db = getSupabase();
  const e = email.trim().toLowerCase();
  if (db) {
    for (const [table, role] of [
      ["methodists", "methodist"],
      ["parents", "parent"],
    ] as const) {
      const { data } = await db
        .from(table)
        .select("id, name, password_hash")
        .eq("email", e)
        .maybeSingle();
      if (data?.password_hash && verifySecret(password, data.password_hash)) {
        return { role, id: data.id, name: data.name };
      }
    }
    return null;
  }
  const demo = DEMO_ADULTS.find((a) => a.email === e && a.password === password);
  return demo ? { role: demo.role, id: demo.id, name: demo.name } : null;
}
