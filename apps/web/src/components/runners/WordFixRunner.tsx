"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

/** RU_CONTEXT_WORD_FIX — найти неподходящее слово и заменить. Результат через onState. */
export function WordFixRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const words = step.sentenceWords ?? [];
  const replacements = step.replacements ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [replacement, setReplacement] = useState<string | null>(null);

  useEffect(() => {
    onState(picked === step.wrongWordIndex && replacement === step.correctReplacement);
  }, [picked, replacement, step, onState]);

  return (
    <div className="wf">
      <div className="wf-sentence">
        {words.map((w, i) => (
          <button key={i} type="button" className={`wf-word${picked === i ? " picked" : ""}`}
            onClick={() => !locked && setPicked(i)} disabled={locked}>
            {w}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="wf-replace">
          <div className="wf-replace-label">Чем заменить?</div>
          <div className="wf-options">
            {replacements.map((r) => (
              <button key={r} type="button" className={`wf-opt${replacement === r ? " sel" : ""}`}
                onClick={() => !locked && setReplacement(r)} disabled={locked}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
