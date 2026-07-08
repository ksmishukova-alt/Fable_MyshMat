import { NextResponse } from "next/server";
import { getSession, getCurrentChildId } from "@/lib/session";
import { getAvatar, saveAvatar, parseAvatar } from "@/lib/avatar";

/** GET — текущий аватар ребёнка. */
export async function GET() {
  const childId = await getCurrentChildId();
  return NextResponse.json({ config: await getAvatar(childId) });
}

/** POST { fur, hoodie, acc } — сохранить аватар (только детская сессия). */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "child") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const config = parseAvatar(JSON.stringify(body));
  const result = await saveAvatar(s.userId, config);
  return NextResponse.json({ ...result, config }, { status: result.ok ? 200 : 500 });
}
