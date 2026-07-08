"use client";

/**
 * Кабинет методиста: Ученики · Проверка · Банк задач · Аналитика.
 * Ученики: создание ребёнка (+родителя), PIN, предметы Daily, расписание, порядок тем.
 * Проверка: очередь ручных работ (Daily-листочки, аудио, олимпиадные L3).
 * Банк: сид недель 1–10 + CSV-импорт (daily/olympiad).
 * Аналитика: попытки, ошибки, время, застревания по ребёнку.
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS, type SubjectId } from "@/types/domain";
import { TOPICS } from "@/lib/olympiad-bank";

interface ChildRow {
  id: string;
  name: string;
  grade: number;
  login: string | null;
  stars: number;
  disabledSubjects: string[];
  scheduledDates: string[];
  planOrder: string[];
}
interface QueueItem {
  kind: "daily" | "olympiad";
  attemptId: string;
  childName: string;
  title: string;
  solutionUrl: string | null;
  submittedAt: string;
}
interface Analytics {
  totalAttempts: number;
  solved: number;
  failed: number;
  avgDurationS: number;
  hintsUsed: number;
  byTopic: { topicId: string; title: string; level: number; solved: number; failed: number }[];
  recent: { kind: string; when: string; payload: Record<string, unknown> }[];
}

type Tab = "children" | "review" | "bank" | "analytics";

export function MethodistPanel({ name }: { name: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("children");
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const [dbMode, setDbMode] = useState<string | null>(null);

  const reloadChildren = useCallback(async () => {
    const d = await (await fetch("/api/methodist/children")).json();
    if (d.children) setChildren(d.children);
  }, []);
  const reloadQueue = useCallback(async () => {
    const d = await (await fetch("/api/methodist/review")).json();
    if (d.queue) setQueue(d.queue);
  }, []);

  useEffect(() => {
    void reloadChildren();
    void reloadQueue();
    void (async () => {
      try {
        const h = (await (await fetch("/api/health")).json()) as { db?: string };
        setDbMode(h.db ?? null);
      } catch {
        setDbMode(null);
      }
    })();
  }, [reloadChildren, reloadQueue]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="mt-stage">
      <div className="mt-wrap">
        <div className="mt-top">
          <div className="mt-title">Кабинет методиста</div>
          <div className="mt-user">
            {name}
            <button className="mt-logout" onClick={() => void logout()}>
              Выйти
            </button>
          </div>
        </div>

        <div className="mt-tabs" role="tablist">
          {(
            [
              ["children", "Ученики"],
              ["review", `Проверка${queue.length ? ` (${queue.length})` : ""}`],
              ["bank", "Банк задач"],
              ["analytics", "Аналитика"],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className="mt-tab"
              onClick={() => {
                setTab(t);
                setMsg(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {dbMode === "mock" && (
          <div className="mt-msg err">
            ⚠️ База данных не подключена — прогресс, аватары и аккаунты НЕ сохраняются.
            На Vercel: Settings → Environment Variables → добавь NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (значения из apps/web/.env.local)
            и сделай Redeploy.
          </div>
        )}
        {msg && <div className={`mt-msg${msg.err ? " err" : ""}`}>{msg.text}</div>}

        {tab === "children" && (
          <ChildrenTab children={children} onChanged={reloadChildren} setMsg={setMsg} />
        )}
        {tab === "review" && <ReviewTab queue={queue} onChanged={reloadQueue} />}
        {tab === "bank" && <BankTab setMsg={setMsg} />}
        {tab === "analytics" && <AnalyticsTab children={children} />}
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
function ChildrenTab({
  children,
  onChanged,
  setMsg,
}: {
  children: ChildRow[];
  onChanged: () => Promise<void>;
  setMsg: (m: { text: string; err?: boolean }) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    grade: "3",
    login: "",
    pin: "",
    parentEmail: "",
    parentPassword: "",
    parentName: "",
  });
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    try {
      const res = await fetch("/api/methodist/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "create", ...form, grade: Number(form.grade) }),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg({ text: `Ученик «${form.name}» создан` });
        setForm({ ...form, name: "", login: "", pin: "" });
        await onChanged();
      } else {
        setMsg({ text: d.error ?? "Ошибка", err: true });
      }
    } finally {
      setBusy(false);
    }
  }

  async function update(childId: string, patch: Record<string, unknown>) {
    const res = await fetch("/api/methodist/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "update", childId, ...patch }),
    });
    if (res.ok) {
      setMsg({ text: "Сохранено" });
      await onChanged();
    } else {
      setMsg({ text: "Не удалось сохранить", err: true });
    }
  }

  return (
    <>
      <section className="mt-card">
        <h2>Новый ученик</h2>
        <p className="hint">
          Родителя можно указать сразу (email + пароль) — аккаунт создастся автоматически и
          ребёнок будет привязан. Самостоятельной регистрации на платформе нет.
        </p>
        <div className="mt-form">
          <div className="mt-field">
            <label>Имя</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mt-field">
            <label>Класс</label>
            <input
              type="number"
              min={1}
              max={8}
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />
          </div>
          <div className="mt-field">
            <label>Логин</label>
            <input
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              placeholder="можно по-русски: артём"
            />
          </div>
          <div className="mt-field">
            <label>PIN (4 цифры)</label>
            <input
              value={form.pin}
              maxLength={4}
              onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div className="mt-field">
            <label>Email родителя</label>
            <input
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
            />
          </div>
          <div className="mt-field">
            <label>Пароль родителя</label>
            <input
              value={form.parentPassword}
              onChange={(e) => setForm({ ...form, parentPassword: e.target.value })}
            />
          </div>
          <button
            className="mt-btn"
            disabled={busy || !form.name || !form.login || form.pin.length !== 4}
            onClick={() => void create()}
          >
            Создать
          </button>
        </div>
      </section>

      <section className="mt-card">
        <h2>Ученики ({children.length})</h2>
        <table className="mt-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Класс</th>
              <th>Логин</th>
              <th>⭐</th>
              <th>Daily-даты</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {children.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.grade}</td>
                <td>{c.login ?? "—"}</td>
                <td>{c.stars}</td>
                <td>{c.scheduledDates.length ? `${c.scheduledDates.length} дат` : "не задано"}</td>
                <td>
                  <button
                    className="mt-btn secondary"
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  >
                    {expanded === c.id ? "Свернуть" : "Настроить"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {expanded &&
          (() => {
            const c = children.find((x) => x.id === expanded);
            if (!c) return null;
            return <ChildSettings child={c} onSave={(patch) => void update(c.id, patch)} />;
          })()}
      </section>
    </>
  );
}

function ChildSettings({
  child,
  onSave,
}: {
  child: ChildRow;
  onSave: (patch: Record<string, unknown>) => void;
}) {
  const [pin, setPin] = useState("");
  const [disabled, setDisabled] = useState<string[]>(child.disabledSubjects);
  const [plan, setPlan] = useState<string[]>(child.planOrder);
  const [weeks, setWeeks] = useState("2");

  /** Расписание: будни следующих N недель. */
  function buildWeekdays(nWeeks: number): string[] {
    const dates: string[] = [];
    const d = new Date();
    for (let i = 0; dates.length < nWeeks * 5 && i < nWeeks * 9 + 7; i++) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) dates.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  function movePlan(topicId: string, dir: -1 | 1) {
    const i = plan.indexOf(topicId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= plan.length) return;
    const next = [...plan];
    [next[i], next[j]] = [next[j], next[i]];
    setPlan(next);
  }

  return (
    <div className="mt-card" style={{ marginTop: 12, background: "#f8fbff" }}>
      <h2>Настройки: {child.name}</h2>

      <div className="mt-form" style={{ marginBottom: 14 }}>
        <div className="mt-field">
          <label>Новый PIN</label>
          <input value={pin} maxLength={4} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
        </div>
        <button className="mt-btn" disabled={pin.length !== 4} onClick={() => onSave({ pin })}>
          Сменить PIN
        </button>
      </div>

      <p className="hint">Предметы Daily (клик — включить/выключить для этого ребёнка):</p>
      <div className="mt-chipline" style={{ marginBottom: 14 }}>
        {(Object.keys(SUBJECTS) as SubjectId[]).map((sid) => {
          const off = disabled.includes(sid);
          return (
            <button
              key={sid}
              className={`mt-chip ${off ? "off" : "on"}`}
              onClick={() => {
                const next = off ? disabled.filter((x) => x !== sid) : [...disabled, sid];
                setDisabled(next);
                onSave({ disabledSubjects: next });
              }}
            >
              {SUBJECTS[sid].title}
            </button>
          );
        })}
      </div>

      <p className="hint">Расписание Daily — назначить будни на N недель вперёд:</p>
      <div className="mt-form" style={{ marginBottom: 14 }}>
        <div className="mt-field">
          <label>Недель</label>
          <input type="number" min={1} max={12} value={weeks} onChange={(e) => setWeeks(e.target.value)} />
        </div>
        <button
          className="mt-btn"
          onClick={() => onSave({ scheduledDates: buildWeekdays(Number(weeks) || 1) })}
        >
          Назначить будни
        </button>
        <button className="mt-btn warn" onClick={() => onSave({ scheduledDates: [] })}>
          Очистить расписание
        </button>
      </div>

      <p className="hint">Порядок тем олимпиадного маршрута (индивидуальный план):</p>
      <div className="plan-order">
        {plan.map((tid) => (
          <span className="mt-chip on" key={tid}>
            <button
              style={{ border: 0, background: "none", cursor: "pointer", fontWeight: 800 }}
              onClick={() => movePlan(tid, -1)}
              aria-label="Раньше"
            >
              ◀
            </button>
            {TOPICS.find((t) => t.id === tid)?.title ?? tid}
            <button
              style={{ border: 0, background: "none", cursor: "pointer", fontWeight: 800 }}
              onClick={() => movePlan(tid, 1)}
              aria-label="Позже"
            >
              ▶
            </button>
          </span>
        ))}
        <button className="mt-btn secondary" onClick={() => onSave({ planOrder: plan })}>
          Сохранить порядок
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function ReviewTab({ queue, onChanged }: { queue: QueueItem[]; onChanged: () => Promise<void> }) {
  async function decide(item: QueueItem, verdict: "successful" | "perfect" | "needsRevision") {
    await fetch("/api/methodist/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: item.kind, attemptId: item.attemptId, verdict }),
    });
    await onChanged();
  }

  return (
    <section className="mt-card">
      <h2>Очередь проверки</h2>
      {queue.length === 0 ? (
        <p className="hint">Пусто — все работы проверены. 🎉</p>
      ) : (
        queue.map((item) => (
          <div className="review-item" key={`${item.kind}-${item.attemptId}`}>
            <span className="who">{item.childName}</span>
            <span className="what">
              {item.title}
              {item.solutionUrl && item.solutionUrl.startsWith("http") && (
                <>
                  {" · "}
                  <a href={item.solutionUrl} target="_blank" rel="noreferrer">
                    открыть фото
                  </a>
                </>
              )}
            </span>
            <div className="review-actions">
              <button className="rv-perfect" onClick={() => void decide(item, "perfect")}>
                Отлично
              </button>
              <button className="rv-ok" onClick={() => void decide(item, "successful")}>
                Зачёт
              </button>
              <button className="rv-redo" onClick={() => void decide(item, "needsRevision")}>
                На доработку
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
function BankTab({ setMsg }: { setMsg: (m: { text: string; err?: boolean }) => void }) {
  const [type, setType] = useState<"daily" | "olympiad">("olympiad");
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);

  async function seedDaily() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/seed-daily", { method: "POST" });
      const d = await res.json();
      setMsg(
        res.ok
          ? { text: `Готово: задач в банке ${d.tasksTotal} (новых ${d.tasksInserted}), расписание контента: ${d.configs} позиций` }
          : { text: d.error ?? "Ошибка сида", err: true },
      );
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    setBusy(true);
    try {
      const res = await fetch("/api/methodist/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, csv }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        setMsg({ text: `Импортировано строк: ${d.inserted}` });
        setCsv("");
      } else {
        setMsg({
          text: `Импортировано: ${d.inserted ?? 0}. Ошибки:\n${(d.errors ?? [d.error]).join("\n")}`,
          err: true,
        });
      }
    } finally {
      setBusy(false);
    }
  }

  async function testTelegram() {
    setBusy(true);
    try {
      const res = await fetch("/api/methodist/telegram-test", { method: "POST" });
      const d = (await res.json()) as { ok: boolean; reason?: string };
      setMsg(
        d.ok
          ? { text: "Telegram работает — проверь чат с ботом!" }
          : { text: `Telegram не настроен: ${d.reason}. На Vercel добавь переменные TELEGRAM_BOT_TOKEN и TELEGRAM_PARENT_CHAT_ID (Settings → Environment Variables) и передеплой.`, err: true },
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="mt-card">
        <h2>Проверка Telegram</h2>
        <p className="hint">
          Отправляет тестовое сообщение методисту. Если не приходит — проверь env-переменные
          на Vercel и что ты нажимала Start у бота.
        </p>
        <button className="mt-btn secondary" disabled={busy} onClick={() => void testTelegram()}>
          Отправить тест в Telegram
        </button>
      </section>

      <section className="mt-card">
        <h2>Контент Daily недель 1–10</h2>
        <p className="hint">
          Переносит 300+ готовых заданий (русский + английский) из кода в базу — выполняется
          один раз, повторный запуск ничего не дублирует.
        </p>
        <button className="mt-btn" disabled={busy} onClick={() => void seedDaily()}>
          Загрузить недели 1–10 в БД
        </button>
      </section>

      <section className="mt-card">
        <h2>CSV-импорт банка задач</h2>
        <p className="hint">
          Daily: <code>slug,subject,title,mode,prompt,est_minutes,steps_json</code>
          <br />
          Олимпиада:{" "}
          <code>
            topic,level,order,title,statement,answer,accepted_json,hints_json,actions_count,guided_json,support_json,algebra_json,reward
          </code>
          <br />
          JSON-поля берите в кавычки, внутренние кавычки удваивайте (стандарт CSV). Темы:{" "}
          {TOPICS.map((t) => t.id).join(", ")}.
        </p>
        <div className="mt-form">
          <div className="mt-field">
            <label>Тип</label>
            <select value={type} onChange={(e) => setType(e.target.value as "daily" | "olympiad")}>
              <option value="olympiad">Олимпиада</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
        <div className="mt-field" style={{ marginTop: 10 }}>
          <label>CSV (первая строка — заголовки)</label>
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="topic,level,order,title,statement,answer&#10;parity,1,10,Пример,Чётно ли 4+6?,да" />
        </div>
        <button
          className="mt-btn"
          style={{ marginTop: 10 }}
          disabled={busy || !csv.trim()}
          onClick={() => void importCsv()}
        >
          Импортировать
        </button>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────
function AnalyticsTab({ children }: { children: ChildRow[] }) {
  const [childId, setChildId] = useState("");
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!childId && children.length) setChildId(children[0].id);
  }, [children, childId]);

  useEffect(() => {
    if (!childId) return;
    void (async () => {
      const d = await (await fetch(`/api/methodist/analytics?child=${childId}`)).json();
      setData(d);
    })();
  }, [childId]);

  return (
    <section className="mt-card">
      <h2>Аналитика</h2>
      <div className="mt-form" style={{ marginBottom: 14 }}>
        <div className="mt-field">
          <label>Ученик</label>
          <select value={childId} onChange={(e) => setChildId(e.target.value)}>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data && (
        <>
          <div className="an-grid">
            <div className="an-stat">
              <b>{data.totalAttempts}</b>
              <span>попыток</span>
            </div>
            <div className="an-stat">
              <b>{data.solved}</b>
              <span>решено</span>
            </div>
            <div className="an-stat">
              <b>{data.failed}</b>
              <span>провалов</span>
            </div>
            <div className="an-stat">
              <b>{data.avgDurationS} с</b>
              <span>среднее время</span>
            </div>
            <div className="an-stat">
              <b>{data.hintsUsed}</b>
              <span>подсказок</span>
            </div>
          </div>

          <table className="mt-table">
            <thead>
              <tr>
                <th>Тема</th>
                <th>Уровень</th>
                <th>Решено</th>
                <th>Провалы</th>
              </tr>
            </thead>
            <tbody>
              {data.byTopic.map((t) => (
                <tr key={t.topicId}>
                  <td>{t.title}</td>
                  <td>L{t.level}</td>
                  <td>{t.solved}</td>
                  <td>{t.failed}</td>
                </tr>
              ))}
              {data.byTopic.length === 0 && (
                <tr>
                  <td colSpan={4}>Пока нет попыток (или БД не подключена — данные копятся в Supabase).</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
