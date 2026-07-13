"use client";

/**
 * Дуэли: три мини-игры на скорость мышления + таблица лидеров.
 *  - Устный счёт (60 c) · Закономерности (90 c) · Быстрая логика (60 c)
 * Очки: +10 за верный ответ, серия из 5 подряд даёт +5 бонуса. Ошибка сбрасывает серию.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DUEL_GAMES, type DuelGameId, type LeaderboardRow } from "@/types/duels";
import { BoltIcon, PatternIcon, TargetIcon, StarIcon } from "@/components/Icons";
import "./duels.css";

interface Question {
  text: string;
  options: string[];
  correct: number;
}

function rnd(n: number): number {
  return Math.floor(Math.random() * n);
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Варианты: правильный + правдоподобные искажения. */
function numericOptions(answer: number): { options: string[]; correct: number } {
  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const delta = [1, 2, 10, answer >= 20 ? 5 : 3][rnd(4)] * (rnd(2) ? 1 : -1);
    const candidate = answer + delta;
    if (candidate >= 0) set.add(candidate);
  }
  const options = shuffle([...set]).map(String);
  return { options, correct: options.indexOf(String(answer)) };
}

function genMentalMath(level: number): Question {
  const kind = rnd(level > 3 ? 3 : 2);
  if (kind === 0) {
    const a = 10 + rnd(40 + level * 10);
    const b = 10 + rnd(40 + level * 10);
    const { options, correct } = numericOptions(a + b);
    return { text: `${a} + ${b}`, options, correct };
  }
  if (kind === 1) {
    const b = 10 + rnd(30 + level * 8);
    const a = b + 5 + rnd(40 + level * 10);
    const { options, correct } = numericOptions(a - b);
    return { text: `${a} − ${b}`, options, correct };
  }
  const a = 3 + rnd(7 + level);
  const b = 3 + rnd(9);
  const { options, correct } = numericOptions(a * b);
  return { text: `${a} × ${b}`, options, correct };
}

function genPatterns(level: number): Question {
  const kind = rnd(3);
  if (kind === 0) {
    const start = 1 + rnd(12);
    const step = 2 + rnd(3 + level);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    const { options, correct } = numericOptions(start + step * 4);
    return { text: `${seq.join(", ")}, … ?`, options, correct };
  }
  if (kind === 1) {
    const start = 1 + rnd(4);
    const seq = [start, start * 2, start * 4, start * 8];
    const { options, correct } = numericOptions(start * 16);
    return { text: `${seq.join(", ")}, … ?`, options, correct };
  }
  // лишнее: три чётных + одно нечётное (или наоборот)
  const evenOdd = rnd(2);
  const nums: number[] = [];
  while (nums.length < 3) {
    const n = 2 + rnd(40);
    if (n % 2 === evenOdd) continue;
    if (!nums.includes(n)) nums.push(n);
  }
  let odd = 0;
  do {
    odd = 2 + rnd(40);
  } while (odd % 2 !== evenOdd);
  const options = shuffle([...nums.map(String), String(odd)]);
  return {
    text: "Найди лишнее число",
    options,
    correct: options.indexOf(String(odd)),
  };
}

function genQuickLogic(level: number): Question {
  const kind = rnd(3);
  if (kind === 0) {
    const a = 5 + rnd(30 + level * 10);
    const b = 5 + rnd(30 + level * 10);
    const claimGreater = rnd(2) === 1;
    const truth = claimGreater ? a > b : a < b;
    return {
      text: `${a} ${claimGreater ? ">" : "<"} ${b}`,
      options: ["Верно", "Неверно"],
      correct: truth ? 0 : 1,
    };
  }
  if (kind === 1) {
    const n = 4 + rnd(60);
    const saidEven = rnd(2) === 1;
    const truth = (n % 2 === 0) === saidEven;
    return {
      text: `${n} — ${saidEven ? "чётное" : "нечётное"}`,
      options: ["Верно", "Неверно"],
      correct: truth ? 0 : 1,
    };
  }
  const a = 2 + rnd(8);
  const b = 2 + rnd(8);
  const real = a * b;
  const shown = rnd(2) ? real : real + (rnd(2) ? 1 : -1) * (1 + rnd(3));
  return {
    text: `${a} × ${b} = ${shown}`,
    options: ["Верно", "Неверно"],
    correct: shown === real ? 0 : 1,
  };
}

const GENERATORS: Record<DuelGameId, (level: number) => Question> = {
  "mental-math": genMentalMath,
  patterns: genPatterns,
  "quick-logic": genQuickLogic,
};

type Screen = "menu" | "playing" | "done";

