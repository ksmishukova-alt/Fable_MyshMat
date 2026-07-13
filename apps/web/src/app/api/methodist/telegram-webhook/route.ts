import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { callTelegram } from "@/lib/telegram";

/**
 * POST /api/methodist/telegram-webhook — регистрирует webhook бота
 * на текущий домен (включает кнопки проверки в Telegram). Вызывается один раз.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "methodist") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const origin = new URL(req.url).origin;
  const payload: Record<string, unknown> = {
    url: `${origin}/api/telegram/webhook`,
    allowed_updates: ["callback_query", "message"],
  };
  if (process.env.TELEGRAM_WEBHOOK_SECRET) {
    payload.secret_token = process.env.TELEGRAM_WEBHOOK_SECRET;
  }
  const r = await callTelegram("setWebhook", payload);
  return NextResponse.json(
    r.ok
      ? { ok: true, url: payload.url }
      : { ok: false, reason: r.description ?? "не удалось" },
    { status: r.ok ? 200 : 502 },
  );
}
