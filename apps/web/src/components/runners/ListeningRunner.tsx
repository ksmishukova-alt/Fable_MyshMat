"use client";

import { useEffect, useRef, useState } from "react";
import type { TaskStep } from "@/types/domain";

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?]+$/g, "");
}

/**
 * Аудирование: ребёнок слушает диалог (лимит прослушиваний), затем отвечает
 * на вопросы — часть с вариантами, часть коротким вводом.
 * Результат (все ли верно) сообщается родителю через onState.
 * Вопросы показываются только после первого прослушивания.
 */
export function ListeningRunner({
  step,
  locked,
  onState,
}: {
  step: TaskStep;
  locked: boolean;
  onState: (ok: boolean) => void;
}) {
  const limit = step.listenLimit ?? 2;
  const hasAudio = !!step.audioUrl;
  const questions = step.listenQuestions ?? [];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));

  useEffect(() => {
    const ok = questions.every((q, i) => {
      const a = answers[i] ?? "";
      if (q.options && q.correct) return a === q.correct;
      return (q.accepted ?? []).some((acc) => norm(acc) === norm(a));
    });
    onState(ok && plays > 0);
  }, [answers, questions, plays, onState]);

  const canPlay = plays < limit && !playing;

  function listen() {
    if (!canPlay) return;
    setPlays((p) => p + 1);
    if (hasAudio && audioRef.current) {
      setPlaying(true);
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => setPlaying(false));
    } else {
      setPlaying(true);
      setTimeout(() => setPlaying(false), 1500);
    }
  }

  function setAnswer(i: number, v: string) {
    if (locked) return;
    setAnswers((a) => a.map((x, idx) => (idx === i ? v : x)));
  }

  return (
    <div className="lst">
      {hasAudio && (
        <audio ref={audioRef} src={step.audioUrl} preload="auto" onEnded={() => setPlaying(false)} />
      )}

      <div className="lst-player">
        <button type="button" className="aud-btn" onClick={listen} disabled={!canPlay}>
          {playing ? "▶ Звучит…" : plays === 0 ? "▶ Слушать диалог" : plays < limit ? "▶ Слушать ещё раз" : "Прослушивания закончились"}
        </button>
        <div className="aud-counter">
          Прослушиваний: {plays} из {limit}
          {!hasAudio && <span className="aud-stub"> · демо-режим (без звука)</span>}
        </div>
      </div>

      {plays === 0 ? (
        <p className="lst-locked-note">Сначала послушай диалог — потом появятся вопросы.</p>
      ) : (
        <div className="lst-questions">
          {questions.map((q, i) => (
            <div className="lst-q" key={i}>
              <div className="lst-q-text">{i + 1}. {q.q}</div>
              {q.options ? (
                <div className="lst-opts">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`lst-opt${answers[i] === opt ? " sel" : ""}`}
                      onClick={() => setAnswer(i, opt)}
                      disabled={locked}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="lst-input"
                  value={answers[i]}
                  disabled={locked}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  placeholder="Type your answer…"
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
