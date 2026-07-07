"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

/** Ввод в пропуск(и): орфограммы, проверочные, грамматика, анаграммы, vocab. onState. */
export function GapInputRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const gaps = step.gaps ?? [];
  const [vals, setVals] = useState<string[]>(() => gaps.map(() => ""));

  useEffect(() => {
    const ok = gaps.every((g, i) => g.accepted.some((a) => norm(a) === norm(vals[i] ?? "")));
    onState(ok);
  }, [vals, gaps, onState]);

  function setVal(i: number, v: string) {
    if (locked) return;
    setVals((a) => a.map((x, idx) => (idx === i ? v : x)));
  }

  return (
    <div className="gi">
      <div className="gi-list">
        {gaps.map((g, i) => (
          <div className="gi-row" key={i}>
            <span className="gi-label">{g.label}</span>
            <input className="gi-input" value={vals[i]} disabled={locked}
              onChange={(e) => setVal(i, e.target.value)} aria-label={g.label} autoComplete="off" />
            {g.note && <span className="gi-note">{g.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
