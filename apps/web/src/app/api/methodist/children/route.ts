import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listChildren, createChild, updateChild } from "@/lib/methodist-repo";

async function guard() {
  const s = await getSession();
  return s?.role === "methodist" ? s : null;
}

/** GET /api/methodist/children — список учеников с расписанием и планом. */
export async function GET() {
  const s = await guard();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ children: await listChildren(s.userId) });
}

/**
 * POST /api/methodist/children
 *  { op:"create", name, grade, login, pin, parentEmail?, parentPassword?, parentName? }
 *  { op:"update", childId, pin?, disabledSubjects?, scheduledDates?, planOrder? }
 */
export async function POST(req: Request) {
  const s = await guard();
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (body.op === "create") {
    const res = await createChild({
      methodistId: s.userId,
      name: String(body.name ?? "").trim(),
      grade: Number(body.grade) || 3,
      login: String(body.login ?? "").trim(),
      pin: String(body.pin ?? ""),
      parentEmail: body.parentEmail ? String(body.parentEmail) : undefined,
      parentPassword: body.parentPassword ? String(body.parentPassword) : undefined,
      parentName: body.parentName ? String(body.parentName) : undefined,
    });
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  }
  if (body.op === "update") {
    const res = await updateChild({
      childId: String(body.childId ?? ""),
      pin: body.pin ? String(body.pin) : undefined,
      disabledSubjects: Array.isArray(body.disabledSubjects)
        ? (body.disabledSubjects as string[])
        : undefined,
      scheduledDates: Array.isArray(body.scheduledDates)
        ? (body.scheduledDates as string[])
        : undefined,
      planOrder: Array.isArray(body.planOrder) ? (body.planOrder as string[]) : undefined,
    });
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  }
  return NextResponse.json({ error: "unknown op" }, { status: 400 });
}
