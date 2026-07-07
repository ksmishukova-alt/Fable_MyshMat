"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

/** RU_SENTENCE_ORDER — карточки по порядку (drag + клик). Результат через onState. */
export function OrderRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const cards = step.cards ?? [];
  const [placed, setPlaced] = useState<number[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    const accepted = step.acceptedOrders ?? [];
    const ok =
      placed.length === cards.length &&
      accepted.some((order) => order.length === placed.length && order.every((v, i) => v === placed[i]));
    onState(ok);
  }, [placed, step, cards.length, onState]);

  const inBank = cards.map((_, i) => i).filter((i) => !placed.includes(i));

  function place(i: number) {
    if (locked) return;
    setPlaced((p) => (p.includes(i) ? p : [...p, i]));
  }
  function unplace(i: number) {
    if (locked) return;
    setPlaced((p) => p.filter((x) => x !== i));
  }
  function onDrop(targetPos: number) {
    if (locked || dragIdx === null) return;
    setPlaced((p) => {
      const without = p.filter((x) => x !== dragIdx);
      const pos = Math.min(targetPos, without.length);
      return [...without.slice(0, pos), dragIdx, ...without.slice(pos)];
    });
    setDragIdx(null);
  }

  return (
    <div className="or">
      <div className="or-row" onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(placed.length)}>
        {placed.length === 0 && <span className="or-placeholder">Нажми на карточки по порядку или перетащи их в поле</span>}
        {placed.map((ci, pos) => (
          <button key={ci} type="button" className="or-card placed" draggable={!locked}
            onDragStart={() => setDragIdx(ci)} onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.stopPropagation(); onDrop(pos); }} onClick={() => unplace(ci)} disabled={locked}>
            {cards[ci]}
          </button>
        ))}
      </div>
      <div className="or-bank">
        {inBank.map((ci) => (
          <button key={ci} type="button" className="or-card" draggable={!locked}
            onDragStart={() => setDragIdx(ci)} onClick={() => place(ci)} disabled={locked}>
            {cards[ci]}
          </button>
        ))}
      </div>
    </div>
  );
}
