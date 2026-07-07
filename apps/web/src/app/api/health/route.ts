import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** GET /api/health — живо ли приложение и настроена ли БД. */
export async function GET() {
  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ ok: true, db: "mock" });
  }
  const { count, error } = await db
    .from("child_profiles")
    .select("*", { count: "exact", head: true });
  return NextResponse.json({
    ok: !error,
    db: "supabase",
    childCount: count ?? 0,
    error: error?.message,
  });
}
