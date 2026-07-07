import { NextResponse } from "next/server";
import { authChild, authAdult } from "@/lib/users-repo";
import { signSession, SESSION_COOKIE, roleHome } from "@/lib/auth";

/**
 * POST /api/login
 *  { mode: "child", login, pin }
 *  { mode: "adult", email, password }
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const user =
    body.mode === "adult"
      ? await authAdult(body.email ?? "", body.password ?? "")
      : await authChild(body.login ?? "", body.pin ?? "");

  if (!user) {
    return NextResponse.json({ error: "Неверные данные входа" }, { status: 401 });
  }

  const token = await signSession({ role: user.role, userId: user.id, name: user.name });
  const res = NextResponse.json({ ok: true, role: user.role, home: roleHome(user.role) });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
