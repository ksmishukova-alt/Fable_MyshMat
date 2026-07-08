import Link from "next/link";
import { getCurrentChildId } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { mockOwnedStickers } from "@/lib/chest";
import { STICKER_CATALOG } from "@/lib/stickers-catalog";
import { StickerBook } from "@/components/StickerBook";
import "./stickers.css";

export const dynamic = "force-dynamic";

/** Альбом наклеек — журнал с перелистыванием. */
export default async function StickersPage() {
  const childId = await getCurrentChildId();
  const db = getSupabase();
  let owned: string[];
  if (db) {
    const { data } = await db
      .from("sticker_ownership")
      .select("sticker_id")
      .eq("child_id", childId);
    owned = (data ?? []).map((r) => r.sticker_id as string);
  } else {
    owned = mockOwnedStickers(childId);
  }
  const collected = STICKER_CATALOG.filter((s) => owned.includes(s.id)).length;

  return (
    <main className="st-stage" aria-label="Альбом наклеек">
      <div className="st-wrap">
        <div className="st-top">
          <Link className="st-back" href="/" aria-label="На главную">
            ←
          </Link>
          <div className="st-title">Альбом наклеек</div>
          <div className="st-count">
            {collected} / {STICKER_CATALOG.length}
          </div>
        </div>
        <StickerBook owned={owned} />
      </div>
    </main>
  );
}
