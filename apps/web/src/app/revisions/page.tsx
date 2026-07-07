import Link from "next/link";
import { getRevisionDetails } from "@/lib/mock-data";
import { SUBJECTS } from "@/types/domain";
import "./revisions.css";

export default function RevisionsPage() {
  const items = getRevisionDetails();
  return (
    <main className="rev-stage" aria-label="Мои доработки">
      <div className="rev-wrap">
        <header className="rev-top">
          <Link className="rev-back" href="/">← На главную</Link>
          <h1>Мои доработки</h1>
          <span className="rev-badge">{items.length}</span>
        </header>
        <p className="rev-intro">Задания, которые методист попросил доработать. Без спешки — закрепи и стань увереннее 💪</p>
        <ul className="rev-list">
          {items.map((it) => (
            <li key={it.taskId}>
              <Link className="rev-item" href={`/daily/${it.subjectId}/${it.taskId}`}>
                <span className={`rev-ico s-${it.subjectId}`}>{SUBJECTS[it.subjectId].glyph}</span>
                <span className="rev-item-body">
                  <span className="rev-item-title">{it.title}</span>
                  <span className="rev-item-subject">{SUBJECTS[it.subjectId].title}</span>
                  <span className="rev-feedback">💬 {it.feedback}</span>
                </span>
                <span className="rev-cta">Исправить ›</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
