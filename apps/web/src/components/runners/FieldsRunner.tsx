"use client";

import { useEffect, useState } from "react";
import type { TaskStep } from "@/types/domain";

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

/** Поля-разбор: морфемы, словосочетание. Результат через onState. */
export function FieldsRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const fields = step.fields ?? [];
  const [vals, setVals] = useState<string[]>(() => fields.map(() => ""));

  useEffect(() => {
    const ok = fields.every((f, i) => {
      const got = norm(vals[i] ?? "");
      return f.accepted.some((a) => {
        const acc = norm(a);
        if (acc === "" || acc === "нулевое" || acc === "-") return got === "" || got === "нулевое" || got === "-";
        return acc === got;
      });
    });
    onState(ok);
  }, [vals, fields, onState]);

  function setVal(i: number, v: string) {
    if (locked) return;
    setVals((a) => a.map((x, idx) => (idx === i ? v : x)));
  }

  return (
    <div className="fld-runner">
      {step.fieldsSubject && <div className="fld-subject">{step.fieldsSubject}</div>}
      <div className="fld-grid">
        {fields.map((f, i) => (
          <label className="fld-cell" key={i}>
            <span className="fld-cap">{f.label}</span>
            <input className="fld-in" value={vals[i]} disabled={locked}
              onChange={(e) => setVal(i, e.target.value)} autoComplete="off" />
          </label>
        ))}
      </div>
    </div>
  );
}
