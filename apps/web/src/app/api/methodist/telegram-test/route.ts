import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sendTelegramDetailed, methodistChatId } from "@/lib/telegram";

/** POST /api/methodist/telegram-test — проверка связи с Telegram-ботом. */
export async function POST() {
  const s = await getSession();
  if (s?.role !== "methodist") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = await sendTelegramDetailed(
    methodistChatId(),
    `✅ МышМат: тест связи. Уведомления работают! (${new Date().toLocaleString("ru-RU")})`,
  );
  return NextResponse.json(result);
}
