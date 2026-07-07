/**
 * Значки достижений (карта мышления): векторные щиты с символом темы.
 * Настоящий SVG-арт: градиентный щит, лента, звезда, блик; серый — не заработан.
 */

const TOPIC_COLORS: Record<string, [string, string]> = {
  blue: ["#63b4ff", "#1167e8"],
  purple: ["#a975ff", "#6234d8"],
  green: ["#86d953", "#209d39"],
  orange: ["#ffc35b", "#f08c00"],
  pink: ["#ff6ba7", "#e82377"],
};

/** Символ темы внутри щита (рисуется в системе координат 0..40, центр 20,17). */
function TopicSymbol({ topicId }: { topicId: string }) {
  switch (topicId) {
    case "heads-legs": // заяц: голова + уши
      return (
        <g fill="#fff" opacity="0.95">
          <ellipse cx="20" cy="21" rx="8" ry="7" />
          <ellipse cx="15.5" cy="10" rx="3" ry="7.5" transform="rotate(-14 15.5 10)" />
          <ellipse cx="24.5" cy="10" rx="3" ry="7.5" transform="rotate(14 24.5 10)" />
          <circle cx="17" cy="20" r="1.3" fill="#3a5" opacity="0.65" />
          <circle cx="23" cy="20" r="1.3" fill="#3a5" opacity="0.65" />
        </g>
      );
    case "parity": // весы
      return (
        <g stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <line x1="20" y1="8" x2="20" y2="26" />
          <line x1="9" y1="12" x2="31" y2="12" />
          <path d="M9 12 L5.5 20 A4.5 4.5 0 0 0 12.5 20 Z" fill="#fff" opacity="0.9" stroke="none" />
          <path d="M31 12 L27.5 20 A4.5 4.5 0 0 0 34.5 20 Z" fill="#fff" opacity="0.9" stroke="none" />
          <line x1="15" y1="27" x2="25" y2="27" />
        </g>
      );
    case "logic": // пазл
      return (
        <path
          d="M12 10h6a3.5 3.5 0 1 1 5 0h6v6a3.5 3.5 0 1 0 0 5v7h-7a3.5 3.5 0 1 1-5 0h-5v-6a3.5 3.5 0 1 1 0-6Z"
          fill="#fff"
          opacity="0.95"
        />
      );
    case "dirichlet": // голубь
      return (
        <g fill="#fff" opacity="0.95">
          <path d="M10 20 Q16 10 26 12 Q24 15 21 16 Q30 17 33 13 Q32 22 24 25 Q17 28 11 24 Z" />
          <circle cx="26.5" cy="13.5" r="1.1" fill="#3a5" opacity="0.7" />
          <path d="M13 25 L11 29 M17 26 L16 30" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
    case "counting-figures": // треугольник + квадрат
      return (
        <g stroke="#fff" strokeWidth="2.2" fill="none" strokeLinejoin="round">
          <path d="M14 25 L21 10 L28 25 Z" />
          <rect x="18" y="17" width="12" height="11" rx="1" fill="#fff" opacity="0.35" />
          <rect x="18" y="17" width="12" height="11" rx="1" />
        </g>
      );
    default:
      return <circle cx="20" cy="17" r="8" fill="#fff" opacity="0.9" />;
  }
}

export function BadgeArt({
  topicId,
  color,
  earned,
  size = 64,
}: {
  topicId: string;
  color: string;
  earned: boolean;
  size?: number;
}) {
  const [c1, c2] = earned ? (TOPIC_COLORS[color] ?? TOPIC_COLORS.blue) : ["#cfd8e6", "#9daabb"];
  const gid = `badge-${topicId}-${earned ? "on" : "off"}`;
  return (
    <svg
      width={size}
      height={(size * 56) / 48}
      viewBox="0 0 48 56"
      aria-hidden="true"
      style={{ filter: earned ? "drop-shadow(0 4px 8px rgba(27,72,124,.28))" : "none" }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* лента */}
      <path d="M14 38 L10 52 L17 48 L21 55 L24 42 Z" fill={earned ? "#e8556b" : "#b9c2d0"} />
      <path d="M34 38 L38 52 L31 48 L27 55 L24 42 Z" fill={earned ? "#c2314f" : "#a5b0c2"} />
      {/* щит */}
      <path
        d="M24 2 L42 8 V24 C42 34 34 41 24 45 C14 41 6 34 6 24 V8 Z"
        fill={`url(#${gid})`}
        stroke={earned ? "#ffffff" : "#e3e9f2"}
        strokeWidth="2.4"
      />
      {/* блик */}
      <path d="M24 4.5 L39.5 9.7 V15 C33 12 27 10.5 24 10.3 Z" fill="#fff" opacity="0.28" />
      {/* символ темы */}
      <g transform="translate(4 6)">
        <TopicSymbol topicId={topicId} />
      </g>
      {/* звезда снизу щита */}
      <path
        d="M24 33 l1.9 3.4 3.9 .6 -2.8 2.7 .7 3.8 -3.7 -1.8 -3.7 1.8 .7 -3.8 -2.8 -2.7 3.9 -.6 Z"
        fill={earned ? "#ffd84a" : "#e6ecf4"}
        stroke={earned ? "#e09a00" : "#c3cddb"}
        strokeWidth="1"
      />
    </svg>
  );
}
