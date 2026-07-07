import Link from "next/link";
import { getCurrentChildId } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { mockOwnedStickers } from "@/lib/chest";
import { STICKER_CATALOG } from "@/lib/stickers-catalog";
import { StickerArt } from "@/components/StickerArt";
import "./stickers.css";

export const dynamic = "force-dynamic";

/** Альбом наклеек: серии, собранные и «пустые слоты». */
export default async function StickersPage() {
  const childId = await getCurrentChildId();
  const db = getSupabase();
  let owned: Set<string>;
  if (db) {
    const { data } = await db
      .from("sticker_ownership")
      .select("sticker_id")
      .eq("child_id", childId);
    owned = new Set((data ?? []).map((r) => r.sticker_id as string));
  } else {
    owned = new Set(mockOwnedStickers(childId));
  }

  const series = [...new Set(STICKER_CATALOG.map((s) => s.series))];
  const total = STICKER_CATALOG.length;
  const collected = STICKER_CATALOG.filter((s) => owned.has(s.id)).length;

  return (
    <main className="st-stage" aria-label="Альбом наклеек">
      <div className="st-wrap">
        <div className="st-top">
          <Link className="st-back" href="/" aria-label="На главную">
            ←
          </Link>
          <div className="st-title">Альбом наклеек</div>
          <div className="st-count">
            {collected} / {total}
          </div>
        </div>

        {series.map((name) => {
          const items = STICKER_CATALOG.filter((s) => s.series === name);
          const got = items.filter((s) => owned.has(s.id)).length;
          const pct = Math.round((got / items.length) * 100);
          return (
            <section className="st-series" key={name}>
              <h2>
                {name} · {got}/{items.length}
              </h2>
              <div className="progress" aria-label={`Серия «${name}»: ${pct}%`}>
                <i style={{ inlineSize: `${pct}%` }} />
              </div>
              <div className="st-grid">
                {items.map((s) => {
                  const has = owned.has(s.id);
                  return (
                    <div
                      key={s.id}
                      className={`sticker-tile ${s.rarity}${has ? "" : " missing"}`}
                      title={has ? s.title : "Ещё не найдена"}
                    >
                      {s.rarity !== "common" && (
                        <span className="rarity" aria-hidden="true">
                          {s.rarity === "epic" ? "💎" : "✦"}
                        </span>
                      )}
                      <div>
                        <span className="glyph" aria-hidden="true">
                          <StickerArt art={s.art} size={44} />
                        </span>
                        <b>{has ? s.title : "?"}</b>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
