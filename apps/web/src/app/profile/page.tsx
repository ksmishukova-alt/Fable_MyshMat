import Link from "next/link";
import { getSession, getCurrentChildId } from "@/lib/session";
import { fetchHomeData } from "@/lib/data";
import { starsBalance, getMascot, getBadges } from "@/lib/rewards-repo";
import { getTopicNodes } from "@/lib/olympiad-repo";
import { TOPICS } from "@/lib/olympiad-bank";
import { LEVEL_INFO } from "@/types/olympiad";
import { BadgeArt } from "@/components/BadgeArt";
import { SwitchProfileButton } from "@/components/SwitchProfileButton";
import { AvatarEditor } from "@/components/AvatarEditor";
import { AvatarView } from "@/components/AvatarView";
import { getAvatar } from "@/lib/avatar";
import "./profile.css";

export const dynamic = "force-dynamic";

/** Личный кабинет ребёнка: маскот, звёзды, значки, прогресс по темам. */
export default async function ProfilePage() {
  const session = await getSession();
  const childId = await getCurrentChildId();
  const [home, stars, mascot, badges, nodes, avatar] = await Promise.all([
    fetchHomeData(childId),
    starsBalance(childId),
    getMascot(childId),
    getBadges(childId),
    getTopicNodes(childId),
    getAvatar(childId),
  ]);
  const earned = badges.filter((b) => b.tier !== "none");

  return (
    <main className="pf-stage" aria-label="Личный кабинет">
      <div className="pf-wrap">
        <div className="pf-top">
          <Link className="pf-back" href="/" aria-label="На главную">
            ←
          </Link>
          <div className="pf-title">Мой кабинет</div>
        </div>

        <section className="pf-hero">
          <AvatarView config={avatar} size={150} />
          <div>
            <div className="pf-name">{session?.name ?? home.profile.name}</div>
            <div className="pf-grade">{home.profile.grade} класс · ступень Мыша {mascot.growthStage} из 5</div>
            <div className="pf-stat-row">
              <span className="pf-chip stars">⭐ {stars} звёзд</span>
              <span className="pf-chip badges">🏅 {badges.filter((b) => b.earned).length} из {badges.length} золотых медалей</span>
              <span className="pf-chip stickers">📒 {home.stickers.collected} из {home.stickers.total} наклеек</span>
            </div>
            <div className="pf-actions">
              <Link className="btn-cta btn-cta--blue" href="/rewards">
                Мои награды <span>▶</span>
              </Link>
              <SwitchProfileButton />
            </div>
          </div>
        </section>

        <section className="pf-card">
          <h2>Мой аватар</h2>
          <AvatarEditor initial={avatar} />
        </section>

        <section className="pf-card">
          <h2>Мой маршрут</h2>
          <div className="pf-topics">
            {TOPICS.map((t) => {
              const n = nodes.find((x) => x.topicId === t.id)!;
              const pct =
                n.totalOnLevel > 0 ? Math.round((n.solvedOnLevel / n.totalOnLevel) * 100) : 0;
              return (
                <div className="pf-topic" key={t.id}>
                  <BadgeArt topicId={t.id} tier={badges.find((b) => b.topicId === t.id)?.tier ?? "none"} size={40} />
                  <div>
                    <b>{t.title}</b>
                    <div className="bar">
                      <i style={{ inlineSize: n.mastered ? "100%" : `${pct}%` }} />
                    </div>
                  </div>
                  <span className="lvl">
                    {n.mastered
                      ? "Приручена!"
                      : n.state === "locked"
                        ? "Закрыта"
                        : `${LEVEL_INFO[n.level].short} · ${n.solvedOnLevel}/${n.totalOnLevel}`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {earned.length > 0 && (
          <section className="pf-card">
            <h2>Мои значки</h2>
            <div className="pf-badge-row">
              {earned.map((b) => (
                <div className="pf-badge-item" key={b.topicId}>
                  <BadgeArt topicId={b.topicId} tier={b.tier} size={62} />
                  <b>{b.title}</b>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
