"use client";

import { useEffect, useState } from "react";
import type { PunctMark, TaskStep } from "@/types/domain";

const MARKS: { mark: PunctMark; label: string }[] = [
  { mark: ".", label: "." },
  { mark: ",", label: "," },
  { mark: "?", label: "?" },
  { mark: "!", label: "!" },
  { mark: "", label: "✕" },
];

/**
 * RU_PUNCTUATION_MARKER — знаки + заглавные.
 * Сообщает результат родителю через onState (без своей кнопки проверки).
 */
export function PunctuationRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const words = step.words ?? [];
  const [activeMark, setActiveMark] = useState<PunctMark>(".");
  const [slots, setSlots] = useState<PunctMark[]>(() => words.map(() => ""));
  const [caps, setCaps] = useState<boolean[]>(() => words.map(() => false));

  useEffect(() => {
    const expMarks = step.expectedMarks ?? [];
    const expCaps = new Set(step.expectedCapitals ?? []);
    let ok = true;
    for (let i = 0; i < words.length; i++) {
      if ((slots[i] || "") !== (expMarks[i] || "")) ok = false;
      if (caps[i] !== expCaps.has(i)) ok = false;
    }
    onState(ok);
  }, [slots, caps, step, words, onState]);

  function setSlot(i: number) {
    if (locked) return;
    setSlots((s) => s.map((v, idx) => (idx === i ? activeMark : v)));
  }
  function toggleCap(i: number) {
    if (locked) return;
    setCaps((c) => c.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="pm">
      <div className="pm-text">
        {words.map((w, i) => {
          const first = w.charAt(0);
          const shown = caps[i] ? first.toUpperCase() : first.toLowerCase();
          return (
            <span className="pm-word-wrap" key={i}>
              <button type="button" className={`pm-word${caps[i] ? " cap" : ""}`} onClick={() => toggleCap(i)} disabled={locked}>
                <span className="pm-first">{shown}</span>{w.slice(1)}
              </button>
              <button type="button" className={`pm-slot${slots[i] ? " filled" : ""}`} onClick={() => setSlot(i)} disabled={locked} aria-label="Поставить знак">
                {slots[i] || "+"}
              </button>
            </span>
          );
        })}
      </div>
      <div className="pm-panel">
        <span className="pm-panel-label">Знак:</span>
        {MARKS.map((m) => (
          <button key={m.label} type="button" className={`pm-mark${activeMark === m.mark ? " active" : ""}`} onClick={() => setActiveMark(m.mark)} disabled={locked}>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
