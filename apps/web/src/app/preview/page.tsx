import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { WEEK1 } from "@/lib/week1-content";
import { WEEKS_2_10 } from "@/lib/weeks-content";
import { SUBJECTS } from "@/types/domain";
import "./preview.css";

const KIND_LABEL: Record<string, string> = {
  punctuation: "Пунктуация", order: "Карточки", wordfix: "Замена слова",
  gapinput: "Ввод в пропуск", sort: "Сортировка", fields: "Поля-разбор",
  question: "Выбор ответа", reading: "Чтение", audio: "Аудиодиктант", listening: "Аудирование",
  proofread: "Поиск ошибок", readaloud: "Чтение вслух",
};

function taskKind(t: { mode: string; steps?: { kind: string }[] }): string {
  if (t.mode === "worksheet") return "Листочек (фото)";
  const kinds = Array.from(new Set((t.steps ?? []).map((s) => s.kind)));
  return kinds.map((k) => KIND_LABEL[k] ?? k).join(" + ");
}

export default async function PreviewPage() {
  // служебный каталог контента — только для методиста (аудит, решение №6)
  const session = await getSession();
  if (session?.role !== "methodist") redirect("/");

  return (
    <main className="pv-stage" aria-label="Каталог заданий недели 1">
      <div className="pv-wrap">
        <header className="pv-top">
          <Link className="pv-back" href="/">← На главную</Link>
          <h1>Каталог заданий · Недели 1–10</h1>
        </header>
        <p className="pv-intro">
          Инструмент для просмотра. Открой любое задание и проверь, как работает раннер
          на реальном контенте. На боевой версии этот раздел будет скрыт.
        </p>

        {[...WEEK1, ...WEEKS_2_10].map((day) => (
          <section key={`${day.subject}-w${(day as { week?: number }).week ?? 1}-${day.day}`} className="pv-day">
            <h2 className={`pv-day-title s-${day.subject}`}>
              {SUBJECTS[day.subject].glyph} {day.label}
            </h2>
            <ul className="pv-list">
              {day.tasks.map((t) => (
                <li key={t.id}>
                  <Link className="pv-item" href={`/daily/${t.subjectId}/${t.id}`}>
                    <span className="pv-item-title">{t.title}</span>
                    <span className="pv-item-kind">{taskKind(t)}</span>
                    <span className="pv-item-go">Открыть ›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
