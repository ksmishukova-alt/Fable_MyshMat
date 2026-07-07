"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

/** Сортировка слов по колонкам (2-4). Drag + клик. Результат через onState. */
export function SortRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const columns = step.columns ?? [];
  const chips = step.chips ?? [];
  const [placement, setPlacement] = useState<number[]>(() => chips.map(() => -1));
  const [active, setActive] = useState<number | null>(null);
  const [dragChip, setDragChip] = useState<number | null>(null);

  useEffect(() => {
    const ok = chips.every((c, i) => placement[i] === c.column);
    onState(ok);
  }, [placement, chips, onState]);

  function put(chipIdx: number, col: number) {
    if (locked) return;
    setPlacement((p) => p.map((v, i) => (i === chipIdx ? col : v)));
    setActive(null);
  }
  function onColumnClick(col: number) {
    if (locked || active === null) return;
    put(active, col);
  }

  const bank = chips.map((_, i) => i).filter((i) => placement[i] === -1);

  return (
    <div className="srt">
      <div className="srt-bank" onDragOver={(e) => e.preventDefault()} onDrop={() => dragChip !== null && put(dragChip, -1)}>
        {bank.length === 0 && <span className="srt-empty">Все слова распределены</span>}
        {bank.map((ci) => (
          <button key={ci} type="button" className={`srt-chip${active === ci ? " active" : ""}`} draggable={!locked}
            onDragStart={() => setDragChip(ci)} onClick={() => setActive((a) => (a === ci ? null : ci))} disabled={locked}>
            {chips[ci].text}
          </button>
        ))}
      </div>
      <div className={`srt-cols cols-${columns.length}`}>
        {columns.map((col, ci) => (
          <div key={ci} className="srt-col" onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragChip !== null && put(dragChip, ci)} onClick={() => onColumnClick(ci)}>
            <div className="srt-col-title">{col}</div>
            <div className="srt-col-body">
              {chips.map((c, idx) =>
                placement[idx] === ci ? (
                  <button key={idx} type="button" className="srt-chip placed" draggable={!locked}
                    onDragStart={() => setDragChip(idx)} onClick={(e) => { e.stopPropagation(); put(idx, -1); }} disabled={locked}>
                    {c.text}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
