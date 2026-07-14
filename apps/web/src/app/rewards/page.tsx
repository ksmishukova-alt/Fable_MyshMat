"use client";

/**
 * Награды: киоск наклеек (пакетики за звёзды, как настоящие коллекции),
 * значки-темы (карта мышления), загадка дня.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeArt, type BadgeTier } from "@/components/BadgeArt";
import { StickerCard } from "@/components/StickerCard";
import { AlbumIcon, MedalIcon, BrainIcon, StarIcon } from "@/components/Icons";
import { stickerById, stickerNumber } from "@/lib/stickers-catalog";
import "./rewards.css";

interface RewardsData {
  stars: number;
  badges: { topicId: string; title: string; glyph: string; color: string; earned: boolean; tier: BadgeTier }[];
  stickers: { total: number; owned: string[]; packPrice: number };
  riddle: { question: string; hint: string; rewardStars: number; solved: boolean };
}

type PackPhase = "idle" | "opening" | "revealed";

export default function RewardsPage() {
  const [data, setData] = useState<RewardsData | null>(null);
  const [bump, setBump] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [riddleMsg, setRiddleMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [packPhase, setPackPhase] = useState<PackPhase>("idle");
  const [packCards, setPackCards] = useState<string[]>([]);
  const [packMsg, setPackMsg] = useState<string | null>(null);

  useEffect(() => {
    void reload();
  }, []);

  async function reload() {
    const d = (await (await fetch("/api/rewards")).json()) as RewardsData;
    setData(d);
  }

  async function buyPack() {
    if (packPhase !== "idle") return;
    setPackMsg(null);
    setPackPhase("opening");
    const res = await fetch("/api/rewards/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pack" }),
    });
    const d = (await res.json()) as { ok: boolean; reason?: string; stickers?: string[] };
    if (!res.ok || !d.ok || !d.stickers) {
      setPackPhase("idle");
      setPackMsg(
        d.reason === "not-enough-stars"
          ? "Пока не хватает звёзд — заработай их в Daily и олимпиаде!"
          : d.reason === "collection-complete"
            ? "Вся коллекция уже собрана — ты чемпион!"
            : "Не получилось купить пакетик, попробуй ещё раз.",
      );
      return;
    }
    // пакетик «рвётся» ~1.2s, потом веер карточек
    setPackCards(d.stickers);
    setBump(true);
    setTimeout(() => setBump(false), 550);
    setTimeout(() => setPackPhase("revealed"), 1200);
    await reload();
  }

  function closePack() {
    setPackPhase("idle");
    setPackCards([]);
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
  const collected = data.stickers.owned.length;
  const complete = collected >= data.stickers.total;

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
          {/* Киоск наклеек */}
          <section className="rw-card kiosk-card">
            <h2><AlbumIcon /> Киоск наклеек</h2>
            <div className="sub">
              Собрано {collected} из {data.stickers.total} карточек «Команды МышМат»
            </div>
            <div className="kiosk-row">
              <button
                type="button"
                className={`pack${packPhase === "opening" ? " tearing" : ""}`}
                onClick={() => void buyPack()}
                disabled={packPhase !== "idle" || complete || data.stars < data.stickers.packPrice}
                aria-label="Купить пакетик наклеек"
              >
                <span className="pack-body">
                  <span className="pack-logo">МЫШМАТ</span>
                  <span className="pack-title">КОМАНДА</span>
                  <span className="pack-count">3 карточки</span>
                </span>
                <span className="pack-tear" aria-hidden="true" />
              </button>
              <div className="kiosk-info">
                <p>
                  В каждом пакетике — <b>3 случайные карточки</b>. Попадаются редкие с фольгой
                  и суперредкие капитаны команд!
                </p>
                <button
                  className="btn-cta btn-cta--orange"
                  disabled={packPhase !== "idle" || complete || data.stars < data.stickers.packPrice}
                  onClick={() => void buyPack()}
                >
                  {complete ? "Всё собрано!" : (
                    <>Купить пакетик · <StarIcon size={16} /> {data.stickers.packPrice}</>
                  )}
                </button>
                <Link className="kiosk-album-link" href="/stickers">
                  Открыть альбом ▶
                </Link>
                {packMsg && <div className="kiosk-msg">{packMsg}</div>}
              </div>
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
                  {showHint && <span className="riddle-note">{data.riddle.hint}</span>}
                </div>
                {riddleMsg && <div className="riddle-note">{riddleMsg}</div>}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Вскрытие пакетика */}
      {packPhase !== "idle" && (
        <div className="pack-modal" role="dialog" aria-label="Пакетик наклеек">
          {packPhase === "opening" ? (
            <div className="pack pack-big tearing" aria-hidden="true">
              <span className="pack-body">
                <span className="pack-logo">МЫШМАТ</span>
                <span className="pack-title">КОМАНДА</span>
                <span className="pack-count">3 карточки</span>
              </span>
              <span className="pack-tear" />
            </div>
          ) : (
            <div className="pack-reveal">
              <div className="pack-reveal-title">Твои новые карточки!</div>
              <div className="pack-cards">
                {packCards.map((id, i) => {
                  const s = stickerById(id);
                  return s ? (
                    <div className="pack-card" style={{ animationDelay: `${i * 0.18}s` }} key={id}>
                      <StickerCard sticker={s} num={stickerNumber(id)} size={140} />
                      <span className={`pack-card-rarity ${s.rarity}`}>
                        {s.rarity === "epic" ? "СУПЕРРЕДКАЯ!" : s.rarity === "rare" ? "Редкая!" : "Новичок в команде"}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="pack-reveal-actions">
                <button className="btn-cta btn-cta--blue" onClick={closePack}>
                  Класс! <span>▶</span>
                </button>
                <Link className="kiosk-album-link light" href="/stickers">
                  В альбом ▶
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
