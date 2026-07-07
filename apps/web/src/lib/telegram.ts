/**
 * МышМат — Telegram-уведомления.
 * Методисту: застревания, листочки L3 на проверку.
 * Родителю: мягкие сообщения о прогрессе.
 * Без TELEGRAM_BOT_TOKEN — тихо выключено.
 */

const API = "https://api.telegram.org";

export async function sendTelegram(chatId: string | undefined, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function methodistChatId(): string | undefined {
  return process.env.TELEGRAM_METHODIST_CHAT_ID || process.env.TELEGRAM_PARENT_CHAT_ID;
}

export function parentChatId(): string | undefined {
  return process.env.TELEGRAM_PARENT_CHAT_ID;
}
