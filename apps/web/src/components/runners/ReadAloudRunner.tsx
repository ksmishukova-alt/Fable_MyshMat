"use client";

import { useRef, useState } from "react";
import type { TaskStep } from "@/types/domain";

type RecState = "idle" | "recording" | "recorded" | "denied" | "unsupported";

/**
 * Read-aloud — ребёнок читает текст вслух и записывает звук через микрофон браузера
 * (MediaRecorder API). Можно прослушать запись и перезаписать.
 * Проверка ручная (методист слушает), поэтому onDone() вызывается при сохранении записи.
 */
export function ReadAloudRunner({
  step,
  onDone,
}: {
  step: TaskStep;
  onDone: () => void;
}) {
  const [state, setState] = useState<RecState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRec() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setState("recorded");
      };
      mediaRef.current = mr;
      mr.start();
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setState("recording");
    } catch {
      setState("denied");
    }
  }

  function stopRec() {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function reset() {
    setAudioUrl(null);
    setSeconds(0);
    setState("idle");
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="rar">
      {step.readText && (
        <blockquote className="rar-text">{step.readText}</blockquote>
      )}

      {state === "unsupported" && (
        <p className="rar-warn">Этот браузер не поддерживает запись звука. Можно прочитать вслух взрослому.</p>
      )}
      {state === "denied" && (
        <p className="rar-warn">Доступ к микрофону не разрешён. Разреши доступ в браузере и попробуй снова.</p>
      )}

      <div className="rar-controls">
        {(state === "idle" || state === "denied" || state === "unsupported") && (
          <button type="button" className="rar-btn rec" onClick={startRec}>
            ● Записать чтение
          </button>
        )}
        {state === "recording" && (
          <button type="button" className="rar-btn stop" onClick={stopRec}>
            ■ Остановить ({mm}:{ss})
          </button>
        )}
        {state === "recorded" && audioUrl && (
          <div className="rar-playback">
            <audio src={audioUrl} controls />
            <div className="rar-actions">
              <button type="button" className="rar-btn redo" onClick={reset}>Перезаписать</button>
              <button type="button" className="rar-btn save" onClick={onDone}>Отправить запись</button>
            </div>
          </div>
        )}
      </div>

      <p className="rar-hint-note">Прочитай текст вслух чётко и не спеша. Можно перезаписать, если хочешь.</p>
    </div>
  );
}
