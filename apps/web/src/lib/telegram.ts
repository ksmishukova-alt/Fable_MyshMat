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

/** Generic-вызов Telegram Bot API. */
export async function callTelegram(
  method: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN не задан" };
  try {
    const res = await fetch(`${API}/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    return (await res.json()) as { ok: boolean; result?: unknown; description?: string };
  } catch (e) {
    return { ok: false, description: e instanceof Error ? e.message : "network" };
  }
}

/**
 * Запрос на проверку работы: фото (если есть публичный URL) + кнопки
 * «Принять / На доработку». В подписи — служебная метка #ref для комментариев-reply.
 */
export async function sendReviewRequest(args: {
  kind: "daily" | "oly";
  attemptId: string;
  childName: string;
  title: string;
  photoUrl?: string | null;
}): Promise<boolean> {
  const chatId = methodistChatId();
  if (!chatId) return false;
  const caption =
    `📝 <b>${args.childName}</b> сдал(а) работу «${args.title}» — нужна проверка.\n` +
    `#ref:${args.kind}:${args.attemptId}`;
  const buttons = {
    inline_keyboard: [
      [
        { text: "✅ Принять", callback_data: `rv:${args.kind}:${args.attemptId}:ok` },
        { text: "❌ На доработку", callback_data: `rv:${args.kind}:${args.attemptId}:no` },
      ],
    ],
  };
  const hasPhoto = !!args.photoUrl && /^https?:\/\//.test(args.photoUrl);
  const r = hasPhoto
    ? await callTelegram("sendPhoto", {
        chat_id: chatId,
        photo: args.photoUrl,
        caption,
        parse_mode: "HTML",
        reply_markup: buttons,
      })
    : await callTelegram("sendMessage", {
        chat_id: chatId,
        text: caption + "\n(фото недоступно — смотри в кабинете)",
        parse_mode: "HTML",
        reply_markup: buttons,
      });
  return r.ok;
}