export default function DuelsPage() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [gameId, setGameId] = useState<DuelGameId>("mental-math");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState<Question | null>(null);
  const [flash, setFlash] = useState<{ idx: number; good: boolean } | null>(null);
  const [board, setBoard] = useState<LeaderboardRow[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const finish = useCallback(
    async (finalScore: number, finalCorrect: number, finalWrong: number) => {
      stop();
      setScreen("done");
      const res = await fetch("/api/duels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, score: finalScore, correct: finalCorrect, wrong: finalWrong }),
      });
      const d = (await res.json()) as { leaderboard?: LeaderboardRow[] };
      if (d.leaderboard) setBoard(d.leaderboard);
    },
    [gameId, stop],
  );

  function start(id: DuelGameId) {
    setGameId(id);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setTimeLeft(DUEL_GAMES[id].roundSeconds);
    setQ(GENERATORS[id](0));
    setScreen("playing");
    stop();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
  }

  // конец времени (без замыкания на устаревший счёт)
  const stateRef = useRef({ score, correct, wrong });
  stateRef.current = { score, correct, wrong };
  useEffect(() => {
    if (screen === "playing" && timeLeft <= 0) {
      const s = stateRef.current;
      void finish(s.score, s.correct, s.wrong);
    }
  }, [timeLeft, screen, finish]);

  function answer(idx: number) {
    if (!q || flash) return;
    const good = idx === q.correct;
    setFlash({ idx, good });
    setTimeout(() => {
      setFlash(null);
      if (good) {
        const newStreak = streak + 1;
        const bonus = newStreak % 5 === 0 ? 5 : 0;
        setScore((s) => s + 10 + bonus);
        setCorrect((c) => c + 1);
        setStreak(newStreak);
      } else {
        setWrong((w) => w + 1);
        setStreak(0);
      }
      setQ(GENERATORS[gameId](Math.floor((correct + wrong) / 5)));
    }, 260);
  }

  const game = DUEL_GAMES[gameId];

  return (
    <main className="du-stage" aria-label="Дуэли">
      <div className="du-wrap">
        <div className="du-top">
          <Link className="du-back" href="/" aria-label="На главную">
            ←
          </Link>
          <div>
            <div className="du-title">Дуэли</div>
            <div className="du-sub">Скорость мышления, а не оценки: сыграй и попади в таблицу лидеров!</div>
          </div>
        </div>

        {screen === "menu" && (
          <div className="du-games">
            {Object.values(DUEL_GAMES).map((g) => (
              <button key={g.id} className="du-game" onClick={() => start(g.id)}>
                <span className="glyph" aria-hidden="true">
                  {g.id === "mental-math" ? (
                    <BoltIcon size={44} />
                  ) : g.id === "patterns" ? (
                    <PatternIcon size={44} />
                  ) : (
                    <TargetIcon size={44} />
                  )}
                </span>
                <b>{g.title}</b>
                <p>
                  {g.description} · {g.roundSeconds} сек
                </p>
              </button>
            ))}
          </div>
        )}

        {screen === "playing" && q && (
          <div className="du-round">
            <div className="du-hud">
              <span className={`du-timer${timeLeft <= 10 ? " low" : ""}`} role="timer">
                ⏱ {Math.max(0, timeLeft)}
              </span>
              <b style={{ color: "#44557e" }}>{game.title}</b>
              <span className="du-score"><StarIcon size={16} /> {score}</span>
            </div>
            <div className="du-question" key={q.text}>
              {q.text}
            </div>
            <div className="du-options">
              {q.options.map((o, i) => (
                <button
                  key={`${q.text}-${i}`}
                  className={`du-option${
                    flash && flash.idx === i ? (flash.good ? " flash-good" : " flash-bad") : ""
                  }`}
                  onClick={() => answer(i)}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="du-streak">
              {streak >= 2 ? `🔥 Серия: ${streak}${streak % 5 === 4 ? " — ещё один до бонуса!" : ""}` : ""}
            </div>
          </div>
        )}

        {screen === "done" && (
          <div className="du-round">
            <span className="du-result-glyph" aria-hidden="true">
              {score >= 150 ? "🏆" : score >= 80 ? "🎉" : "💪"}
            </span>
            <div className="du-result-score">{score} очков</div>
            <div className="du-result-note">
              Верно: {correct} · Ошибок: {wrong}
            </div>
            <div className="du-actions">
              <button className="btn-cta btn-cta--blue" onClick={() => start(gameId)}>
                Ещё раз <span>▶</span>
              </button>
              <button className="btn-cta btn-cta--purple" onClick={() => setScreen("menu")}>
                Другая игра
              </button>
            </div>
            <div className="du-board">
              <h3>Таблица лидеров · {game.title}</h3>
              {board.length === 0 && <p style={{ color: "#7a89a5", fontWeight: 600 }}>Ты первый!</p>}
              {board.map((r) => (
                <div className="du-row" key={r.childId}>
                  <span className="rank">{r.rank}</span>
                  {r.childName}
                  <span className="pts">{r.bestScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
