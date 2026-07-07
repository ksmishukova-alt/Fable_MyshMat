import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { reviewQueue, decideReview } from "@/lib/methodist-repo";

async function guard() {
  const s = await getSession();
  return s?.role === "methodist" ? s : null;
}

/** GET /api/methodist/review — очередь ручной проверки. */
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ queue: await reviewQueue() });
}

/** POST /api/methodist/review — { kind, attemptId, verdict, feedback? } */
export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  let body: { kind: "daily" | "olympiad"; attemptId: string; verdict: "successful" | "perfect" | "needsRevision"; feedback?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const res = await decideReview(body);
  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}
