"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DailySession, SubjectId, WeekDay } from "@/types/domain";
import { countSubmitted, SUBJECTS } from "@/types/domain";
import { statusToChip, plural, leftVerb } from "@/lib/status";

/** css-класс иконки предмета внутри .daily (см. globals.css) */
const ICON_CLASS: Record<SubjectId, string> = {
  math: "math",
  russian: "russian",
  reading: "reading",
  english: "english",
};

function SubjectCell({
  subjectId,
  status,
}: {
  subjectId: SubjectId;
  status: ReturnType<typeof statusToChip>;
}) {
  const subject = SUBJECTS[subjectId];
  const router = useRouter();
  const href = `/daily/${subjectId}`;
  const canStart = status.tone === "blue";

  return (
    <div
      className={`subject${canStart ? " active" : ""}`}
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(href);
      }}
    >
      <div className={`sub-icon ${ICON_CLASS[subjectId]}`}>{subject.glyph}</div>
      <div>
        <h3>{subject.title}</h3>
        <span className={`chip ${status.tone}`}>
          {status.dot && <span className="dot">{status.dot}</span>}
          {status.label}
        </span>
        {canStart && (
          <>
            <br />
            <Link
              className="action btn-cta btn-cta--blue"
              href={href}
              onClick={(e) => e.stopPropagation()}
            >
              ▶ Начать
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function DailyCard({
  session,
  week,
  scheduled = true,
}: {
  session: DailySession;
  week: WeekDay[];
  /** false → на сегодня Daily не назначен (выходной/каникулы без назначения). */
  scheduled?: boolean;
}) {
  const total = session.subjects.length;
  const done = countSubmitted(session.subjects);
  const pct = Math.round((done / total) * 100);
  const remaining = total - done;

  const weekDone = week.filter((d) => d.mark === "done").length;

  return (
    <section className="daily card">
      <div className="daily-head">
        <div className="calendar-icon">📅</div>
        <h1>Daily на сегодня</h1>
        <div className="sparkles">✦</div>
      </div>

      <div className="progress-row">
        <div>
          <div className="progress-title">
            Готово <b>{done}</b> из <b>{total}</b> предметов
          </div>
          <div className="bar">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="daily-note">
          <span className="star">★</span>
          <span>
            {remaining > 0 ? (
              <>
                {leftVerb(remaining)} {remaining}{" "}
                {plural(remaining, ["предмет", "предмета", "предметов"])} —<br />
                ты почти у цели!
              </>
            ) : (
              <>Daily готов — ты молодец!</>
            )}
          </span>
        </div>
      </div>

      {scheduled ? (
        <div className="subjects">
          {session.subjects.map((s) => (
            <SubjectCell
              key={s.subjectId}
              subjectId={s.subjectId}
              status={statusToChip(s.status)}
            />
          ))}
        </div>
      ) : (
        <div className="daily-rest" role="status">
          <span className="daily-rest-glyph" aria-hidden="true">🏖️</span>
          <div>
            <b>Сегодня Daily нет!</b>
            <p>Отдыхай или загляни в олимпиадный мир — он открыт по расписанию.</p>
          </div>
        </div>
      )}

      <footer className="week">
        <div className="week-title">
          На этой неделе: <b>{weekDone}</b> Daily из <b>{week.length}</b>
        </div>
        <div className="days" aria-label="Неделя">
          {week.map((d) => (
            <div key={d.label} className={`day day-${d.mark}`}>
              <span>{d.label}</span>
              <i>{d.mark === "done" ? "✓" : d.mark === "future" ? "•••" : ""}</i>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
}
