import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listChildrenForParent, buildParentReport } from "@/lib/parent-repo";
import { sendTelegram, parentChatId } from "@/lib/telegram";

/** POST /api/parent/notify — отправить сводку по ребёнку в Telegram родителя. */
export async function POST(req: Request) {
  const s = await getSession();
  if (s?.role !== "parent") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let body: { childId?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const children = await listChildrenForParent(s.userId);
  const child = children.find((c) => c.id === body.childId) ?? children[0];
  if (!child) return NextResponse.json({ error: "no children" }, { status: 400 });

  const r = await buildParentReport(child.id);
  const text = [
    `📊 <b>МышМат · ${child.name}</b>`,
    `⏱ На платформе: ${r.timeOnPlatformMin} мин · активных дней: ${r.daysActive}`,
    `🏅 Тем освоено: ${r.topicsMastered.length}${
      r.topicsMastered.length ? ` (${r.topicsMastered.map((t) => t.title).join(", ")})` : ""
    }`,
    r.topicsInProgress.length
      ? `📚 В работе: ${r.topicsInProgress.map((t) => `${t.title} (L${t.level})`).join(", ")}`
      : "",
    r.frequentMistakes.length
      ? `⚠️ Частые ошибки: ${r.frequentMistakes.map((m) => m.topic).join(", ")}`
      : "",
    "",
    ...r.recommendations.map((x) => `💡 ${x}`),
  ]
    .filter(Boolean)
    .join("\n");

  const sent = await sendTelegram(parentChatId(), text);
  return NextResponse.json({ ok: sent, reason: sent ? undefined : "telegram-not-configured" });
}
