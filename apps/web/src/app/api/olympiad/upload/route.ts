import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getCurrentChildId } from "@/lib/session";

/**
 * POST /api/olympiad/upload — фото листочка (L3).
 * multipart/form-data: file. → { url }
 * Supabase Storage (bucket worksheets); без БД — data-URL заглушка не сохраняется,
 * возвращаем метку mock:// (методист в мок-режиме видит только факт сдачи).
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "file too large" }, { status: 413 });
  }

  const childId = await getCurrentChildId();
  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ url: `mock://worksheet/${childId}/${Date.now()}` });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${childId}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await db.storage.from("worksheets").upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = db.storage.from("worksheets").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
