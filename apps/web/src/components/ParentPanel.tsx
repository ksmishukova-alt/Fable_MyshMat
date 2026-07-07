"use client";

/**
 * Кабинет родителя: несколько детей, сводный отчёт (время, темы, ошибки,
 * рекомендации), расписание Daily, подписка + оплата (ЮKassa).
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ParentChild, ParentReport } from "@/lib/parent-repo";

interface Data {
  children: ParentChild[];
  subscription: { status: string; paidUntil: string | null };
  childId: string | null;
  report: ParentReport | null;
}

const SUB_LABELS: Record<string, string> = {
  trial: "Пробный период",
  active: "Подписка активна",
  expired: "Подписка истекла",
  canceled: "Подписка отменена",
};

export function ParentPanel({ name }: { name: string }) {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const d = (await (
        await fetch(`/api/parent/report${childId ? `?child=${childId}` : ""}`)
      ).json()) as Data;
      setData(d);
      if (!childId && d.childId) setChildId(d.childId);
    })();
  }, [childId]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  async function tgReport() {
    setPayMsg(null);
    const res = await fetch("/api/parent/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId }),
    });
    const d = (await res.json()) as { ok: boolean };
    setPayMsg(d.ok ? "Отчёт отправлен в Telegram ✓" : "Telegram-бот не настроен (TELEGRAM_BOT_TOKEN)");
  }

  async function pay() {
    setPayMsg(null);
    const res = await fetch("/api/pay", { method: "POST" });
    const d = (await res.json()) as { url?: string; test?: boolean; error?: string };
    if (d.url) {
      window.location.href = d.url;
    } else if (d.test) {
      setPayMsg("Тестовый режим: ЮKassa не настроена (нужны YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY). Платёж эмулирован.");
    } else {
      setPayMsg(d.error ?? "Не удалось создать платёж");
    }
  }

  if (!data) {
    return (
      <main className="pr-stage">
        <div className="pr-wrap">Загружаем отчёт…</div>
      </main>
    );
  }

  const r = data.report;

  return (
    <main className="pr-stage">
      <div className="pr-wrap">
        <div className="pr-top">
          <div className="pr-title">Кабинет родителя</div>
          <div className="pr-user">
            {name}
            <button className="pr-logout" onClick={() => void logout()}>
              Выйти
            </button>
          </div>
        </div>

        <div className="pr-children" role="tablist" aria-label="Дети">
          {data.children.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={childId === c.id}
              className="pr-child-tab"
              onClick={() => setChildId(c.id)}
            >
              {c.name} · {c.grade} класс
            </button>
          ))}
        </div>

        {r && (
          <>
            <section className="pr-card">
              <h2>Сводка</h2>
              <div className="pr-stats">
                <div className="pr-stat">
                  <b>{r.timeOnPlatformMin} мин</b>
                  <span>на платформе</span>
                </div>
                <div className="pr-stat">
                  <b>{r.daysActive}</b>
                  <span>активных дней</span>
                </div>
                <div className="pr-stat">
                  <b>{r.topicsMastered.length}</b>
                  <span>тем освоено</span>
                </div>
                <div className="pr-stat">
                  <b>{r.topicsInProgress.length}</b>
                  <span>тем в работе</span>
                </div>
              </div>
            </section>

            <section className="pr-card">
              <h2>Темы</h2>
              <div className="pr-badges">
                {r.topicsMastered.map((t) => (
                  <span className="pr-badge" key={t.title}>
                    {t.glyph} {t.title} — освоена
                  </span>
                ))}
                {r.topicsInProgress.map((t) => (
                  <span className="pr-badge progress" key={t.title}>
                    {t.title} · уровень L{t.level}
                  </span>
                ))}
                {r.topicsMastered.length + r.topicsInProgress.length === 0 && (
                  <span className="pr-badge progress">Маршрут ещё впереди!</span>
                )}
              </div>
            </section>

            {r.frequentMistakes.length > 0 && (
              <section className="pr-card">
                <h2>Частые ошибки</h2>
                <ul className="pr-list">
                  {r.frequentMistakes.map((m) => (
                    <li key={m.topic}>
                      «{m.topic}» — {m.fails} неудачных попыток
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="pr-card">
              <h2>Рекомендации</h2>
              <ul className="pr-list">
                {r.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </section>

            <section className="pr-card">
              <h2>Расписание Daily</h2>
              {r.scheduledDates.length ? (
                <div className="pr-dates">
                  {r.scheduledDates.map((d) => (
                    <span className="pr-date" key={d}>
                      {new Date(d + "T00:00:00").toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        weekday: "short",
                      })}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontWeight: 600, color: "#5a6a8c" }}>
                  Ближайшие даты не назначены — расписание составляет методист.
                </p>
              )}
            </section>
          </>
        )}

        <section className="pr-card">
          <h2>Подписка</h2>
          <div className="pr-sub-row">
            <span className={`pr-sub-status ${data.subscription.status}`}>
              {SUB_LABELS[data.subscription.status] ?? data.subscription.status}
              {data.subscription.paidUntil ? ` до ${data.subscription.paidUntil}` : ""}
            </span>
            <button className="btn-cta btn-cta--blue" onClick={() => void pay()}>
              Оплатить месяц — 990 ₽
            </button>
            <button className="btn-cta btn-cta--purple" onClick={() => void tgReport()}>
              Отчёт в Telegram
            </button>
          </div>
          {payMsg && (
            <p style={{ marginTop: 10, fontWeight: 700, color: "#b65c09" }}>{payMsg}</p>
          )}
        </section>
      </div>
    </main>
  );
}
