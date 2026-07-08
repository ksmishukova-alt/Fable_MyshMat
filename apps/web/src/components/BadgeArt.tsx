/**
 * Медали достижений: объёмный вид с металлом трёх достоинств.
 * Механика: бронза — пройдена «Тренировка» (L1), серебро — «С поддержкой» (L2),
 * золото — тема освоена целиком (L3). Без медали — гравировка-контур.
 */

export type BadgeTier = "none" | "bronze" | "silver" | "gold";

/** металл: [обод-светлый, обод-тёмный, поле-светлое, поле-тёмное, гравировка] */
const METALS: Record<Exclude<BadgeTier, "none">, [string, string, string, string, string]> = {
  bronze: ["#e8a05c", "#8b5a2b", "#d98e48", "#a96a33", "#6e441d"],
  silver: ["#f2f4fa", "#9aa4b8", "#dde3ee", "#b4bccc", "#707a8e"],
  gold: ["#ffe27a", "#c8920a", "#ffd23e", "#e0a90f", "#8a6400"],
};

/** Символ темы (координаты 0..40, центр ~20,20). */
function TopicSymbol({ topicId, tone }: { topicId: string; tone: string }) {
  switch (topicId) {
    case "heads-legs":
      return (
        <g fill={tone}>
          <ellipse cx="20" cy="24" rx="7.5" ry="6.5" />
          <ellipse cx="15.8" cy="13.5" rx="2.8" ry="7" transform="rotate(-14 15.8 13.5)" />
          <ellipse cx="24.2" cy="13.5" rx="2.8" ry="7" transform="rotate(14 24.2 13.5)" />
        </g>
      );
    case "counting-figures":
      return (
        <g stroke={tone} strokeWidth="2.4" fill="none" strokeLinejoin="round">
          <path d="M13 27 L20 13 L27 27 Z" />
          <rect x="17.5" y="19.5" width="11" height="10" rx="1" />
        </g>
      );
    case "parity":
      return (
        <g stroke={tone} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <line x1="20" y1="11" x2="20" y2="28" />
          <line x1="10" y1="15" x2="30" y2="15" />
          <path d="M10 15 L7 22 A3.8 3.8 0 0 0 13 22 Z" fill={tone} stroke="none" />
          <path d="M30 15 L27 22 A3.8 3.8 0 0 0 33 22 Z" fill={tone} stroke="none" />
          <line x1="15" y1="29" x2="25" y2="29" />
        </g>
      );
    case "logic":
      return (
        <path
          d="M13 13h5a3 3 0 1 1 4.5 0h5v5a3 3 0 1 0 0 4.5v6h-6a3 3 0 1 1-4.5 0h-4v-5a3 3 0 1 1 0-5.5Z"
          fill={tone}
        />
      );
    case "dirichlet":
      return (
        <path
          d="M11 22 Q16 13 25 14.5 Q23.4 17 21 18 Q28.5 18.6 31 15.5 Q30 23 23 25.5 Q17 28 11.8 24.8 Z"
          fill={tone}
        />
      );
    default:
      return <circle cx="20" cy="20" r="7.5" fill={tone} />;
  }
}

export function BadgeArt({
  topicId,
  tier,
  size = 64,
  earned,
  color: _color,
}: {
  topicId: string;
  tier?: BadgeTier;
  size?: number;
  /** обратная совместимость: earned=true без tier → золото */
  earned?: boolean;
  color?: string;
}) {
  const t: BadgeTier = tier ?? (earned ? "gold" : "none");
  const uid = `bm-${topicId}-${t}`;

  if (t === "none") {
    return (
      <svg width={size} height={(size * 60) / 52} viewBox="0 0 52 60" aria-hidden="true">
        <circle cx="26" cy="32" r="20" fill="#eef1f6" stroke="#c9d3e2" strokeWidth="2.5" strokeDasharray="5 4" />
        <g transform="translate(6 12)" opacity="0.45">
          <TopicSymbol topicId={topicId} tone="#8b96ab" />
        </g>
      </svg>
    );
  }

  const [rimL, rimD, faceL, faceD, engrave] = METALS[t];
  return (
    <svg
      width={size}
      height={(size * 60) / 52}
      viewBox="0 0 52 60"
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 4px 7px ${rimD}66)` }}
    >
      <defs>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={rimL} />
          <stop offset="1" stopColor={rimD} />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor={faceL} />
          <stop offset="1" stopColor={faceD} />
        </radialGradient>
      </defs>
      {/* лента */}
      <path d="M17 4 L26 18 L35 4 L28.5 4 L26 8.5 L23.5 4 Z" fill="#2e77e6" />
      <path d="M17 4 L23.5 4 L26 8.5 L21.5 15 Z" fill="#1c5cc4" />
      {/* объём: нижняя толщина */}
      <circle cx="26" cy="34" r="20" fill={rimD} />
      {/* обод */}
      <circle cx="26" cy="32" r="20" fill={`url(#${uid}-rim)`} />
      {/* поле медали */}
      <circle cx="26" cy="32" r="15.5" fill={`url(#${uid}-face)`} stroke={rimD} strokeWidth="1" />
      {/* насечка обода */}
      <circle cx="26" cy="32" r="17.8" fill="none" stroke={rimD} strokeWidth="0.8" strokeDasharray="1.6 2.2" opacity="0.6" />
      {/* символ темы: тень + гравировка */}
      <g transform="translate(6.6 12.6)" opacity="0.35">
        <TopicSymbol topicId={topicId} tone="#ffffff" />
      </g>
      <g transform="translate(6 12)">
        <TopicSymbol topicId={topicId} tone={engrave} />
      </g>
      {/* блик */}
      <ellipse cx="19" cy="24" rx="9" ry="5.5" fill="#ffffff" opacity="0.35" transform="rotate(-24 19 24)" />
    </svg>
  );
}
