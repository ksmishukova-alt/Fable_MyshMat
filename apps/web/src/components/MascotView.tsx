/**
 * Маскот-тамагочи (награды): рисованный векторный Мыш в синей толстовке —
 * единый изобразительный язык с аватарами и наклейками (решение аудита №3).
 * Наряды из лавки — SVG-слои в той же системе координат, сидят органично.
 * Фото-Мыш остаётся на главной и входе (герой бренда).
 */
export function MascotView({
  stage,
  equipped,
  size = 180,
}: {
  stage: number;
  equipped: string[];
  size?: number;
}) {
  const scale = 0.82 + stage * 0.045; // ступень роста слегка увеличивает маскота
  return (
    <div
      className="mascot-view"
      style={{ inlineSize: size, blockSize: size }}
      aria-label={`Маскот, ступень роста ${stage}`}
    >
      <svg
        className="mascot-layers mascot-drawn"
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{ transform: `scale(${scale})` }}
      >
        {/* фон-кружок */}
        <circle cx="50" cy="50" r="49" fill="#e9f3ff" />
        {/* хвост */}
        <path
          d="M78 82 Q94 78 92 64"
          stroke="#b9c6d6"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* плащ — ПОД телом */}
        {equipped.includes("cape-purple") && (
          <path
            className="layer-cape"
            d="M24 56 Q14 78 20 94 L38 86 Q30 72 34 58 Z M76 56 Q86 78 80 94 L62 86 Q70 72 66 58 Z"
            fill="#7c3aed"
            opacity="0.92"
          />
        )}
        {/* уши */}
        <circle cx="29" cy="19" r="12.5" fill="#b9c6d6" />
        <circle cx="71" cy="19" r="12.5" fill="#b9c6d6" />
        <circle cx="29" cy="19" r="6.5" fill="#f3b8c6" />
        <circle cx="71" cy="19" r="6.5" fill="#f3b8c6" />
        {/* тело — синяя толстовка */}
        <path d="M20 96 Q20 62 50 62 Q80 62 80 96 Z" fill="#2e77e6" />
        <path d="M38 65 Q50 71 62 65 L60 74 Q50 78 40 74 Z" fill="#1c5cc4" />
        <line x1="45" y1="70" x2="44" y2="80" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <line x1="55" y1="70" x2="56" y2="80" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        {/* лапки */}
        <ellipse cx="34" cy="95" rx="8" ry="4.5" fill="#93a3b8" />
        <ellipse cx="66" cy="95" rx="8" ry="4.5" fill="#93a3b8" />
        {/* голова */}
        <ellipse cx="50" cy="40" rx="24" ry="22" fill="#b9c6d6" />
        <ellipse cx="50" cy="49" rx="14" ry="10" fill="#ffffff" opacity="0.9" />
        {/* глаза (совпадают с очками-слоем) */}
        <circle cx="38" cy="38" r="3.4" fill="#22304f" />
        <circle cx="62" cy="38" r="3.4" fill="#22304f" />
        <circle cx="39.2" cy="36.8" r="1.2" fill="#fff" />
        <circle cx="63.2" cy="36.8" r="1.2" fill="#fff" />
        {/* нос и улыбка */}
        <ellipse cx="50" cy="45.5" rx="3.4" ry="2.6" fill="#f45d9e" />
        <path d="M44 52 Q50 56.5 56 52" stroke="#8496ad" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* усы */}
        <path d="M22 42 L34 43 M22 48 L34 46 M78 42 L66 43 M78 48 L66 46" stroke="#93a3b8" strokeWidth="1.6" strokeLinecap="round" />
        {/* щёчки */}
        <circle cx="33" cy="46" r="3.4" fill="#f8a5bd" opacity="0.55" />
        <circle cx="67" cy="46" r="3.4" fill="#f8a5bd" opacity="0.55" />

        {/* ── наряды из лавки (те же координаты, что раньше) ── */}
        {equipped.includes("scarf-orange") && (
          <g className="layer-scarf">
            <rect x="30" y="58" width="40" height="9" rx="4.5" fill="#ff8a1e" />
            <rect x="52" y="64" width="10" height="18" rx="5" fill="#ffa54d" />
          </g>
        )}
        {equipped.includes("cap-blue") && (
          <g className="layer-cap">
            <path d="M28 22 Q50 4 72 22 L72 30 Q50 20 28 30 Z" fill="#2367f2" />
            <rect x="63" y="24" width="22" height="7" rx="3.5" fill="#1a52c4" />
          </g>
        )}
        {equipped.includes("crown") && (
          <path
            className="layer-crown"
            d="M32 20 L38 8 L46 17 L54 6 L62 17 L70 8 L74 20 Q53 13 32 20 Z"
            fill="#ffc12d"
            stroke="#e09a00"
            strokeWidth="1.5"
          />
        )}
        {equipped.includes("glasses") && (
          <g className="layer-glasses" stroke="#173a7a" strokeWidth="2.4" fill="rgba(255,255,255,.35)">
            <circle cx="38" cy="38" r="8" />
            <circle cx="62" cy="38" r="8" />
            <line x1="46" y1="38" x2="54" y2="38" />
          </g>
        )}
        {equipped.includes("flag") && (
          <g className="layer-flag">
            <line x1="84" y1="46" x2="84" y2="88" stroke="#8a5a2b" strokeWidth="3" />
            <path d="M84 46 L98 51 L84 57 Z" fill="#ef4b6e" />
          </g>
        )}
      </svg>
      {stage >= 3 && <span className="mascot-sparkle s1">✦</span>}
      {stage >= 4 && <span className="mascot-sparkle s2">✦</span>}
      {stage >= 5 && <span className="mascot-sparkle s3">★</span>}
    </div>
  );
}

