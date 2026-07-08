/**
 * Составной SVG-аватар ребёнка (мальчик/девочка): тон кожи, причёска,
 * цвет волос, одежда, аксессуар. Флэт-стиль в палитре проекта.
 */
import {
  SKIN_TONES,
  HAIR_COLORS,
  OUTFIT_COLORS,
  type AvatarConfig,
} from "@/lib/avatar";

export function AvatarView({ config, size = 48 }: { config: AvatarConfig; size?: number }) {
  const skin = SKIN_TONES[config.skin] ?? SKIN_TONES.light;
  const hair = HAIR_COLORS[config.hair] ?? HAIR_COLORS.brown;
  const outfit = OUTFIT_COLORS[config.outfit] ?? OUTFIT_COLORS.blue;
  const girl = config.kind === "girl";

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <clipPath id="av-clip">
          <circle cx="40" cy="40" r="39" />
        </clipPath>
      </defs>
      <circle cx="40" cy="40" r="39" fill="#e9f3ff" />
      <g clipPath="url(#av-clip)">
        {/* плечи / одежда */}
        <path d="M12 80 Q14 56 40 56 Q66 56 68 80 Z" fill={outfit.main} />
        <path d="M30 58 Q40 63 50 58 L48 66 Q40 70 32 66 Z" fill={outfit.dark} />
        <line x1="35" y1="63" x2="34.4" y2="71" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        <line x1="45" y1="63" x2="45.6" y2="71" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        {/* шея */}
        <rect x="35" y="48" width="10" height="10" rx="4" fill={skin.dark} />

        {/* волосы сзади (девочка: распущенные/косички) */}
        {girl && config.style === "long" && (
          <path d="M17 34 Q16 62 24 66 L56 66 Q64 62 63 34 Q60 16 40 16 Q20 16 17 34 Z" fill={hair.main} />
        )}
        {girl && config.style === "braids" && (
          <g>
            <path d="M20 36 Q16 50 19 60" stroke={hair.main} strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M60 36 Q64 50 61 60" stroke={hair.main} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="19" cy="61" r="3.4" fill="#f45d9e" />
            <circle cx="61" cy="61" r="3.4" fill="#f45d9e" />
          </g>
        )}
        {girl && config.style === "buns" && (
          <g>
            <circle cx="19" cy="20" r="8.5" fill={hair.main} />
            <circle cx="61" cy="20" r="8.5" fill={hair.main} />
            <circle cx="19" cy="20" r="3.4" fill={hair.dark} />
            <circle cx="61" cy="20" r="3.4" fill={hair.dark} />
          </g>
        )}

        {/* голова */}
        <ellipse cx="40" cy="35" rx="17.5" ry="18" fill={skin.main} />
        {/* уши */}
        <circle cx="22.6" cy="36" r="3.4" fill={skin.main} />
        <circle cx="57.4" cy="36" r="3.4" fill={skin.main} />

        {/* чёлка/причёска спереди */}
        {girl ? (
          <path
            d="M22 34 Q21 15 40 15 Q59 15 58 34 Q56 24 49 23 Q52 27 50 30 Q44 20 33 23 Q26 25 24 32 Q23 33 22 34 Z"
            fill={hair.main}
          />
        ) : config.style === "spiky" ? (
          <path
            d="M22 30 L25 21 L29 27 L33 18 L38 25 L43 17 L47 24 L52 19 L55 27 L58 30 Q56 18 40 15 Q24 18 22 30 Z"
            fill={hair.main}
          />
        ) : config.style === "curly" ? (
          <g fill={hair.main}>
            <circle cx="27" cy="24" r="6.5" />
            <circle cx="35" cy="20" r="7" />
            <circle cx="45" cy="20" r="7" />
            <circle cx="53" cy="24" r="6.5" />
            <path d="M22 32 Q22 22 40 20 Q58 22 58 32 Q54 24 40 24 Q26 24 22 32 Z" />
          </g>
        ) : (
          <path d="M22 32 Q21 16 40 15 Q59 16 58 32 Q54 22 40 22 Q26 22 22 32 Z" fill={hair.main} />
        )}

        {/* брови и глаза */}
        <path d="M29 28.5 Q32.5 26.8 36 28.2 M44 28.2 Q47.5 26.8 51 28.5" stroke={hair.dark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="32.5" cy="33.5" r="2.8" fill="#22304f" />
        <circle cx="47.5" cy="33.5" r="2.8" fill="#22304f" />
        <circle cx="33.5" cy="32.6" r="1" fill="#fff" />
        <circle cx="48.5" cy="32.6" r="1" fill="#fff" />
        {/* нос и улыбка */}
        <path d="M40 36 Q41.4 39 39.6 40.6" stroke={skin.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M34 44 Q40 49 46 44" stroke="#b9556f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* щёчки */}
        <circle cx="27.5" cy="40" r="3" fill="#f8a5bd" opacity="0.55" />
        <circle cx="52.5" cy="40" r="3" fill="#f8a5bd" opacity="0.55" />

        {/* аксессуары */}
        {config.acc === "glasses" && (
          <g stroke="#173a7a" strokeWidth="2" fill="rgba(127,195,255,.26)">
            <circle cx="32.5" cy="33.5" r="6.4" />
            <circle cx="47.5" cy="33.5" r="6.4" />
            <line x1="38.9" y1="33.5" x2="41.1" y2="33.5" />
            <line x1="26.1" y1="32" x2="23" y2="31" />
            <line x1="53.9" y1="32" x2="57" y2="31" />
          </g>
        )}
        {config.acc === "bow" && (
          <g>
            <path d="M48 16 L56 11 L56 21 Z" fill="#f45d9e" />
            <path d="M64 16 L56 11 L56 21 Z" fill="#e8437f" />
            <circle cx="56" cy="16" r="2.6" fill="#ffd0e2" />
          </g>
        )}
        {config.acc === "cap" && (
          <g>
            <path d="M23 24 Q40 10 57 24 L57 28 Q40 20 23 28 Z" fill={outfit.dark} />
            <rect x="51" y="22" width="14" height="5" rx="2.5" fill={outfit.main} />
            <circle cx="40" cy="13" r="2.4" fill="#ffc12d" />
          </g>
        )}
        {config.acc === "star" && (
          <path
            d="M58 12 l2 4.4 4.8 .5 -3.6 3.2 1 4.7 -4.2 -2.4 -4.2 2.4 1 -4.7 -3.6 -3.2 4.8 -.5 Z"
            fill="#ffc12d"
            stroke="#e09a00"
            strokeWidth="1"
          />
        )}
      </g>
    </svg>
  );
}
