import Link from "next/link";
import type { WorldState } from "@/types/domain";

/**
 * Игровой мир. Все зоны открываются одним событием — получением МышРутки
 * (когда все предметы Daily доведены до submitted).
 *
 * Когда world.unlocked === false: карточки в состоянии .is-locked
 * (блюр + подпись «Откроется после Daily»), клики отключены.
 */

const LOCK_NOTE = "Откроется после Daily";

export function RouteRow({ world }: { world: WorldState }) {
  const locked = !world.unlocked;
  const lockedClass = locked ? " is-locked" : "";

  return (
    <div className="route">
      <CardOrLink locked={locked} href="/topics" className={`route-card route-map${lockedClass}`}>
        <h2>Олимпиадный маршрут</h2>
        <div className="closed">{locked ? LOCK_NOTE : "Открыть карту тем"}</div>
      </CardOrLink>
    </div>
  );
}

/**
 * Мир в правой колонке: широкая карточка сундука + пара «Дуэли / Награды».
 * Рендерится как прямые дети .right-col.
 */
export function WorldCards({ world }: { world: WorldState }) {
  const locked = !world.unlocked;
  const lockedClass = locked ? " is-locked" : "";
  const duelsOn = world.features.duels;

  return (
    <>
      <CardOrLink locked={locked} href="/chests" className={`mini card chest${lockedClass}`}>
        <h3>Сундуки</h3>
        <p>{locked ? "Награда после Daily ждёт!" : "Открой награды"}</p>
        <div className="closed" />
        <img className="mini-art" src="/myshmat-assets/chest-large.png" alt="" aria-hidden="true" />
      </CardOrLink>

      <div className="world-pair">
        <CardOrLink
          locked={!duelsOn}
          href="/duels"
          className={`mini card duel${duelsOn ? "" : " is-locked"}`}
        >
          <h3>Дуэли</h3>
          <img className="mini-art" src="/myshmat-assets/duel-large.png" alt="" aria-hidden="true" />
        </CardOrLink>

        <CardOrLink locked={locked} href="/rewards" className={`mini card trophy${lockedClass}`}>
          <h3>Награды</h3>
          <TrophyArt />
        </CardOrLink>
      </div>
    </>
  );
}

/** SVG-кубок (в проекте нет trophy-png; арт согласован как SVG). */
function TrophyArt() {
  return (
    <svg
      className="mini-art"
      viewBox="0 0 120 120"
      aria-hidden="true"
      style={{ inlineSize: "clamp(70px, 40cqw, 120px)" }}
    >
      <defs>
        <linearGradient id="trophy-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd84a" />
          <stop offset="1" stopColor="#ff9b17" />
        </linearGradient>
      </defs>
      <path
        d="M35 22h50v8c14 0 18 4 18 12 0 12-10 20-20 21-4 9-11 15-18 17v10h12a6 6 0 0 1 6 6v4H37v-4a6 6 0 0 1 6-6h12v-10c-7-2-14-8-18-17-10-1-20-9-20-21 0-8 4-12 18-12v-8Z"
        fill="url(#trophy-gold)"
        stroke="#d97a06"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M48 40l8 6-3 10 7-6 7 6-3-10 8-6H62l-2-10-2 10H48Z" fill="#fff7df" opacity="0.9" />
    </svg>
  );
}

/** Когда разблокировано — кликабельная ссылка; когда заблокировано — статичная карточка. */
function CardOrLink({
  locked,
  href,
  className,
  children,
}: {
  locked: boolean;
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (locked) {
    return (
      <article className={className} aria-disabled="true">
        {children}
      </article>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
