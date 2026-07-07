"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Трекер чтения на 30 минут. Используется в задании «Дневник читателя».
 * Считает время, можно ставить на паузу. По достижении цели — отмечает успех.
 */
export function ReadingTimer({
  goalMinutes = 30,
  onComplete,
}: {
  goalMinutes?: number;
  onComplete?: () => void;
}) {
  const goalSec = goalMinutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (elapsed >= goalSec && !completedRef.current) {
      completedRef.current = true;
      setRunning(false);
      onComplete?.();
    }
  }, [elapsed, goalSec, onComplete]);

  const pct = Math.min(100, Math.round((elapsed / goalSec) * 100));
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const done = elapsed >= goalSec;

  return (
    <div className="rt-box">
      <div className="rt-ring" style={{ ["--pct" as string]: `${pct}%` }}>
        <div className="rt-time">
          {done ? "Готово!" : `${mm}:${ss}`}
        </div>
      </div>
      <div className="rt-goal">Цель: {goalMinutes} минут чтения</div>
      <div className="rt-controls">
        {!done && (
          <button className="rt-btn" onClick={() => setRunning((r) => !r)}>
            {running ? "⏸ Пауза" : elapsed === 0 ? "▶ Старт" : "▶ Продолжить"}
          </button>
        )}
        {done && <div className="rt-done">📚 Молодец! Ты читал(а) {goalMinutes} минут</div>}
      </div>
    </div>
  );
}
