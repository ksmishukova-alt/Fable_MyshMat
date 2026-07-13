"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TaskContent, TaskStep, StepStat } from "@/types/domain";
import { SUBJECTS, computeAutonomy, MAX_ATTEMPTS } from "@/types/domain";
import { modeLabel, modeIcon } from "@/lib/status";
import { ReadingTimer } from "@/components/ReadingTimer";
import { PunctuationRunner } from "@/components/runners/PunctuationRunner";
import { OrderRunner } from "@/components/runners/OrderRunner";
import { WordFixRunner } from "@/components/runners/WordFixRunner";
import { GapInputRunner } from "@/components/runners/GapInputRunner";
import { SortRunner } from "@/components/runners/SortRunner";
import { FieldsRunner } from "@/components/runners/FieldsRunner";
import { AudioDictationRunner } from "@/components/runners/AudioDictationRunner";
import { ListeningRunner } from "@/components/runners/ListeningRunner";
import { ProofreadRunner } from "@/components/runners/ProofreadRunner";
import { ReadAloudRunner } from "@/components/runners/ReadAloudRunner";

type StepPhase = "solving" | "correct" | "wrong" | "failed";

interface StepState {
  attempts: number;
  hintUsed: boolean;
  phase: StepPhase;
  selected: string | null;
  input: string;
  liveOk: boolean; // текущая правильность интерактивного раннера (до нажатия «Проверить»)
  solvedFirstTry: boolean;
}

function freshStep(): StepState {
  return { attempts: 0, hintUsed: false, phase: "solving", selected: null, input: "", liveOk: false, solvedFirstTry: false };
}

const INTERACTIVE: Record<string, true> = {
  punctuation: true, order: true, wordfix: true,
  gapinput: true, sort: true, fields: true, audio: true, listening: true,
  proofread: true, readaloud: true,
};

