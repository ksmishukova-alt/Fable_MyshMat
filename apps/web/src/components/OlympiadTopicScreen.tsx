"use client";

/**
 * Экран прохождения темы: раннеры трёх уровней.
 *  L1 «Тренировка» — пошаговый мастер (guidedSteps).
 *  L2 «С поддержкой» — план-сборка → действия (тип + выражение) → найди ошибку → ответ.
 *  L3 «Самостоятельно» — листочек: ответ + фото, ручная проверка методистом.
 * 3 попытки на задачу; каскад провала: подсказка → альтернатива → откат → методист.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OLYMPIAD_MAX_ATTEMPTS, LEVEL_INFO, type OlympiadLevel, type FigureSpec } from "@/types/olympiad";
import { FigureArt } from "@/components/FigureArt";

interface SanStep {
  id: string;
  prompt: string;
  options?: { id: string; label: string }[];
  freeInput: boolean;
}
interface SanProblem {
  id: string;
  topicId: string;
  level: OlympiadLevel;
  title: string;
  statement: string;
  imageUrl?: string;
  figure?: FigureSpec;
  actionsCount?: number;
  hintsTotal: number;
  rewardStars: number;
  guidedSteps?: SanStep[];
  support?: {
    planCards?: string[];
    actions?: { kinds: string[] }[];
    findError?: { lines: string[] };
  };
  algebra?: { formula: string; explanation: string };
}
interface Progress {
  level: OlympiadLevel;
  solvedByLevel: Record<1 | 2 | 3, number>;
  streak: number;
  mastered: boolean;
}
interface CompleteResult {
  starsEarned: number;
  levelUp: boolean;
  levelDown: boolean;
  mastered: boolean;
  escalation: "none" | "alternative" | "levelDown" | "notified";
  newLevel: OlympiadLevel;
}

type Phase = "loading" | "solving" | "solved" | "failed" | "levelDone";

async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export function OlympiadTopicScreen({
  topicId,
  topicTitle,
}: {
  topicId: string;
  topicTitle: string;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [problem, setProblem] = useState<SanProblem | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [wrongs, setWrongs] = useState(0); // ошибки в текущей задаче
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [bubble, setBubble] = useState<{ tone: "" | "good" | "bad"; text: string }>({
    tone: "",
    text: "Я рядом — читай условие и вперёд!",
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const startRef = useRef(Date.now());
  const hintIdxRef = useRef(0);

  const load = useCallback(
    async (alt = false) => {
      setPhase("loading");
      setWrongs(0);
      setHintsUsed(0);
      setHintText(null);
      hintIdxRef.current = 0;
      startRef.current = Date.now();
      const data = await api<{ problem?: SanProblem; progress: Progress; done?: boolean }>(
        `/api/olympiad/next?topic=${topicId}${alt ? "&alt=1" : ""}`,
      );
      setProgress(data.progress);
      if (data.done || !data.problem) {
        setPhase("levelDone");
        setProblem(null);
        return;
      }
      setProblem(data.problem);
      setBubble({ tone: "", text: LEVEL_INFO[data.problem.level].hint });
      setPhase("solving");
    },
    [topicId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  /** Ошибка: попытка сгорает; 3 — провал. */
  async function registerWrong() {
    const w = wrongs + 1;
    setWrongs(w);
    if (w >= OLYMPIAD_MAX_ATTEMPTS) {
      const r = await api<CompleteResult>("/api/olympiad/complete", {
        problemId: problem!.id,
        solved: false,
        attempts: w,
        hintsUsed,
        durationMs: Date.now() - startRef.current,
      });
      setResult(r);
      setPhase("failed");
    } else {
      setBubble({ tone: "bad", text: w === 1 ? "Хм, не то. Попробуй ещё!" : "Ещё одна попытка — думай смелее!" });
    }
    return w;
  }

  async function finishSolved(answerGiven?: string, worksheetUrl?: string) {
    const r = await api<CompleteResult>("/api/olympiad/complete", {
      problemId: problem!.id,
      solved: true,
      attempts: wrongs + 1,
      hintsUsed,
      durationMs: Date.now() - startRef.current,
      answerGiven,
      worksheetUrl,
    });
    setResult(r);
    setPhase("solved");
    if (r.levelUp || r.mastered) setShowLevelUp(true);
  }

  if (phase === "loading") {
    return <Shell topicTitle={topicTitle} level={progress?.level ?? 1}>Загружаем задачу…</Shell>;
  }

  if (phase === "levelDone") {
    return (
      <Shell topicTitle={topicTitle} level={progress?.level ?? 1}>
        <div className="oly-result">
          <span className="big">🏔️</span>
          <h2>{progress?.mastered ? "Тема приручена!" : "Задачи уровня закончились"}</h2>
          <p>
            {progress?.mastered
              ? "Значок уже на твоей карте мышления. Выбирай следующую тему!"
              : "Методист добавит новые задачи — а пока загляни в другую тему."}
          </p>
          <div className="actions">
            <Link className="btn-cta btn-cta--blue" href="/topics">
              К карте тем <span>▶</span>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if ((phase === "solved" || phase === "failed") && result) {
    const failed = phase === "failed";
    return (
      <Shell topicTitle={topicTitle} level={problem?.level ?? 1}>
        <div className="oly-result" role="status">
          <span className="big">{failed ? "🌧️" : "🎉"}</span>
          <h2>{failed ? "Пока не получилось" : "Задача решена!"}</h2>
          <p>
            {failed
              ? result.escalation === "levelDown"
                ? "Вернёмся на шаг назад и потренируемся ещё — так растут чемпионы."
                : result.escalation === "notified"
                  ? "Мыш позвал методиста на помощь. А пока попробуй другую задачу!"
                  : "Попробуем похожую задачу — у тебя получится!"
              : problem?.level === 3
                ? "Ответ верный! Листочек уехал к методисту на проверку."
                : "Отличная запись решения!"}
          </p>
          {!failed && result.starsEarned > 0 && (
            <span className="stars-earned">⭐ +{result.starsEarned} звёзд</span>
          )}
          <div className="actions">
            <button
              className="btn-cta btn-cta--blue"
              onClick={() => void load(failed && result.escalation === "alternative")}
            >
              {failed ? "Другая задача" : "Следующая задача"} <span>▶</span>
            </button>
            <Link className="btn-cta btn-cta--purple" href="/topics">
              К карте
            </Link>
          </div>
          {!failed && problem?.algebra && (
            <div className="algebra-block">
              <h3>⚡ Способ по-взрослому: алгебра</h3>
              <span className="formula">{problem.algebra.formula}</span>
              <p>{problem.algebra.explanation}</p>
            </div>
          )}
        </div>
        {showLevelUp && (
          <div className="levelup-overlay" role="dialog" aria-label="Новый уровень">
            <div className="levelup-card">
              <span className="rocket">{result.mastered ? "🏅" : "🚀"}</span>
              <h2>{result.mastered ? "Тема приручена!" : `Уровень ${LEVEL_INFO[result.newLevel].short}!`}</h2>
              <p>
                {result.mastered
                  ? "Ты прошёл тему до самого конца — от тренировки до самостоятельных задач!"
                  : `Теперь — «${LEVEL_INFO[result.newLevel].title}». ${LEVEL_INFO[result.newLevel].hint}`}
              </p>
              <button className="btn-cta btn-cta--orange" onClick={() => setShowLevelUp(false)}>
                Ура! <span>▶</span>
              </button>
            </div>
          </div>
        )}
      </Shell>
    );
  }

  if (!problem) return null;

  return (
    <Shell topicTitle={topicTitle} level={problem.level}>
      <div className="oly-problem-title">
        {problem.title}
        <span className="oly-attempts" aria-label={`Осталось попыток: ${OLYMPIAD_MAX_ATTEMPTS - wrongs}`}>
          {Array.from({ length: OLYMPIAD_MAX_ATTEMPTS }, (_, i) => (
            <i key={i} className={i < wrongs ? "used" : ""} />
          ))}
        </span>
      </div>
      <div className="oly-statement">{problem.statement}</div>
      {problem.figure && (
        <div className="oly-figure">
          <FigureArt figure={problem.figure} />
        </div>
      )}

      <div className="oly-mascot-row">
        <div className="oly-mascot" aria-hidden="true" />
        <div className={`oly-bubble ${bubble.tone}`} role="status">
          {hintText ?? bubble.text}
        </div>
      </div>

      {problem.level === 1 && problem.guidedSteps && (
        <GuidedRunner
          problem={problem}
          onWrong={registerWrong}
          onHint={(h) => {
            setHintsUsed((x) => x + 1);
            setHintText(h);
          }}
          onGood={(text) => {
            setHintText(null);
            setBubble({ tone: "good", text });
          }}
          onSolved={() => void finishSolved()}
        />
      )}
      {problem.level === 2 && problem.support && (
        <SupportRunner
          problem={problem}
          onWrong={registerWrong}
          onGood={(text) => setBubble({ tone: "good", text })}
          onSolved={(ans) => void finishSolved(ans)}
        />
      )}
      {problem.level === 3 && (
        <WorksheetRunner
          problem={problem}
          onWrong={registerWrong}
          onSolved={(ans, url) => void finishSolved(ans, url)}
        />
      )}

      {wrongs > 0 && phase === "solving" && (
        <button
          className="oly-hint-btn"
          onClick={() => showHintCascade(problem, hintIdxRef, setHintText, setHintsUsed)}
        >
          💡 Подсказка
        </button>
      )}
    </Shell>
  );
}

/** Нарастающие подсказки задачи запрашиваем по индексу (сервер их не шлёт заранее — но для демо-банка они в TS на сервере; здесь дергаем по одной). */
function showHintCascade(
  problem: SanProblem,
  idxRef: { current: number },
  setHintText: (s: string) => void,
  setHintsUsed: (fn: (n: number) => number) => void,
) {
  void fetch(`/api/olympiad/hint?problem=${problem.id}&index=${idxRef.current}`)
    .then((r) => r.json())
    .then((d: { hint?: string }) => {
      if (d.hint) {
        setHintText(d.hint);
        setHintsUsed((n) => n + 1);
        idxRef.current = Math.min(idxRef.current + 1, problem.hintsTotal - 1);
      }
    });
}

function Shell({
  topicTitle,
  level,
  children,
}: {
  topicTitle: string;
  level: OlympiadLevel;
  children: React.ReactNode;
}) {
  return (
    <main className="oly-stage" aria-label={`Тема: ${topicTitle}`}>
      <div className="oly-wrap">
        <div className="oly-top">
          <Link className="oly-back" href="/topics" aria-label="К карте тем">
            ←
          </Link>
          <div className="oly-titles">
            <h1>{topicTitle}</h1>
            <span className={`oly-level-tag l${level}`}>
              {LEVEL_INFO[level].short} · {LEVEL_INFO[level].title}
            </span>
          </div>
        </div>
        <div className="oly-card">{children}</div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// L1 — пошаговый мастер
// ─────────────────────────────────────────────
function GuidedRunner({
  problem,
  onWrong,
  onHint,
  onGood,
  onSolved,
}: {
  problem: SanProblem;
  onWrong: () => Promise<number>;
  onHint: (h: string) => void;
  onGood: (text: string) => void;
  onSolved: () => void;
}) {
  const steps = problem.guidedSteps!;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [explain, setExplain] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const step = steps[idx];

  async function check() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await api<{ correct: boolean; explain?: string; hint?: string }>(
        "/api/olympiad/check",
        {
          problemId: problem.id,
          kind: "step",
          stepId: step.id,
          optionId: picked ?? undefined,
          input: input || undefined,
        },
      );
      if (res.correct) {
        setExplain(res.explain ?? "Верно!");
        onGood("Верно! Двигаемся дальше.");
      } else {
        const w = await onWrong();
        if (w < 3 && res.hint) onHint(res.hint);
      }
    } finally {
      setBusy(false);
    }
  }

  function next() {
    setExplain(null);
    setPicked(null);
    setInput("");
    if (idx + 1 >= steps.length) {
      onSolved();
    } else {
      setIdx(idx + 1);
    }
  }

  return (
    <div className="oly-step">
      <div className="oly-step-num">
        Шаг {idx + 1} из {steps.length}
      </div>
      <div className="oly-step-prompt">{step.prompt}</div>

      {explain ? (
        <>
          <div className="oly-explain">{explain}</div>
          <div className="oly-input-row">
            <button className="btn-cta btn-cta--blue oly-check" onClick={next}>
              {idx + 1 >= steps.length ? "Готово!" : "Дальше"} <span>▶</span>
            </button>
          </div>
        </>
      ) : step.options?.length ? (
        <>
          <div className="oly-options">
            {step.options.map((o) => (
              <button
                key={o.id}
                className={`oly-option${picked === o.id ? " picked" : ""}`}
                onClick={() => setPicked(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="oly-input-row">
            <button
              className="btn-cta btn-cta--blue oly-check"
              disabled={!picked || busy}
              onClick={() => void check()}
            >
              Проверить
            </button>
          </div>
        </>
      ) : (
        <div className="oly-input-row">
          <input
            className="oly-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Твой ответ…"
            inputMode="text"
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) void check();
            }}
          />
          <button
            className="btn-cta btn-cta--blue oly-check"
            disabled={!input.trim() || busy}
            onClick={() => void check()}
          >
            Проверить
          </button>
        </div>
      )}

      <div className="oly-dots" aria-hidden="true">
        {steps.map((s, i) => (
          <i key={s.id} className={i < idx ? "done" : i === idx ? "now" : ""} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// L2 — с поддержкой: план → действия → найди ошибку → ответ
// ─────────────────────────────────────────────
type L2Phase = "plan" | "actions" | "findError" | "final";

function SupportRunner({
  problem,
  onWrong,
  onGood,
  onSolved,
}: {
  problem: SanProblem;
  onWrong: () => Promise<number>;
  onGood: (text: string) => void;
  onSolved: (answer: string) => void;
}) {
  const sup = problem.support!;
  const phases: L2Phase[] = [
    ...(sup.planCards ? (["plan"] as const) : []),
    ...(sup.actions?.length ? (["actions"] as const) : []),
    ...(sup.findError ? (["findError"] as const) : []),
    "final",
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];
  const [busy, setBusy] = useState(false);

  // план
  const [planPick, setPlanPick] = useState<number[]>([]);
  // действия
  const [actIdx, setActIdx] = useState(0);
  const [kindPick, setKindPick] = useState<number | null>(null);
  const [expr, setExpr] = useState("");
  // найди ошибку
  const [linePick, setLinePick] = useState<number | null>(null);
  const [fix, setFix] = useState("");
  // ответ
  const [answer, setAnswer] = useState("");

  function nextPhase() {
    setPhaseIdx((i) => i + 1);
  }

  async function checkPlan() {
    setBusy(true);
    try {
      const res = await api<{ correct: boolean }>("/api/olympiad/check", {
        problemId: problem.id,
        kind: "plan",
        order: planPick,
      });
      if (res.correct) {
        onGood("План собран! Теперь выполним его по действиям.");
        nextPhase();
      } else {
        setPlanPick([]);
        await onWrong();
      }
    } finally {
      setBusy(false);
    }
  }

  async function checkAction() {
    setBusy(true);
    try {
      const res = await api<{ correct: boolean; value?: number }>("/api/olympiad/check", {
        problemId: problem.id,
        kind: "action",
        index: actIdx,
        kindIndex: kindPick,
        expression: expr,
      });
      if (res.correct) {
        onGood(`Действие ${actIdx + 1} записано верно${res.value !== undefined ? `: получилось ${res.value}` : ""}!`);
        setKindPick(null);
        setExpr("");
        if (actIdx + 1 >= (sup.actions?.length ?? 0)) {
          nextPhase();
        } else {
          setActIdx(actIdx + 1);
        }
      } else {
        await onWrong();
      }
    } finally {
      setBusy(false);
    }
  }

  async function checkFindError() {
    setBusy(true);
    try {
      const res = await api<{ correct: boolean; lineOk?: boolean }>("/api/olympiad/check", {
        problemId: problem.id,
        kind: "findError",
        lineIndex: linePick,
        fix,
      });
      if (res.correct) {
        onGood("Ошибка найдена и исправлена — отличная внимательность!");
        nextPhase();
      } else {
        await onWrong();
      }
    } finally {
      setBusy(false);
    }
  }

  async function checkFinal() {
    setBusy(true);
    try {
      const res = await api<{ correct: boolean }>("/api/olympiad/check", {
        problemId: problem.id,
        kind: "final",
        answer,
      });
      if (res.correct) {
        onSolved(answer);
      } else {
        await onWrong();
      }
    } finally {
      setBusy(false);
    }
  }

  if (phase === "plan" && sup.planCards) {
    const pool = sup.planCards.map((c, i) => ({ c, i })).filter(({ i }) => !planPick.includes(i));
    return (
      <div className="oly-step">
        <div className="oly-step-prompt">Собери план решения: нажимай шаги по порядку.</div>
        <div className="plan-picked">
          {planPick.map((i, ord) => (
            <button
              key={i}
              className="plan-card in-plan"
              onClick={() => setPlanPick(planPick.filter((x) => x !== i))}
            >
              <span className="ord">{ord + 1}</span>
              {sup.planCards![i]}
            </button>
          ))}
        </div>
        <div className="plan-pool">
          {pool.map(({ c, i }) => (
            <button key={i} className="plan-card" onClick={() => setPlanPick([...planPick, i])}>
              {c}
            </button>
          ))}
        </div>
        {planPick.length > 0 && (
          <div className="plan-hint">Нажми на шаг в плане, чтобы убрать его.</div>
        )}
        <div className="oly-input-row">
          <button
            className="btn-cta btn-cta--blue oly-check"
            disabled={planPick.length !== sup.planCards.length || busy}
            onClick={() => void checkPlan()}
          >
            Проверить план
          </button>
        </div>
      </div>
    );
  }

  if (phase === "actions" && sup.actions) {
    const a = sup.actions[actIdx];
    return (
      <div className="oly-step">
        <div className="oly-step-num">
          Действие {actIdx + 1} из {sup.actions.length}
          {problem.actionsCount ? ` (в задаче ${problem.actionsCount} действия)` : ""}
        </div>
        <div className="action-block">
          <div className="oly-step-prompt">Что это за действие?</div>
          <div className="action-kinds">
            {a.kinds.map((k, i) => (
              <button
                key={i}
                className={`oly-option${kindPick === i ? " picked" : ""}`}
                onClick={() => setKindPick(i)}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="oly-input-row">
            <input
              className="oly-input"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="Запиши выражение, напр. 10×4"
            />
            <button
              className="btn-cta btn-cta--blue oly-check"
              disabled={kindPick === null || !expr.trim() || busy}
              onClick={() => void checkAction()}
            >
              Проверить
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "findError" && sup.findError) {
    return (
      <div className="oly-step">
        <div className="oly-step-prompt">В этом решении спряталась ошибка. Найди строку и исправь её!</div>
        {sup.findError.lines.map((line, i) => (
          <button
            key={i}
            className={`fe-line${linePick === i ? " picked" : ""}`}
            onClick={() => setLinePick(i)}
          >
            {i + 1}. {line}
          </button>
        ))}
        <div className="oly-input-row">
          <input
            className="oly-input"
            value={fix}
            onChange={(e) => setFix(e.target.value)}
            placeholder="Как должно быть правильно?"
          />
          <button
            className="btn-cta btn-cta--blue oly-check"
            disabled={linePick === null || !fix.trim() || busy}
            onClick={() => void checkFindError()}
          >
            Проверить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="oly-step">
      <div className="oly-step-prompt">План выполнен — записывай ответ!</div>
      <div className="oly-input-row">
        <input
          className="oly-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ответ…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && answer.trim()) void checkFinal();
          }}
        />
        <button
          className="btn-cta btn-cta--blue oly-check"
          disabled={!answer.trim() || busy}
          onClick={() => void checkFinal()}
        >
          Проверить
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// L3 — листочек: ответ + фото
// ─────────────────────────────────────────────
function WorksheetRunner({
  problem,
  onWrong,
  onSolved,
}: {
  problem: SanProblem;
  onWrong: () => Promise<number>;
  onSolved: (answer: string, worksheetUrl?: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await api<{ correct: boolean }>("/api/olympiad/check", {
        problemId: problem.id,
        kind: "final",
        answer,
      });
      if (!res.correct) {
        await onWrong();
        return;
      }
      let url: string | undefined;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/olympiad/upload", { method: "POST", body: fd });
        const data = (await up.json()) as { url?: string };
        url = data.url;
      }
      onSolved(answer, url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="oly-step">
      <div className="ws-note">
        <span className="glyph" aria-hidden="true">📝</span>
        <span>
          Реши задачу на листочке — полностью, с рассуждением. Потом запиши ответ и сфотографируй
          листочек: его проверит методист.
        </span>
      </div>
      <div className="oly-input-row">
        <input
          className="oly-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Твой ответ…"
        />
      </div>
      <div className="ws-photo">
        <label className="ws-photo-label">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <span className="ws-photo-done">✓ Фото готово: {file.name}</span>
          ) : (
            <>📷 Сфотографировать листочек</>
          )}
        </label>
      </div>
      <div className="oly-input-row">
        <button
          className="btn-cta btn-cta--blue oly-check"
          disabled={!answer.trim() || busy}
          onClick={() => void submit()}
        >
          Отправить решение
        </button>
      </div>
    </div>
  );
}