/** Векторное превью товара лавки (тот же арт, что надевается на маскота). */
export function ItemArt({ art, size = 40 }: { art: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true"
      style={{ filter: "drop-shadow(0 2px 4px rgba(40,60,110,.2))" }}>
      {art === "cap-blue" && (
        <g>
          <path d="M8 26 Q8 10 24 10 Q40 10 40 26 Z" fill="#2367f2" />
          <path d="M21 10.5 Q24 8.5 27 10.5 L26 26 H22 Z" fill="#1a52c4" />
          <rect x="30" y="23" width="16" height="6" rx="3" fill="#1a52c4" />
          <circle cx="24" cy="8" r="2.5" fill="#ffc12d" />
        </g>
      )}
      {art === "scarf-orange" && (
        <g>
          <rect x="8" y="16" width="32" height="9" rx="4.5" fill="#ff8a1e" />
          <rect x="24" y="22" width="9" height="18" rx="4.5" fill="#ffa54d" />
          <path d="M26 36 H31 M26 32 H31" stroke="#e87700" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {art === "glasses" && (
        <g stroke="#173a7a" strokeWidth="2.6" fill="rgba(127,195,255,.35)">
          <circle cx="15" cy="24" r="8.5" />
          <circle cx="33" cy="24" r="8.5" />
          <line x1="23.5" y1="24" x2="24.5" y2="24" />
          <line x1="6.5" y1="22" x2="2" y2="19" />
          <line x1="41.5" y1="22" x2="46" y2="19" />
        </g>
      )}
      {art === "crown" && (
        <path d="M8 34 L6 14 L16 22 L24 8 L32 22 L42 14 L40 34 Q24 30 8 34 Z"
          fill="#ffc12d" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />
      )}
      {art === "cape-purple" && (
        <g>
          <path d="M14 8 Q24 4 34 8 L40 40 Q24 34 8 40 Z" fill="#7c3aed" />
          <path d="M14 8 Q24 12 34 8 L33 14 Q24 17 15 14 Z" fill="#5b21b6" />
        </g>
      )}
      {art === "flag" && (
        <g>
          <line x1="14" y1="6" x2="14" y2="42" stroke="#8a5a2b" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M14 8 L38 13 L14 20 Z" fill="#ef4b6e" />
        </g>
      )}
    </svg>
  );
}
