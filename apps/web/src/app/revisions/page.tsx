import Link from "next/link";
import { getCurrentChildId } from "@/lib/session";
import { fetchHomeData } from "@/lib/data";
import { SUBJECTS } from "@/types/domain";
import "./revisions.css";

export const dynamic = "force-dynamic";

/** Мои доработки — реальные работы со статусом «на доработку» + комментарии методиста. */
export default async function RevisionsPage() {
  const childId = await getCurrentChildId();
  const { revisions } = await fetchHomeData(childId);
  const items = revisions.items;

  return (
    <main className="rev-stage" aria-label="Мои доработки">
      <div className="rev-wrap">
        <header className="rev-top">
          <Link className="screen-back" aria-label="На главную" href="/">←</Link>
          <h1>Мои доработки</h1>
          <span className="rev-badge">{items.length}</span>
        </header>
        {items.length === 0 ? (
          <p className="rev-intro">Здесь пусто — все работы приняты. Так держать!</p>
        ) : (
          <>
            <p className="rev-intro">
              Задания, которые методист попросил доработать. Без спешки — закрепи и стань увереннее!
            </p>
            <ul className="rev-list">
              {items.map((it) => (
                <li key={it.taskId}>
                  <Link className="rev-item" href={`/daily/${it.subjectId}/${it.taskId}`}>
                    <span className={`rev-ico s-${it.subjectId}`}>{SUBJECTS[it.subjectId].glyph}</span>
                    <span className="rev-item-body">
                      <span className="rev-item-title">{it.title ?? "Задание"}</span>
                      <span className="rev-item-subject">{SUBJECTS[it.subjectId].title}</span>
                      {it.feedback && <span className="rev-feedback">💬 {it.feedback}</span>}
                    </span>
                    <span className="rev-cta">Исправить ›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
