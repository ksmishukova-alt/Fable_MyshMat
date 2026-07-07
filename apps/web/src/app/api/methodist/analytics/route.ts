import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { childAnalytics } from "@/lib/methodist-repo";

/** GET /api/methodist/analytics?child=<uuid> */
export async function GET(req: Request) {
  const s = await getSession();
  if (s?.role !== "methodist") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const childId = new URL(req.url).searchParams.get("child");
  if (!childId) return NextResponse.json({ error: "child required" }, { status: 400 });
  return NextResponse.json(await childAnalytics(childId));
}
