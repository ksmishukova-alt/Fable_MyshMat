"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ChestState, ChestPrize } from "@/types/rewards";
import { prizeGlyph } from "@/lib/chest";
import "./chests.css";

const CONFETTI_COLORS = ["#FFB33A", "#4A8DFF", "#8B5CF6", "#42C263", "#F45D9E", "#FFD342"];

export default function ChestsPage() {
  const [state, setState] = useState<ChestState | null>(null);
  const [opening, setOpening] = useState(false);
  const [prize, setPrize] = useState<ChestPrize | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    fetch("/api/chest")
      .then((r) => r.json())
      .then((s: ChestState) => {
        setState(s);
        if (s.opened && s.prize) setPrize(s.prize);
      })
      .catch(() => {});
  }, []);

  async function open() {
    if (!state?.unlocked || state.opened || opening) return;
    setOpening(true);
    try {
      const res = await fetch("/api/chest", { method: "POST" });
      const data = await res.json();
      if (data.ok && data.prize) {
        setTimeout(() => {
          setPrize(data.prize);
          setConfetti(true);
        }, 420);
        setState({ ...state, opened: true, prize: data.prize });
      }
    } finally {
      setTimeout(() => setOpening(false), 500);
    }
  }

  const ready = !!state?.unlocked && !state.opened && !prize;
  const locked = !!state && !state.unlocked;

  return (
    <main className="chest-stage" aria-label="Сундук дня">
      <div
        className={`chest-card${ready ? " chest-ready" : ""}${locked ? " chest-locked" : ""}${
          opening ? " chest-opening" : ""
        }`}
      >
        <Link className="chest-back" href="/" aria-label="На главную">
          ←
        </Link>
        <h1 className="chest-title">Сундук дня</h1>
        <p className="chest-sub">
          {locked
            ? "Сначала закончи Daily — МышРутка привезёт ключ!"
            : prize
              ? "Вот что внутри:"
              : state
                ? "Ключ у тебя! Нажми на сундук"
                : "Загружаем…"}
        </p>

        <div className="chest-img-wrap">
          {ready && <span className="chest-glow" aria-hidden="true" />}
          <img
            className="chest-img"
            src="/myshmat-assets/chest-large.png"
            alt="Сундук"
            onClick={open}
            role={ready ? "button" : undefined}
            tabIndex={ready ? 0 : -1}
            onKeyDown={(e) => {
              if (ready && (e.key === "Enter" || e.key === " ")) void open();
            }}
          />
        </div>

        {prize && (
          <div className="prize-pop" role="status">
            <span className="prize-glyph">{prizeGlyph(prize)}</span>
            <div className="prize-label">{prize.label}</div>
          </div>
        )}

        {prize && (
          <Link className="btn-cta btn-cta--blue chest-cta" href="/topics">
            В олимпиадный мир <span>▶</span>
          </Link>
        )}

        {confetti && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 36 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 137) % 100}%`,
                  background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  animationDelay: `${(i % 12) * 0.07}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
