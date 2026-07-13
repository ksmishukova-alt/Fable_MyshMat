import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { callTelegram, methodistChatId } from "@/lib/telegram";
import { decideReview } from "@/lib/methodist-repo";

/**
 * Webhook Telegram: проверка работ кнопками прямо в чате методиста.
 *  - callback «rv:<kind>:<attemptId>:<ok|no>» → принять / на доработку;
 *  - при отклонении бот просит комментарий: методист отвечает (reply)
 *    на сообщение с меткой #ref — текст сохраняется как review_feedback.
 * Безопасность: секрет (TELEGRAM_WEBHOOK_SECRET) + только чат методиста.
 */

interface TgUpdate {
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number }; caption?: string; text?: string };
  };
  message?: {
    text?: string;
    chat: { id: number };
    reply_to_message?: { caption?: string; text?: string };
  };
}

export async function POST(req: Request) {
  // проверка секрета (если задан)
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = (await req.json()) as TgUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }
  const allowedChat = methodistChatId();

  // ── Кнопки «Принять / На доработку» ──
  const cb = update.callback_query;
  if (cb?.data?.startsWith("rv:")) {
    const chatOk = String(cb.message?.chat.id ?? "") === String(allowedChat ?? "");
    const [, kind, attemptId, verdict] = cb.data.split(":");
    if (!chatOk || !attemptId || (kind !== "daily" && kind !== "oly")) {
      await callTelegram("answerCallbackQuery", { callback_query_id: cb.id, text: "Недоступно" });
      return NextResponse.json({ ok: true });
    }

    if (verdict === "ok") {
      const r = await decideReview({ kind: kind === "oly" ? "olympiad" : "daily", attemptId, verdict: "successful" });
      await callTelegram("answerCallbackQuery", {
        callback_query_id: cb.id,
        text: r.ok ? "Принято ✅" : "Ошибка, попробуй в кабинете",
      });
      if (r.ok && cb.message) {
        await editDone(cb.message, "✅ ПРИНЯТО");
      }
    } else {
      const r = await decideReview({ kind: kind === "oly" ? "olympiad" : "daily", attemptId, verdict: "needsRevision" });
      await callTelegram("answerCallbackQuery", {
        callback_query_id: cb.id,
        text: r.ok ? "Отправлено на доработку" : "Ошибка, попробуй в кабинете",
      });
      if (r.ok && cb.message) {
        await editDone(
          cb.message,
          "❌ НА ДОРАБОТКУ\nЧтобы добавить комментарий ребёнку — ответь (reply) на это сообщение текстом.",
        );
      }
    }
    return NextResponse.json({ ok: true });
  }

  // ── Комментарий: reply на сообщение с меткой #ref ──
  const msg = update.message;
  if (msg?.text && msg.reply_to_message) {
    const chatOk = String(msg.chat.id) === String(allowedChat ?? "");
    const src = msg.reply_to_message.caption ?? msg.reply_to_message.text ?? "";
    const m = src.match(/#ref:(daily|oly):([0-9a-f-]{36})/i);
    if (chatOk && m) {
      const [, kind, attemptId] = m;
      const sb = getSupabase();
      if (sb) {
        const table = kind === "oly" ? "olympiad_attempts" : "daily_task_attempts";
        await sb.from(table).update({ review_feedback: msg.text.slice(0, 500) }).eq("id", attemptId);
      }
      await callTelegram("sendMessage", {
        chat_id: msg.chat.id,
        text: "💬 Комментарий сохранён — ребёнок увидит его в «Доработках».",
      });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

/** Обновить сообщение после решения: убрать кнопки, дописать вердикт. */
async function editDone(
  message: { message_id: number; chat: { id: number }; caption?: string; text?: string },
  suffix: string,
) {
  const base = message.caption ?? message.text ?? "";
  const payload = {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reply_markup: { inline_keyboard: [] as unknown[] },
  };
  if (message.caption !== undefined) {
    await callTelegram("editMessageCaption", { ...payload, caption: `${base}\n\n${suffix}` });
  } else {
    await callTelegram("editMessageText", { ...payload, text: `${base}\n\n${suffix}` });
  }
}
