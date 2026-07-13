/**
 * Мини-иконки дизайн-системы (этап 3): единый векторный язык вместо эмодзи.
 * Рисуются currentColor — наследуют цвет текста/чипа.
 */

function Base({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.18em", flex: "0 0 auto" }}
    >
      {children}
    </svg>
  );
}

/** Мышь (маскот) */
export function MouseIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="7" cy="7" r="3.6" fill="currentColor" opacity="0.55" />
      <circle cx="17" cy="7" r="3.6" fill="currentColor" opacity="0.55" />
      <ellipse cx="12" cy="14" rx="7.2" ry="6.4" fill="currentColor" />
      <circle cx="9.4" cy="13" r="1" fill="#fff" />
      <circle cx="14.6" cy="13" r="1" fill="#fff" />
      <ellipse cx="12" cy="16" rx="1.3" ry="1" fill="#fff" opacity="0.85" />
    </Base>
  );
}

/** Лавка */
export function ShopIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M4 9 L5.4 4.5 H18.6 L20 9 Z" fill="currentColor" opacity="0.6" />
      <path d="M5 9 H19 V18.5 A1.5 1.5 0 0 1 17.5 20 H6.5 A1.5 1.5 0 0 1 5 18.5 Z" fill="currentColor" />
      <rect x="9.4" y="13" width="5.2" height="7" rx="1" fill="#fff" opacity="0.85" />
    </Base>
  );
}

/** Медаль */
export function MedalIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M8 3 L12 9.5 L16 3 H12.8 L12 4.6 L11.2 3 Z" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="14.5" r="6" fill="currentColor" />
      <path d="M12 11.3 l1 2 2.2 .3 -1.6 1.5 .4 2.2 -2 -1.1 -2 1.1 .4 -2.2 -1.6 -1.5 2.2 -.3 Z" fill="#fff" opacity="0.9" />
    </Base>
  );
}

/** Загадка/мышление */
export function BrainIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path
        d="M12 3.5 a5.5 5.5 0 0 1 5.5 5.5 c0 2 -1 3.3 -2 4.4 -.7 .8 -1 1.6 -1 2.6 H9.5 c0 -1 -.3 -1.8 -1 -2.6 -1 -1.1 -2 -2.4 -2 -4.4 A5.5 5.5 0 0 1 12 3.5 Z"
        fill="currentColor"
      />
      <rect x="9.5" y="17.5" width="5" height="2" rx="1" fill="currentColor" opacity="0.7" />
      <path d="M11 8 h2 M12 8 v3.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  );
}

/** Звезда (валюта) */
export function StarIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path
        d="M12 2.6 l2.6 5.6 6.1 .7 -4.5 4.1 1.2 6 -5.4 -3 -5.4 3 1.2 -6 -4.5 -4.1 6.1 -.7 Z"
        fill="currentColor"
      />
    </Base>
  );
}

/** Альбом наклеек */
export function AlbumIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" fill="currentColor" />
      <rect x="7" y="7" width="4.4" height="4.4" rx="1" fill="#fff" opacity="0.9" transform="rotate(-6 9.2 9.2)" />
      <rect x="13" y="8" width="4.4" height="4.4" rx="1" fill="#fff" opacity="0.7" transform="rotate(7 15.2 10.2)" />
      <rect x="9" y="14" width="6" height="2" rx="1" fill="#fff" opacity="0.6" />
    </Base>
  );
}

/** Молния (устный счёт) */
export function BoltIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M13.5 2.5 L5.5 13.5 H11 L9.8 21.5 L18.5 9.8 H12.8 Z" fill="currentColor" />
    </Base>
  );
}

/** Закономерности */
export function PatternIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="6" cy="8" r="2.6" fill="currentColor" />
      <rect x="10" y="5.4" width="5.2" height="5.2" rx="1.2" fill="currentColor" opacity="0.75" />
      <path d="M20.5 10.5 L18 5.6 L15.5 10.5 Z" fill="currentColor" opacity="0.55" />
      <path d="M5 17 h4 M11 17 h4 M17 17 h2.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </Base>
  );
}

/** Мишень (быстрая логика) */
export function TargetIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </Base>
  );
}

/** Билет (бонус) */
export function TicketIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path
        d="M4 8 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v2.2 a1.8 1.8 0 0 0 0 3.6 V16 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 v-2.2 a1.8 1.8 0 0 0 0 -3.6 Z"
        fill="currentColor"
      />
      <path d="M13.5 7 v10" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 2.2" />
    </Base>
  );
}

/** Календарь (Daily) */
export function CalendarIcon({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="currentColor" />
      <path d="M3.5 9.5 H20.5" stroke="#fff" strokeWidth="1.6" opacity="0.8" />
      <path d="M8 3 v3.4 M16 3 v3.4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8.6 13.5 l2.1 2.1 4.4 -4.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Base>
  );
}
