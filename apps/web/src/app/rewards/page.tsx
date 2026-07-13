"use client";

/**
 * Награды: маскот-тамагочи (SVG-наряды), лавка за звёзды,
 * значки-темы (карта мышления), загадка дня.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { MascotView, ItemArt } from "@/components/MascotView";
import { BadgeArt, type BadgeTier } from "@/components/BadgeArt";
import { MouseIcon, ShopIcon, MedalIcon, BrainIcon, StarIcon } from "@/components/Icons";
import type { MascotState, ShopItem } from "@/types/rewards";
import "./rewards.css";

interface RewardsData {
  stars: number;
  mascot: MascotState;
  badges: { topicId: string; title: string; glyph: string; color: string; earned: boolean; tier: BadgeTier }[];
  shop: ShopItem[];
  riddle: { question: string; hint: string; rewardStars: number; solved: boolean };
}


export default function RewardsPage() {
  const [data, setData] = useState<RewardsData | null>(null);
  const [bump, setBump] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [riddleMsg, setRiddleMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    void reload();
  }, []);

  async function reload() {
    const d = (await (await fetch("/api/rewards")).json()) as RewardsData;
    setData(d);
  }

  async function shopAction(action: "buy" | "equip", itemId: string) {
    const res = await fetch("/api/rewards/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, itemId }),
    });
    if (res.ok && action === "buy") {
      setBump(true);
      setTimeout(() => setBump(false), 550);
    }
    await reload();
  }

  async function answerRiddle() {
    const res = (await (
      await fetch("/api/rewards/riddle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: riddleAnswer }),
      })
    ).json()) as { correct: boolean; stars?: number; already?: boolean };
    if (res.correct) {
      setRiddleMsg(
        res.already ? "Ты уже разгадал сегодняшнюю загадку!" : `Верно! +${res.stars} звёзд`,
      );
      setBump(true);
      setTimeout(() => setBump(false), 550);
      await reload();
    } else {
      setRiddleMsg("Пока не то — подумай ещё!");
    }
  }

  if (!data) {
    return (
      <main className="rw-stage">
        <div className="rw-wrap">Загружаем награды…</div>
      </main>
    );
  }

  const earnedCount = data.badges.filter((b) => b.earned).length;

  return (
    <main className="rw-stage" aria-label="Награды">
      <div className="rw-wrap">
        <div className="rw-top">
          <Link className="rw-back" href="/" aria-label="На главную">
            ←
          </Link>
          <div className="rw-title">Награды</div>
          <div className={`rw-stars${bump ? " bump" : ""}`} aria-label={`Звёзд: ${data.stars}`}>
            <StarIcon /> {data.stars}
          </div>
        </div>

        <div className="rw-grid">
          {/* Маскот */}
          <section className="rw-card mascot-card">
            <h2><MouseIcon /> Твой Мыш</h2>
            <div className="sub">Растёт от пройденных тем олимпиадного маршрута</div>
            <MascotView stage={data.mascot.growthStage} equipped={data.mascot.equipped} size={190} />
            <div className="growth-row" aria-label={`Ступень роста: ${data.mascot.growthStage} из 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <i key={i} className={i <= data.mascot.growthStage ? "on" : ""} />
              ))}
            </div>
            <div className="growth-note">
              Ступень {data.mascot.growthStage} из 5 · приручай темы — Мыш подрастёт!
            </div>
          </section>

          {/* Лавка */}
          <section className="rw-card">
            <h2><ShopIcon /> Лавка</h2>
            <div className="sub">Трать звёзды — наряды по-настоящему появляются на Мыше</div>
            <div className="shop-grid">
              {data.shop.map((item) => {
                const owned = data.mascot.owned.includes(item.id);
                const equipped = data.mascot.equipped.includes(item.id);
                return (
                  <div className="shop-item" key={item.id}>
                    <span className="glyph" aria-hidden="true">
                      <ItemArt art={item.art} size={42} />
                    </span>
                    <b>{item.title}</b>
                    <span className="desc">{item.description}</span>
                    {owned ? (
                      <button
                        className={`equip${equipped ? " on" : ""}`}
                        onClick={() => void shopAction("equip", item.id)}
                      >
                        {equipped ? "✓ Надето" : "Надеть"}
                      </button>
                    ) : (
                      <button
                        className="buy"
                        disabled={data.stars < item.priceStars}
                        onClick={() => void shopAction("buy", item.id)}
                      >
                        <StarIcon size={16} /> {item.priceStars}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Карта мышления: значки */}
          <section className="rw-card">
            <h2><MedalIcon /> Карта мышления</h2>
            <div className="sub">
              Бронза — тренировка пройдена · серебро — уровень «С поддержкой» · золото — тема освоена. Золотых: {earnedCount} из {data.badges.length}
            </div>
            <div className="badge-grid">
              {data.badges.map((b) => (
                <div className={`badge${b.tier === "none" ? " off" : ""}`} key={b.topicId}>
                  <span className="badge-art" aria-hidden="true">
                    <BadgeArt topicId={b.topicId} tier={b.tier} size={56} />
                  </span>
                  <b>{b.title}</b>
                  <span className={`tier-label ${b.tier}`}>
                    {b.tier === "gold"
                      ? "Золото"
                      : b.tier === "silver"
                        ? "Серебро"
                        : b.tier === "bronze"
                          ? "Бронза"
                          : "Впереди!"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Загадка дня */}
          <section className="rw-card">
            <h2><BrainIcon /> Загадка дня</h2>
            <div className="sub">Маленькая головоломка-десерт · +{data.riddle.rewardStars} звёзд</div>
            <div className="riddle-q">{data.riddle.question}</div>
            {data.riddle.solved || riddleMsg?.startsWith("Верно") ? (
              <div className="riddle-solved">✓ Разгадано! Возвращайся завтра за новой загадкой.</div>
            ) : (
              <>
                <div className="riddle-row">
                  <input
                    className="rw-input"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value)}
                    placeholder="Твой ответ…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && riddleAnswer.trim()) void answerRiddle();
                    }}
                  />
                  <button
                    className="btn-cta btn-cta--orange"
                    disabled={!riddleAnswer.trim()}
                    onClick={() => void answerRiddle()}
                  >
                    Проверить
                  </button>
                </div>
                <div className="riddle-row">
                  <button className="rw-hint-btn" onClick={() => setShowHint(true)}>
                    💡 Подсказка
                  </button>
                  {showHint && <span className="growth-note">{data.riddle.hint}</span>}
                </div>
                {riddleMsg && <div className="growth-note">{riddleMsg}</div>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
