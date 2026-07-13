"use client";

/**
 * «Салют-микс»: анимация поверх экрана при ответе (без текстовых плашек).
 * Верно — случайный из 4 эффектов: конфетти-залп, звёздный взрыв,
 * дождь медалек, кольца-фейерверк. Неверно — мягкий из 2: облачко с каплями,
 * лампочка «подумаем ещё». Сам исчезает, кликов не перехватывает.
 */
import { useEffect, useMemo, useState } from "react";

export type FxKind = "good" | "bad";
export interface FxState {
  kind: FxKind;
  n: number; // nonce: каждый показ — новый монтаж
}

const GOOD = ["confetti", "stars", "medals", "rings"] as const;
const BAD = ["cloud", "bulb"] as const;
const COLORS = ["#FFB33A", "#4A8DFF", "#8B5CF6", "#42C263", "#F45D9E", "#FFD342"];

export function FeedbackOverlay({ fx, onDone }: { fx: FxState | null; onDone?: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fx) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1300);
    return () => clearTimeout(t);
  }, [fx, onDone]);

  const effect = useMemo(() => {
    if (!fx) return null;
    return fx.kind === "good" ? GOOD[fx.n % GOOD.length] : BAD[fx.n % BAD.length];
  }, [fx]);

  if (!fx || !visible || !effect) return null;

  return (
    <div className="fx-overlay" aria-hidden="true" key={fx.n}>
      {effect === "confetti" && (
        <div className="fx-center">
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * 360;
            return (
              <i
                key={i}
                className="fx-confetti"
                style={{
                  background: COLORS[i % COLORS.length],
                  transform: `rotate(${a}deg)`,
                  animationDelay: `${(i % 5) * 0.03}s`,
                }}
              />
            );
          })}
        </div>
      )}
      {effect === "stars" && (
        <div className="fx-center">
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * 360 + 18;
            return (
              <svg
                key={i}
                className="fx-star"
                viewBox="0 0 24 24"
                style={{ transform: `rotate(${a}deg)`, animationDelay: `${(i % 4) * 0.05}s` }}
              >
                <path
                  d="M12 2.6 l2.6 5.6 6.1 .7 -4.5 4.1 1.2 6 -5.4 -3 -5.4 3 1.2 -6 -4.5 -4.1 6.1 -.7 Z"
                  fill={COLORS[i % COLORS.length]}
                />
              </svg>
            );
          })}
        </div>
      )}
      {effect === "medals" && (
        <>
          {Array.from({ length: 9 }, (_, i) => (
            <svg
              key={i}
              className="fx-medal"
              viewBox="0 0 24 24"
              style={{ left: `${8 + i * 10}%`, animationDelay: `${(i % 5) * 0.09}s` }}
            >
              <circle cx="12" cy="12" r="9" fill="#ffd23e" stroke="#c8920a" strokeWidth="1.6" />
              <path
                d="M12 7.5 l1.4 2.8 3.1 .4 -2.2 2.1 .5 3.1 -2.8 -1.6 -2.8 1.6 .5 -3.1 -2.2 -2.1 3.1 -.4 Z"
                fill="#fff7df"
              />
            </svg>
          ))}
        </>
      )}
      {effect === "rings" && (
        <div className="fx-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="fx-ring"
              style={{ borderColor: COLORS[(i * 2 + 1) % COLORS.length], animationDelay: `${i * 0.14}s` }}
            />
          ))}
          <svg className="fx-check" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#42c263" />
            <path d="M7 12.5 l3.4 3.4 L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      {effect === "cloud" && (
        <div className="fx-center fx-soft">
          <svg className="fx-cloud" viewBox="0 0 80 60">
            <path
              d="M20 42 a12 12 0 0 1 4 -23 a15 15 0 0 1 29 -3 a11 11 0 0 1 7 26 Z"
              fill="#b9c9dd"
            />
            <line x1="28" y1="48" x2="26" y2="55" stroke="#7fb3e8" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="48" x2="40" y2="57" stroke="#7fb3e8" strokeWidth="3" strokeLinecap="round" />
            <line x1="56" y1="48" x2="54" y2="55" stroke="#7fb3e8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {effect === "bulb" && (
        <div className="fx-center fx-soft">
          <svg className="fx-bulb" viewBox="0 0 48 64">
            <path
              d="M24 4 a16 16 0 0 1 16 16 c0 6 -3 9.5 -6 12.8 -2 2.3 -3 4.6 -3 7.2 H17 c0 -2.6 -1 -4.9 -3 -7.2 -3 -3.3 -6 -6.8 -6 -12.8 A16 16 0 0 1 24 4 Z"
              fill="#ffd23e"
            />
            <rect x="17" y="42" width="14" height="4" rx="2" fill="#93a3b8" />
            <rect x="18" y="48" width="12" height="4" rx="2" fill="#93a3b8" />
            <path d="M24 14 v8 M20 18 h8" stroke="#b8860b" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="fx-spark" style={{ transform: `rotate(${i * 90 + 45}deg)` }} />
          ))}
        </div>
      )}
    </div>
  );
}