export function TaskScreen({ task, nextTaskId }: { task: TaskContent; nextTaskId: string | null }) {
  const router = useRouter();
  const subject = SUBJECTS[task.subjectId];
  const isWorksheet = task.mode === "worksheet";
  const steps: TaskStep[] = task.steps ?? [];

  const [uploaded, setUploaded] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [states, setStates] = useState<StepState[]>(() => steps.map(freshStep));

  if (isWorksheet) {
    return (
      <WorksheetView task={task} subjectTitle={subject.title} uploaded={uploaded}
        onUpload={() => setUploaded(true)} onBack={() => router.push(`/daily/${task.subjectId}`)}
        onNext={() => (nextTaskId ? router.push(`/daily/${task.subjectId}/${nextTaskId}`) : router.push("/"))}
        nextTaskId={nextTaskId} />
    );
  }

  const step = steps[stepIdx];
  const st = states[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const hasOptions = (step.options?.length ?? 0) > 0;
  const isReading = step.kind === "reading";
  const isInteractive = !!INTERACTIVE[step.kind];
  const isManual = step.kind === "audio" || step.kind === "readaloud";

  function patch(p: Partial<StepState>) {
    setStates((arr) => arr.map((s, i) => (i === stepIdx ? { ...s, ...p } : s)));
  }

  // стабильный колбэк для раннеров: фиксируем текущую правильность
  const onState = useCallback(
    (ok: boolean) => {
      setStates((arr) => arr.map((s, i) => (i === stepIdx ? { ...s, liveOk: ok } : s)));
    },
    [stepIdx]
  );

  /** Проверка по нажатию «Проверить» (единая кнопка снизу). */
  function check() {
    let ok = false;
    if (hasOptions) ok = !!step.options!.find((o) => o.id === st.selected)?.isCorrect;
    else if (isInteractive) ok = st.liveOk;
    else
      ok =
        step.correctInput === undefined || step.correctInput === ""
          ? st.input.trim().length > 0
          : st.input.trim().toLowerCase() === step.correctInput.trim().toLowerCase();

    const attempts = st.attempts + 1;
    if (ok) {
      patch({
        attempts,
        phase: "correct",
        solvedFirstTry: attempts === 1 && !st.hintUsed ? true : st.solvedFirstTry,
      });
      // одна кнопка «Завершить»: верно → короткий флеш и сразу дальше
      window.setTimeout(() => goNext(), 900);
    } else if (attempts >= MAX_ATTEMPTS) {
      patch({ attempts, phase: "failed", hintUsed: true });
    } else {
      // остаёмся на месте: попытка сгорела, подсказка открылась
      patch({ attempts, phase: "solving", hintUsed: true });
    }
  }

  function buildReport() {
    const stats: StepStat[] = steps.map((s, i) => {
      const ss = states[i];
      const answerable = s.kind !== "reading";
      return {
        stepId: s.id, attempts: ss.attempts, hintUsed: ss.hintUsed,
        solvedFirstTry: ss.solvedFirstTry,
        skippedWithError: answerable && ss.phase !== "correct",
      };
    });
    return { taskId: task.id, steps: stats, autonomyScore: computeAutonomy(stats) };
  }

  function submitAttempt() {
    const report = buildReport();
    void fetch("/api/attempts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.id, mode: task.mode,
        isCorrect: states.every((s) => s.phase === "correct"),
        autonomyScore: report.autonomyScore, steps: report.steps,
      }),
    }).catch(() => {});
  }

  function goNext() {
    if (isLast) {
      submitAttempt();
      router.push(nextTaskId ? `/daily/${task.subjectId}/${nextTaskId}` : "/");
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  function goBack() {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
    else router.push(`/daily/${task.subjectId}`);
  }

  const resolved = st.phase === "correct" || st.phase === "failed";
  const locked = resolved;
  const stars = st.hintUsed ? 5 : 10;

  return (
    <main className="task-stage" aria-label={`${subject.title}: ${task.title}`}>
      <div className="task-col wide">
        <header className="ts-top">
          <button
            className="screen-back"
            onClick={goBack}
            aria-label={stepIdx > 0 ? "Назад" : "К заданиям"}
          >
            ←
          </button>
          <div className="ts-progress">
            {steps.length > 1 ? `Шаг ${stepIdx + 1} из ${steps.length}` : `Задание ${task.order} из ${task.total}`}
          </div>
          <span className="ts-mode" title={modeLabel(task.mode)}>{modeIcon(task.mode)} {modeLabel(task.mode)}</span>
        </header>
        <div className="task-card-wrap">

        <div className="ts-single">
          <h1 className="ts-title">{task.title}</h1>
          {step.passage && isReading && <blockquote className="ts-passage">{step.passage}</blockquote>}
          {step.passage && !isReading && (
            <details className="ts-passage-toggle"><summary>📖 Перечитать текст</summary>
              <blockquote className="ts-passage">{step.passage}</blockquote></details>
          )}
          <p className="ts-prompt">{step.prompt}</p>

          {/* READING */}
          {isReading && (
            <div className="ts-actions">
              <button className="btn-cta btn-cta--blue ts-cta-slot" onClick={goNext}>{isLast ? (nextTaskId ? "Следующая задача →" : "Готово") : "Далее →"}</button>
            </div>
          )}

          {/* INTERACTIVE RUNNERS */}
          {step.kind === "punctuation" && <PunctuationRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "order" && <OrderRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "wordfix" && <WordFixRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "gapinput" && <GapInputRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "sort" && <SortRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "fields" && <FieldsRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "audio" && <AudioDictationRunner step={step} onDone={() => patch({ phase: "correct" })} />}
          {step.kind === "listening" && <ListeningRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "proofread" && <ProofreadRunner step={step} locked={locked} onState={onState} />}
          {step.kind === "readaloud" && <ReadAloudRunner step={step} onDone={() => patch({ phase: "correct" })} />}

          {/* QUESTION options */}
          {step.kind === "question" && hasOptions && (
            <div className="ts-options">
              {step.options!.map((o) => {
                let cls = "ts-opt";
                if (st.phase === "solving" && st.selected === o.id) cls += " sel";
                if (st.phase === "correct" && o.isCorrect) cls += " ok";
                return (
                  <button key={o.id} className={cls} disabled={resolved}
                    onClick={() => patch({ selected: o.id })}>{o.label}</button>
                );
              })}
            </div>
          )}
          {step.kind === "question" && step.readingTimerMinutes && <ReadingTimer goalMinutes={step.readingTimerMinutes} />}
          {step.kind === "question" && !hasOptions && (
            <textarea className="ts-input" placeholder="Напиши свой ответ…" value={st.input}
              disabled={resolved} onChange={(e) => patch({ input: e.target.value })} rows={3} />
          )}

          {/* Подсказка — после первой ошибки */}
          {!isReading && !isManual && st.hintUsed && step.hint && <div className="ts-hint">💡 {step.hint}</div>}

          {/* Вердикт после «Проверить» */}
          {st.phase === "correct" && !isManual && (
            <div className="ts-result ok"><b>Верно! 🎉</b><span>+{stars} ⭐ {st.hintUsed && "(с подсказкой)"}</span></div>
          )}
          {st.phase === "solving" && st.attempts > 0 && (
            <div className="ts-result no">
              <b>Попробуй ещё раз 💪</b>
              <span>
                Попытка {st.attempts} из {MAX_ATTEMPTS}.{" "}
                {step.hint ? "Подсказка уже открылась выше!" : "Подумай ещё чуть-чуть."}
              </span>
            </div>
          )}
          {st.phase === "failed" && (
            <div className="ts-result no">
              <b>Пока не получилось</b>
              <span>Это задание мы добавили в «Мои доработки» — вернёмся к нему позже.</span>
            </div>
          )}

          {/* Кнопки */}
          {!isReading && !isManual && (
            <div className="ts-actions">
              {st.phase === "solving" && (
                <button className="btn-cta btn-cta--orange ts-cta-slot" onClick={check}>
                  Завершить ✓
                </button>
              )}
              {st.phase === "failed" && (
                <button className="btn-cta btn-cta--blue ts-cta-slot" onClick={goNext}>
                  {isLast ? (nextTaskId ? "Следующая задача →" : "К предметам →") : "Дальше →"}
                </button>
              )}
            </div>
          )}

          {/* Аудио: кнопка появляется после загрузки фото (phase correct) */}
          {isManual && st.phase === "correct" && (
            <div className="ts-actions">
              <button className="btn-cta btn-cta--blue ts-cta-slot" onClick={goNext}>{isLast ? (nextTaskId ? "Следующая задача →" : "Завершить") : "Дальше →"}</button>
            </div>
          )}
        </div>
        </div>
      </div>
    </main>
  );
}

function WorksheetView({
  task, subjectTitle, uploaded, onUpload, onBack, onNext, nextTaskId,
}: {
  task: TaskContent; subjectTitle: string; uploaded: boolean;
  onUpload: () => void; onBack: () => void; onNext: () => void; nextTaskId: string | null;
}) {
  return (
    <main className="task-stage" aria-label={`${subjectTitle}: ${task.title}`}>
      <div className="task-col wide">
        <header className="ts-top">
          <button className="screen-back" onClick={onBack} aria-label="К заданиям">←</button>
          <div className="ts-progress">Задание {task.order} из {task.total}</div>
          <span className="ts-mode">{modeIcon("worksheet")} {modeLabel("worksheet")}</span>
        </header>
        <div className="task-card-wrap">
        <div className="ts-single">
          <h1 className="ts-title">{task.title}</h1>
          <WorksheetBody prompt={task.prompt} />
          {!uploaded ? (
            <button className="ts-upload" onClick={onUpload}>
              <span className="ts-upload-ic">📷</span>
              <span>Сфотографировать решение</span>
              <small>Нажми, чтобы загрузить фото с листочка</small>
            </button>
          ) : (
            <>
              <div className="ts-upload-done"><span className="ts-upload-ic">✅</span><p>Решение отправлено взрослому на проверку</p></div>
              <div className="ts-actions"><button className="btn-cta btn-cta--blue ts-cta-slot" onClick={onNext}>{nextTaskId ? "Следующая задача →" : "Готово, на главную"}</button></div>
            </>
          )}
        </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Разбор prompt листочка на блоки: условие / текст для списывания / задания.
 * Маркеры в контенте: "Текст для списывания:" и "Мини-задания:" (или "Mini-tasks:").
 */
function WorksheetBody({ prompt }: { prompt: string }) {
  const textMarker = /Текст для списывания:|Text to copy:/;
  const tasksMarker = /Мини-задания:|Mini-tasks:/;

  let intro = prompt;
  let copyText = "";
  let tasks = "";

  const tIdx = prompt.search(textMarker);
  const mIdx = prompt.search(tasksMarker);

  if (tIdx >= 0) {
    intro = prompt.slice(0, tIdx).trim();
    const afterText = prompt.slice(tIdx).replace(textMarker, "").trim();
    if (mIdx > tIdx) {
      const rel = afterText.search(tasksMarker);
      copyText = afterText.slice(0, rel).trim();
      tasks = afterText.slice(rel).replace(tasksMarker, "").trim();
    } else {
      copyText = afterText;
    }
  } else if (mIdx >= 0) {
    intro = prompt.slice(0, mIdx).trim();
    tasks = prompt.slice(mIdx).replace(tasksMarker, "").trim();
  }

  return (
    <div className="ws-body">
      {intro && <p className="ts-prompt">{intro}</p>}
      {copyText && (
        <div className="ws-copy">
          <div className="ws-copy-label">Текст для списывания</div>
          <blockquote className="ws-copy-text">{copyText}</blockquote>
        </div>
      )}
      {tasks && (
        <div className="ws-tasks">
          <div className="ws-tasks-label">Задания к тексту</div>
          <div className="ws-tasks-list">
            {tasks.split(/\n+/).map((line, i) => (
              <div className="ws-task-line" key={i}>{line.trim()}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
