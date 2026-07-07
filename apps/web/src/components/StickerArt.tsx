/**
 * Наклейки: 24 векторных мини-иллюстрации (флэт-стиль, viewBox 64×64).
 * Вместо эмодзи — настоящий SVG-арт в палитре проекта.
 */

function Sticker({ art }: { art: string }) {
  switch (art) {
    // ── Мышиный город ──
    case "mouse-hoodie":
      return (
        <g>
          <circle cx="20" cy="18" r="9" fill="#b9c6d6" />
          <circle cx="44" cy="18" r="9" fill="#b9c6d6" />
          <circle cx="20" cy="18" r="4.5" fill="#f3b8c6" />
          <circle cx="44" cy="18" r="4.5" fill="#f3b8c6" />
          <path d="M12 40 Q12 22 32 22 Q52 22 52 40 Q52 52 32 52 Q12 52 12 40 Z" fill="#cdd8e4" />
          <path d="M14 44 Q14 34 32 34 Q50 34 50 44 L50 50 Q32 56 14 50 Z" fill="#2e77e6" />
          <circle cx="25" cy="32" r="2.6" fill="#22304f" />
          <circle cx="39" cy="32" r="2.6" fill="#22304f" />
          <ellipse cx="32" cy="39" rx="3.4" ry="2.6" fill="#f45d9e" />
        </g>
      );
    case "mouse-cheese":
      return (
        <g>
          <path d="M6 44 L58 28 L58 48 L6 48 Z" fill="#ffce3d" />
          <path d="M6 44 L58 28 L54 24 L8 40 Z" fill="#ffe37a" />
          <circle cx="24" cy="43" r="3.4" fill="#e0a400" />
          <circle cx="40" cy="39" r="2.6" fill="#e0a400" />
          <circle cx="49" cy="42" r="2" fill="#e0a400" />
        </g>
      );
    case "mouse-bus":
      return (
        <g>
          <rect x="6" y="18" width="52" height="26" rx="7" fill="#ffb020" />
          <rect x="11" y="23" width="12" height="9" rx="2.5" fill="#cfeaff" />
          <rect x="26" y="23" width="12" height="9" rx="2.5" fill="#cfeaff" />
          <rect x="41" y="23" width="12" height="9" rx="2.5" fill="#cfeaff" />
          <rect x="6" y="36" width="52" height="4" fill="#e88f00" />
          <circle cx="18" cy="46" r="5.5" fill="#2b3550" />
          <circle cx="46" cy="46" r="5.5" fill="#2b3550" />
          <circle cx="18" cy="46" r="2.3" fill="#8fa2c0" />
          <circle cx="46" cy="46" r="2.3" fill="#8fa2c0" />
        </g>
      );
    case "mouse-house":
      return (
        <g>
          <path d="M8 30 L32 10 L56 30 Z" fill="#e8556b" />
          <rect x="14" y="30" width="36" height="24" fill="#ffd9a8" />
          <rect x="27" y="38" width="10" height="16" rx="1.5" fill="#8a5a2b" />
          <rect x="18" y="34" width="8" height="8" rx="1.5" fill="#cfeaff" />
          <rect x="40" y="34" width="8" height="8" rx="1.5" fill="#cfeaff" />
        </g>
      );
    case "mouse-lamp":
      return (
        <g>
          <circle cx="32" cy="26" r="14" fill="#ffe37a" />
          <path d="M22 36 Q32 44 42 36 L40 44 H24 Z" fill="#ffce3d" />
          <rect x="26" y="44" width="12" height="7" rx="2" fill="#8fa2c0" />
          <path d="M32 8 V2 M14 12 L10 8 M50 12 L54 8 M10 26 H4 M60 26 H54" stroke="#ffb020" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "mouse-book":
      return (
        <g>
          <path d="M10 12 H30 Q33 12 33 15 V52 Q33 49 30 49 H10 Z" fill="#e8556b" />
          <path d="M54 12 H34 Q31 12 31 15 V52 Q31 49 34 49 H54 Z" fill="#ff8ba5" />
          <path d="M15 20 H27 M15 27 H27 M37 20 H49 M37 27 H49" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "mouse-cap":
      return (
        <g>
          <path d="M10 34 Q10 16 32 16 Q54 16 54 34 Z" fill="#2e77e6" />
          <path d="M28 16.5 Q32 14 36 16.5 L34 34 H30 Z" fill="#1c5cc4" />
          <rect x="42" y="30" width="20" height="7" rx="3.5" fill="#1c5cc4" />
          <circle cx="32" cy="13" r="3" fill="#ffce3d" />
        </g>
      );
    case "mouse-medal":
      return (
        <g>
          <path d="M22 6 L32 24 L42 6 L52 6 L38 30 H26 L12 6 Z" fill="#e8556b" />
          <circle cx="32" cy="41" r="14" fill="#ffce3d" stroke="#e09a00" strokeWidth="2.5" />
          <path d="M32 33 l2.5 4.6 5.2 .8 -3.8 3.6 .9 5.1 -4.8 -2.4 -4.8 2.4 .9 -5.1 -3.8 -3.6 5.2 -.8 Z" fill="#fff7df" />
        </g>
      );
    // ── Космос ──
    case "space-rocket":
      return (
        <g>
          <path d="M32 4 Q44 16 44 32 Q44 42 40 48 H24 Q20 42 20 32 Q20 16 32 4 Z" fill="#e8eef6" />
          <circle cx="32" cy="26" r="6" fill="#7fc3ff" stroke="#2e77e6" strokeWidth="2" />
          <path d="M24 40 L12 52 L22 50 Z" fill="#e8556b" />
          <path d="M40 40 L52 52 L42 50 Z" fill="#e8556b" />
          <path d="M28 48 Q32 60 36 48 Z" fill="#ffb020" />
        </g>
      );
    case "space-planet":
      return (
        <g>
          <circle cx="32" cy="32" r="15" fill="#b98ef7" />
          <circle cx="26" cy="27" r="3.4" fill="#9a63e8" />
          <circle cx="37" cy="37" r="2.6" fill="#9a63e8" />
          <ellipse cx="32" cy="34" rx="26" ry="7" fill="none" stroke="#ffb020" strokeWidth="3.4" transform="rotate(-16 32 34)" />
        </g>
      );
    case "space-star":
      return (
        <g>
          <path d="M32 6 l6.3 14.8 16 1.3 -12.2 10.5 3.7 15.6 -13.8 -8.3 -13.8 8.3 3.7 -15.6 -12.2 -10.5 16 -1.3 Z" fill="#ffce3d" stroke="#e09a00" strokeWidth="2" />
          <circle cx="27" cy="26" r="2" fill="#fff7df" />
        </g>
      );
    case "space-moon":
      return (
        <g>
          <path d="M40 6 A26 26 0 1 0 58 40 A20 20 0 0 1 40 6 Z" fill="#ffe37a" />
          <circle cx="26" cy="30" r="3.5" fill="#e6c34e" />
          <circle cx="34" cy="44" r="2.6" fill="#e6c34e" />
        </g>
      );
    case "space-comet":
      return (
        <g>
          <path d="M8 12 Q28 20 40 34 L34 40 Q20 28 8 12 Z" fill="#ffe37a" opacity="0.85" />
          <path d="M14 26 Q26 30 36 40 L33 43 Q22 34 14 26 Z" fill="#ffce3d" opacity="0.7" />
          <circle cx="42" cy="40" r="11" fill="#7fc3ff" stroke="#2e77e6" strokeWidth="2.4" />
          <circle cx="38" cy="37" r="2.6" fill="#cfeaff" />
        </g>
      );
    case "space-alien":
      return (
        <g>
          <ellipse cx="32" cy="30" rx="16" ry="19" fill="#8bd66a" />
          <ellipse cx="25" cy="28" rx="4.6" ry="6.5" fill="#22304f" />
          <ellipse cx="39" cy="28" rx="4.6" ry="6.5" fill="#22304f" />
          <circle cx="26.5" cy="25.8" r="1.4" fill="#fff" />
          <circle cx="40.5" cy="25.8" r="1.4" fill="#fff" />
          <path d="M27 42 Q32 46 37 42" stroke="#22304f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M20 12 Q24 16 26 13 M44 12 Q40 16 38 13" stroke="#5cb53a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      );
    case "space-telescope":
      return (
        <g>
          <rect x="10" y="18" width="36" height="12" rx="5" fill="#2e77e6" transform="rotate(-20 28 24)" />
          <rect x="42" y="8" width="10" height="9" rx="3.5" fill="#1c5cc4" transform="rotate(-20 47 12)" />
          <path d="M28 32 L18 54 M28 32 L38 54 M28 40 L28 54" stroke="#8fa2c0" strokeWidth="3.4" strokeLinecap="round" />
        </g>
      );
    case "space-suit":
      return (
        <g>
          <circle cx="32" cy="28" r="17" fill="#e8eef6" />
          <path d="M20 26 A12 12 0 0 1 44 26 V32 A12 12 0 0 1 20 32 Z" fill="#22304f" />
          <path d="M23 24 Q28 19 36 21" stroke="#7fc3ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <rect x="20" y="45" width="24" height="10" rx="5" fill="#cdd8e4" />
        </g>
      );
    // ── Математика ──
    case "math-pi":
      return (
        <g>
          <circle cx="32" cy="32" r="22" fill="#ffd9a8" />
          <path d="M18 24 Q22 20 46 22 M24 23 Q24 38 21 43 M40 23 Q39 36 42 41 Q44 43 46 41" stroke="#b8560a" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "math-cube":
      return (
        <g>
          <path d="M32 8 L52 18 V40 L32 50 L12 40 V18 Z" fill="#7fc3ff" />
          <path d="M32 8 L52 18 L32 28 L12 18 Z" fill="#a9d7ff" />
          <path d="M32 28 V50 L12 40 V18 Z" fill="#4f9be8" />
        </g>
      );
    case "math-infinity":
      return (
        <path
          d="M18 32 C18 24 28 24 32 32 C36 40 46 40 46 32 C46 24 36 24 32 32 C28 40 18 40 18 32 Z"
          fill="none"
          stroke="#6d2ee5"
          strokeWidth="6"
          strokeLinecap="round"
        />
      );
    case "math-compass":
      return (
        <g>
          <circle cx="32" cy="12" r="4.5" fill="#8fa2c0" />
          <path d="M30 15 L20 52 M34 15 L44 52" stroke="#2e77e6" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M44 52 Q33 44 21 51" stroke="#b8c6da" strokeWidth="2.4" fill="none" strokeDasharray="3 4" />
        </g>
      );
    case "math-abacus":
      return (
        <g>
          <rect x="10" y="10" width="44" height="44" rx="6" fill="none" stroke="#8a5a2b" strokeWidth="4" />
          <line x1="10" y1="22" x2="54" y2="22" stroke="#c9a26d" strokeWidth="2.4" />
          <line x1="10" y1="34" x2="54" y2="34" stroke="#c9a26d" strokeWidth="2.4" />
          <line x1="10" y1="46" x2="54" y2="46" stroke="#c9a26d" strokeWidth="2.4" />
          <circle cx="20" cy="22" r="4" fill="#e8556b" />
          <circle cx="30" cy="22" r="4" fill="#e8556b" />
          <circle cx="42" cy="34" r="4" fill="#2e77e6" />
          <circle cx="24" cy="46" r="4" fill="#ffb020" />
          <circle cx="34" cy="46" r="4" fill="#ffb020" />
        </g>
      );
    case "math-graph":
      return (
        <g>
          <path d="M32 10 L14 42 L50 22 L14 22 L50 42 Z" fill="none" stroke="#8fa2c0" strokeWidth="2.6" />
          {[
            [32, 10],
            [14, 42],
            [50, 22],
            [14, 22],
            [50, 42],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5.5" fill="#42c263" stroke="#209d39" strokeWidth="2" />
          ))}
        </g>
      );
    case "math-scale":
      return (
        <g stroke="#6d2ee5" strokeWidth="3" fill="none" strokeLinecap="round">
          <line x1="32" y1="10" x2="32" y2="46" />
          <line x1="12" y1="16" x2="52" y2="16" />
          <path d="M12 16 L6 30 A7.5 7.5 0 0 0 18 30 Z" fill="#b98ef7" stroke="none" />
          <path d="M52 16 L46 30 A7.5 7.5 0 0 0 58 30 Z" fill="#b98ef7" stroke="none" />
          <line x1="22" y1="48" x2="42" y2="48" strokeWidth="4" />
        </g>
      );
    case "math-key":
      return (
        <g>
          <circle cx="22" cy="22" r="12" fill="none" stroke="#ffb020" strokeWidth="6" />
          <path d="M30 30 L52 52 M45 45 L52 38 M39 39 L46 32" stroke="#ffb020" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx="32" cy="32" r="18" fill="#cfd8e6" />;
  }
}

export function StickerArt({ art, size = 44 }: { art: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 2px 4px rgba(40,60,110,.22))" }}
    >
      <Sticker art={art} />
    </svg>
  );
}
