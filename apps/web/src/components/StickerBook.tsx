"use client";

/**
 * Альбом наклеек — «журнал» с перелистыванием (в духе Panini):
 * обложка → развороты по сериям, 3D-переворот страницы, пронумерованные слоты,
 * фольга-переливы у редких, блик по собранным.
 */
import { useState } from "react";
import Link from "next/link";
import { STICKER_CATALOG, type CatalogSticker } from "@/lib/stickers-catalog";
import { StickerArt } from "@/components/StickerArt";

interface PageSpec {
  kind: "cover" | "series";
  series?: string;
}

export function StickerBook({ owned }: { owned: string[] }) {
  const ownedSet = new Set(owned);
  const series = [...new Set(STICKER_CATALOG.map((s) => s.series))];
  const pages: PageSpec[] = [{ kind: "cover" }, ...series.map((s) => ({ kind: "series" as const, series: s }))];

  const [idx, setIdx] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);

  function go(dir: "next" | "prev") {
    if (turn) return;
    const target = dir === "next" ? idx + 1 : idx - 1;
    if (target < 0 || target >= pages.length) return;
    setTurn(dir);
    setTimeout(() => {
      setIdx(target);
      setTurn(null);
    }, 420);
  }

  const page = pages[idx];
  const collected = STICKER_CATALOG.filter((s) => ownedSet.has(s.id)).length;

  return (
    <div className="book-zone">
      <div className="book" aria-live="polite">
        <div
          key={idx}
          className={`book-page${turn === "next" ? " turning-next" : ""}${turn === "prev" ? " turning-prev" : ""}`}
        >
          {page.kind === "cover" ? (
            <CoverPage collected={collected} total={STICKER_CATALOG.length} />
          ) : (
            <SeriesPage
              series={page.series!}
              items={STICKER_CATALOG.filter((s) => s.series === page.series)}
              ownedSet={ownedSet}
            />
          )}
        </div>
        {/* корешок */}
        <div className="book-spine" aria-hidden="true" />
      </div>

      <div className="book-nav">
        <button
          className="book-arrow"
          onClick={() => go("prev")}
          disabled={idx === 0 || !!turn}
          aria-label="Предыдущая страница"
        >
          ‹
        </button>
        <div className="book-dots" aria-label={`Страница ${idx + 1} из ${pages.length}`}>
          {pages.map((p, i) => (
            <button
              key={i}
              className={`book-dot${i === idx ? " on" : ""}`}
              aria-label={p.kind === "cover" ? "Обложка" : p.series}
              onClick={() => {
                if (!turn && i !== idx) {
                  setTurn(i > idx ? "next" : "prev");
                  setTimeout(() => {
                    setIdx(i);
                    setTurn(null);
                  }, 420);
                }
              }}
            />
          ))}
        </div>
        <button
          className="book-arrow"
          onClick={() => go("next")}
          disabled={idx === pages.length - 1 || !!turn}
          aria-label="Следующая страница"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function CoverPage({ collected, total }: { collected: number; total: number }) {
  return (
    <div className="book-cover">
      <div className="cover-logo">
        Мыш<span>Мат</span>
      </div>
      <div className="cover-title">Альбом наклеек</div>
      <div className="cover-badge">
        <StickerArt art="mouse-medal" size={92} />
      </div>
      <div className="cover-count">
        Собрано <b>{collected}</b> из <b>{total}</b>
      </div>
      <div className="cover-hint">Листай страницы — каждая серия ждёт своих наклеек! →</div>
    </div>
  );
}

function SeriesPage({
  series,
  items,
  ownedSet,
}: {
  series: string;
  items: CatalogSticker[];
  ownedSet: Set<string>;
}) {
  const got = items.filter((s) => ownedSet.has(s.id)).length;
  const pct = Math.round((got / items.length) * 100);
  return (
    <div className="book-series">
      <div className="series-head">
        <h2>{series}</h2>
        <span className="series-count">
          {got}/{items.length}
        </span>
      </div>
      <div className="series-progress">
        <i style={{ inlineSize: `${pct}%` }} />
      </div>
      <div className="series-grid">
        {items.map((s, n) => {
          const has = ownedSet.has(s.id);
          return (
            <div
              key={s.id}
              className={`slot ${s.rarity}${has ? " got" : " empty"}`}
              title={has ? s.title : `Наклейка №${n + 1} — ещё не найдена`}
              style={{ animationDelay: `${n * 0.05}s` }}
            >
              <span className="slot-num">{n + 1}</span>
              {has ? (
                <>
                  <StickerArt art={s.art} size={52} />
                  <b>{s.title}</b>
                  <span className="slot-shine" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span className="slot-q" aria-hidden="true">
                    ?
                  </span>
                  <b>№{n + 1}</b>
                </>
              )}
              {s.rarity !== "common" && has && (
                <span className={`slot-foil ${s.rarity}`} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      <div className="series-footer">
        {got === items.length ? "Серия собрана целиком — вот это коллекция! 🏆" : "Наклейки прячутся в ежедневном сундуке."}
      </div>
      <span className="page-corner" aria-hidden="true" />
      <Link className="series-chest-link" href="/chests">
        К сундуку ▶
      </Link>
    </div>
  );
}
