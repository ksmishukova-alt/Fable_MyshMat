import type { CSSProperties } from "react";
import type { CatalogSticker } from "@/lib/stickers-catalog";

/**
 * Карточка-наклейка «Команда МышМат» в духе футбольных коллекций:
 * пастельный фон команды с полутоновым узором и большой буквой-вотермаркой,
 * портрет героя (DiceBear), плашка с именем, плашка-«статистика»,
 * бренд-марка и номер в команде. Фольга — у rare/epic.
 */
export function StickerCard({
  sticker,
  num,
  size,
}: {
  sticker: CatalogSticker;
  num: number;
  /** px; без него карточка тянется на ширину слота */
  size?: number;
}) {
  const photo = `https://api.dicebear.com/9.x/${sticker.look}/svg?seed=${encodeURIComponent(
    sticker.seed,
  )}&size=160&backgroundColor=transparent`;
  const style = {
    "--team": sticker.color,
    "--card-bg": sticker.cardBg,
    inlineSize: size ? `${size}px` : "100%",
  } as CSSProperties;
  return (
    <div className={`pcard r-${sticker.rarity}`} style={style} title={sticker.title}>
      <span className="pcard-wm" aria-hidden="true">
        {sticker.series.slice(0, 1)}
      </span>
      <span className="pcard-halftone" aria-hidden="true" />
      <span className="pcard-num" aria-hidden="true">
        {num}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pcard-photo" src={photo} alt={sticker.title} loading="lazy" />
      <div className="pcard-plates">
        <div className="pcard-name">{sticker.title}</div>
        <div className="pcard-fact">{sticker.fact}</div>
      </div>
      <div className="pcard-foot">
        <span className="pcard-brand">МЫШМАТ</span>
        <span className="pcard-team">{sticker.series}</span>
      </div>
      {sticker.rarity !== "common" && (
        <span className={`pcard-foil ${sticker.rarity}`} aria-hidden="true" />
      )}
    </div>
  );
}
