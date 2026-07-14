/**
 * Звуковые реакции (WebAudio, генерируются кодом — без файлов).
 * Отключаются кнопкой-динамиком; выбор запоминается в localStorage.
 */

const KEY = "mm-sfx-muted";
let ctx: AudioContext | null = null;

export function isSfxMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function toggleSfxMuted(): boolean {
  const next = !isSfxMuted();
  try {
    window.localStorage.setItem(KEY, next ? "1" : "0");
  } catch {
    /* приватный режим — просто без памяти */
  }
  return next;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = ctx ?? new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function note(
  ac: AudioContext,
  freq: number,
  at: number,
  dur: number,
  type: OscillatorType,
  vol: number,
): void {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g);
  g.connect(ac.destination);
  o.start(at);
  o.stop(at + dur + 0.05);
}

/** good — восходящий «дзынь» (при серии выше и ярче); bad — мягкий низкий «буммм». */
export function playSfx(kind: "good" | "bad", streak = 0): void {
  if (isSfxMuted()) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.01;
  if (kind === "good") {
    const seq = [523.25, 659.25, 783.99]; // C5 E5 G5
    if (streak >= 2) seq.push(1046.5); // C6 на серии
    seq.forEach((f, i) => note(ac, f, t + i * 0.085, 0.22, "sine", 0.16));
    note(ac, 1567.98, t + seq.length * 0.085, 0.3, "triangle", 0.05); // искорка сверху
  } else {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(150, t + 0.28);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g);
    g.connect(ac.destination);
    o.start(t);
    o.stop(t + 0.4);
  }
}
