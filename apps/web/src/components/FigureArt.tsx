/**
 * Рисунки к задачам «Подсчёт фигур»: отрезки с точками, треугольник-«веер»,
 * квадратная и прямоугольная сетки. Чистый SVG, подписи точек — буквы.
 */
import type { FigureSpec } from "@/types/olympiad";

const LETTERS = "ABCDEFGHKLMN";
const STROKE = "#24446e";

export function FigureArt({ figure }: { figure: FigureSpec }) {
  switch (figure.kind) {
    case "segments": {
      const n = figure.points;
      const w = 320;
      const pad = 26;
      const step = (w - pad * 2) / (n - 1);
      return (
        <svg viewBox={`0 0 ${w} 74`} className="figure-art" aria-label={`Прямая с ${n} точками`}>
          <line x1={pad - 12} y1={40} x2={w - pad + 12} y2={40} stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <circle cx={pad + i * step} cy={40} r={5.5} fill="#1776ff" stroke="#fff" strokeWidth="2" />
              <text x={pad + i * step} y={22} textAnchor="middle" fontSize="15" fontWeight="800" fill={STROKE}>
                {LETTERS[i]}
              </text>
            </g>
          ))}
        </svg>
      );
    }
    case "fan": {
      const p = figure.parts;
      const w = 300;
      const apexX = w / 2;
      const baseY = 130;
      const pad = 30;
      const step = (w - pad * 2) / p;
      return (
        <svg viewBox={`0 0 ${w} 150`} className="figure-art" aria-label="Треугольник с линиями из вершины">
          {/* стороны и основание */}
          <path
            d={`M ${apexX} 14 L ${pad} ${baseY} L ${w - pad} ${baseY} Z`}
            fill="rgba(127,195,255,.18)"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* чевианы */}
          {Array.from({ length: p - 1 }, (_, i) => (
            <line
              key={i}
              x1={apexX}
              y1={14}
              x2={pad + (i + 1) * step}
              y2={baseY}
              stroke={STROKE}
              strokeWidth="2.4"
            />
          ))}
          {/* точки основания */}
          {Array.from({ length: p + 1 }, (_, i) => (
            <circle key={i} cx={pad + i * step} cy={baseY} r={4.5} fill="#1776ff" stroke="#fff" strokeWidth="1.8" />
          ))}
          <circle cx={apexX} cy={14} r={4.5} fill="#e8556b" stroke="#fff" strokeWidth="1.8" />
        </svg>
      );
    }
    case "grid":
    case "rect-grid": {
      const rows = figure.kind === "grid" ? figure.size : figure.rows;
      const cols = figure.kind === "grid" ? figure.size : figure.cols;
      const cell = 40;
      const pad = 8;
      const w = cols * cell + pad * 2;
      const h = rows * cell + pad * 2;
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="figure-art" aria-label={`Сетка ${rows}×${cols}`} style={{ maxInlineSize: Math.min(cols * 52, 300) }}>
          <rect x={pad} y={pad} width={cols * cell} height={rows * cell} fill="rgba(127,195,255,.14)" />
          {Array.from({ length: rows + 1 }, (_, r) => (
            <line key={`r${r}`} x1={pad} y1={pad + r * cell} x2={pad + cols * cell} y2={pad + r * cell} stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
          ))}
          {Array.from({ length: cols + 1 }, (_, c) => (
            <line key={`c${c}`} x1={pad + c * cell} y1={pad} x2={pad + c * cell} y2={pad + rows * cell} stroke={STROKE} strokeWidth="2.6" strokeLinecap="round" />
          ))}
        </svg>
      );
    }
  }
}
