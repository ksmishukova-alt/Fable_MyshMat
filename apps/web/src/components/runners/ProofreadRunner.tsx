"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/ё/g, "е");
}

/**
 * Proofread — найти ошибки в тексте и исправить.
 * Клик по слову открывает поле ввода правильного варианта.
 * Верно, когда исправлены ровно ошибочные слова (proofFixes) и только они.
 * Результат сообщается через onState.
 */
export function ProofreadRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const words = step.proofWords ?? [];
  const fixes = step.proofFixes ?? [];
  const errorIndices = new Set(fixes.map((f) => f.index));

  // edits[index] = введённое исправление (строка). Открытое поле = есть запись.
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    // Верно: каждое ошибочное слово исправлено правильно,
    // и нет «лишних» исправлений у верных слов.
    let ok = true;
    for (const f of fixes) {
      const got = norm(edits[f.index] ?? "");
      if (!f.accepted.some((a) => norm(a) === got)) ok = false;
    }
    for (const key of Object.keys(edits)) {
      const i = Number(key);
      const val = (edits[i] ?? "").trim();
      if (val && !errorIndices.has(i)) ok = false; // исправили верное слово — ошибка
    }
    onState(ok);
  }, [edits, fixes, errorIndices, onState]);

  function openWord(i: number) {
    if (locked) return;
    setOpenIdx(i);
    setEdits((e) => (i in e ? e : { ...e, [i]: "" }));
  }

  return (
    <div className="prf">
      <div className="prf-text">
        {words.map((w, i) => {
          const edited = (edits[i] ?? "").trim().length > 0;
          return (
            <span className="prf-word-wrap" key={i}>
              <button
                type="button"
                className={`prf-word${edited ? " edited" : ""}${openIdx === i ? " active" : ""}`}
                onClick={() => openWord(i)}
                disabled={locked}
              >
                {edited ? edits[i] : w}
              </button>
            </span>
          );
        })}
      </div>

      {openIdx !== null && !locked && (
        <div className="prf-editor">
          <span className="prf-editor-label">Исправь слово «{words[openIdx]}»:</span>
          <input
            className="prf-input"
            value={edits[openIdx] ?? ""}
            onChange={(e) => setEdits((ed) => ({ ...ed, [openIdx]: e.target.value }))}
            autoFocus
            autoComplete="off"
          />
          <button
            type="button"
            className="prf-clear"
            onClick={() =>
              setEdits((ed) => {
                const next = { ...ed };
                delete next[openIdx];
                return next;
              })
            }
          >
            Это слово верное
          </button>
        </div>
      )}
      <p className="prf-hint-note">Нажми на слово с ошибкой и впиши правильный вариант.</p>
    </div>
  );
}
