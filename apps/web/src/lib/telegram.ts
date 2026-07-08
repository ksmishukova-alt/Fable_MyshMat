/**
 * МышМат — Telegram-уведомления.
 * Методисту: застревания, листочки L3 на проверку.
 * Родителю: мягкие сообщения о прогрессе.
 * Без TELEGRAM_BOT_TOKEN — тихо выключено.
 */

const API = "https://api.telegram.org";

export interface TgResult {
  ok: boolean;
  reason?: string;
}

/** Отправка с детальной причиной (для диагностики). */
export async function sendTelegramDetailed(
  chatId: string | undefined,
  text: string,
): Promise<TgResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, reason: "TELEGRAM_BOT_TOKEN не задан (env)" };
  if (!chatId) return { ok: false, reason: "chat_id не задан (env)" };
  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => null)) as { description?: string } | null;
    return { ok: false, reason: `Telegram API ${res.status}: ${body?.description ?? "ошибка"}` };
  } catch (e) {
    return { ok: false, reason: `сеть: ${e instanceof Error ? e.message : "недоступен"}` };
  }
}

export async function sendTelegram(chatId: string | undefined, text: string): Promise<boolean> {
  return (await sendTelegramDetailed(chatId, text)).ok;
}

export function methodistChatId(): string | undefined {
  return process.env.TELEGRAM_METHODIST_CHAT_ID || process.env.TELEGRAM_PARENT_CHAT_ID;
}

export function parentChatId(): string | undefined {
  return process.env.TELEGRAM_PARENT_CHAT_ID;
}
