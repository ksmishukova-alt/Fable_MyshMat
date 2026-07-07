import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createPayment } from "@/lib/yookassa";

/** POST /api/pay — родитель оплачивает месяц подписки. */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "parent") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const origin = new URL(req.url).origin;
  const result = await createPayment(s.userId, `${origin}/parent?paid=1`);
  return NextResponse.json(result, { status: result.error ? 502 : 200 });
}
