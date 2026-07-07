import Link from "next/link";
import { getCurrentChildId } from "@/lib/session";
import { getTopicNodes } from "@/lib/olympiad-repo";
import { TOPICS } from "@/lib/olympiad-bank";
import { LEVEL_INFO } from "@/types/olympiad";
import "./topics.css";

export const dynamic = "force-dynamic";

/** Карта тем — олимпиадный маршрут. */
export default async function TopicsPage() {
  const childId = await getCurrentChildId();
  const nodes = await getTopicNodes(childId);

  return (
    <main className="map-stage" aria-label="Карта тем">
      <div className="map-top">
        <Link className="map-back" href="/" aria-label="На главную">
          ←
        </Link>
        <div>
          <div className="map-title">Олимпиадный маршрут</div>
          <div className="map-sub">Проходи темы в глубину: тренировка → с поддержкой → сам!</div>
        </div>
      </div>

      <div className="map-path">
        {TOPICS.map((t) => {
          const n = nodes.find((x) => x.topicId === t.id)!;
          const locked = n.state === "locked";
          const pct =
            n.totalOnLevel > 0 ? Math.round((n.solvedOnLevel / n.totalOnLevel) * 100) : 0;
          const inner = (
            <>
              <span className={`topic-glyph ${t.color}`} aria-hidden="true">
                {t.glyph}
              </span>
              <span className="topic-info">
                <h2>{t.title}</h2>
                <p>{t.description}</p>
                {!locked && (
                  <>
                    <span className="topic-level-row">
                      {([1, 2, 3] as const).map((lvl) => (
                        <span
                          key={lvl}
                          className={`level-chip l${lvl}${
                            n.mastered || n.level > lvl ? " done" : ""
                          }`}
                        >
                          {n.mastered || n.level > lvl ? "✓" : LEVEL_INFO[lvl].short}{" "}
                          {LEVEL_INFO[lvl].title}
                        </span>
                      ))}
                    </span>
                    <span className="topic-progress" aria-label={`Прогресс уровня: ${pct}%`}>
                      <i style={{ inlineSize: `${pct}%` }} />
                    </span>
                  </>
                )}
              </span>
              <span className="topic-state">
                <span className={`state-badge ${n.state}`} aria-hidden="true">
                  {n.mastered ? "🏅" : locked ? "🔒" : n.state === "inProgress" ? "⚡" : "▶"}
                </span>
                {n.mastered
                  ? "Приручена!"
                  : locked
                    ? "Закрыто"
                    : n.state === "inProgress"
                      ? `Уровень ${LEVEL_INFO[n.level].short}`
                      : "Можно начать"}
              </span>
              {locked && (
                <span className="lock-note">
                  Сначала: {t.dependsOn.map((d) => TOPICS.find((x) => x.id === d)?.title).join(", ")}
                </span>
              )}
            </>
          );

          return locked ? (
            <article key={t.id} className="topic-node locked" aria-disabled="true">
              {inner}
            </article>
          ) : (
            <Link key={t.id} className="topic-node" href={`/olympiad/${t.id}`}>
              {inner}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
