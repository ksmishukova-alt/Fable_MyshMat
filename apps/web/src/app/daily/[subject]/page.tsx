import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchSubjectTasks } from "@/lib/data";
import { getCurrentChildId } from "@/lib/session";
import { SUBJECTS, type SubjectId } from "@/types/domain";
import { statusToChip, modeLabel, modeIcon, plural } from "@/lib/status";
import "./subject.css";

const VALID: SubjectId[] = ["math", "russian", "reading", "english"];

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  if (!VALID.includes(subject as SubjectId)) notFound();

  const subjectId = subject as SubjectId;
  const meta = SUBJECTS[subjectId];
  const childId = await getCurrentChildId();
  const tasks = await fetchSubjectTasks(subjectId, childId);

  return (
    <main className="subject-stage" aria-label={`Задания: ${meta.title}`}>
      <div className="subject-board">
        <header className="subject-top">
          <Link className="screen-back" href="/" aria-label="На главную">←</Link>
          <div className="subject-head">
            <span className={`subject-glyph s-${subjectId}`}>{meta.glyph}</span>
            <h1>{meta.title}</h1>
          </div>
          <div className="subject-count">
            {tasks.length} {plural(tasks.length, ["задание", "задания", "заданий"])}
          </div>
        </header>

        <ul className="task-list">
          {tasks.map((t) => {
            const chip = statusToChip(t.status);
            return (
              <li key={t.id}>
                <Link className="task" href={`/daily/${subjectId}/${t.id}`}>
                  <span className="task-mode" title={modeLabel(t.mode)}>
                    {modeIcon(t.mode)}
                  </span>
                  <span className="task-body">
                    <span className="task-title">{t.title}</span>
                    <span className="task-meta">
                      <span className="task-pill">{modeLabel(t.mode)}</span>
                      {t.estMinutes && <span className="task-time">⏱ {t.estMinutes} мин</span>}
                    </span>
                  </span>
                  <span className={`task-chip ${chip.tone}`}>
                    {chip.dot && <span className="d">{chip.dot}</span>}
                    {chip.label}
                  </span>
                  <span className="task-arrow">›</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
