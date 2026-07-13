"use client";

import { useRef, useState } from "react";
import { PhotoUploadButton } from "@/components/PhotoUploadButton";
import type { TaskStep } from "@/types/domain";

/**
 * Аудиодиктант. Прослушивание ограничено (по умолчанию 2 раза), без перемотки.
 * Текст ребёнку не показывается. После прослушивания — загрузка фото работы.
 * Проверка ручная (методист), поэтому onDone() вызывается при загрузке фото.
 *
 * Если audioUrl не задан — показываем плеер-заглушку (кнопка считает прослушивания,
 * но звука нет). Реальный файл подставляется позже в audioUrl.
 */
export function AudioDictationRunner({
  step,
  onDone,
}: {
  step: TaskStep;
  onDone: (url?: string) => void;
}) {
  const limit = step.listenLimit ?? 2;
  const hasAudio = !!step.audioUrl;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const canPlay = plays < limit && !playing;

  function listen() {
    if (!canPlay) return;
    setPlays((p) => p + 1);
    if (hasAudio && audioRef.current) {
      setPlaying(true);
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => setPlaying(false));
    } else {
      // заглушка: имитируем «проигрывание» 2 секунды
      setPlaying(true);
      setTimeout(() => setPlaying(false), 1500);
    }
  }

  return (
    <div className="aud">
      {hasAudio && (
        <audio
          ref={audioRef}
          src={step.audioUrl}
          preload="auto"
          onEnded={() => setPlaying(false)}
          // запрет перемотки: при попытке встать не на начало — возвращаем
          onSeeking={(e) => {
            const el = e.currentTarget;
            if (!playing && el.currentTime > 0) el.currentTime = 0;
          }}
        />
      )}

      <div className="aud-player">
        <button
          type="button"
          className="aud-btn"
          onClick={listen}
          disabled={!canPlay}
        >
          {playing ? "▶ Звучит…" : plays === 0 ? "▶ Слушать (1-й раз)" : plays < limit ? "▶ Слушать (2-й раз)" : "Прослушивания закончились"}
        </button>
        <div className="aud-counter">
          Прослушиваний: {plays} из {limit}
          {!hasAudio && <span className="aud-stub"> · демо-режим (без звука)</span>}
        </div>
      </div>

      <p className="aud-hint">
        Слушай внимательно — пауза и перемотка недоступны. Запиши текст в тетради,
        затем загрузи фото работы.
      </p>

      {!uploaded ? (
        <PhotoUploadButton
          disabled={plays === 0}
          hint={plays === 0 ? "Сначала прослушай хотя бы раз" : "Фото из тетради уйдёт методисту"}
          onUploaded={(url) => {
            setUploaded(true);
            onDone(url);
          }}
        />
      ) : (
        <div className="ts-upload-done">
          <span className="ts-upload-ic">✅</span>
          <p>Диктант отправлен методисту на проверку</p>
        </div>
      )}
    </div>
  );
}
