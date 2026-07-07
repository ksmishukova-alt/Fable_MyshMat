import { NextResponse } from "next/server";
import { loadProblemById } from "@/lib/olympiad-bank-db";

/** GET /api/olympiad/hint?problem=…&index=0 — нарастающие подсказки каскада. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const p = await loadProblemById(url.searchParams.get("problem") ?? "");
  if (!p) return NextResponse.json({ error: "unknown problem" }, { status: 404 });
  const idx = Math.min(
    Math.max(0, Number(url.searchParams.get("index")) || 0),
    p.hints.length - 1,
  );
  return NextResponse.json({ hint: p.hints[idx] ?? null, index: idx });
}
