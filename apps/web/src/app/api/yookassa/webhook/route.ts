import { NextResponse } from "next/server";
import { handleWebhook } from "@/lib/yookassa";

/**
 * POST /api/yookassa/webhook — уведомления ЮKassa (payment.succeeded).
 * Событие верифицируется обратным запросом к API ЮKassa.
 * URL вебхука настраивается в личном кабинете ЮKassa.
 */
export async function POST(req: Request) {
  let body: Parameters<typeof handleWebhook>[0];
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const ok = await handleWebhook(body);
  // ЮKassa ждёт 200 в любом случае, иначе будет ретраить бесконечно
  return NextResponse.json({ ok });
}
