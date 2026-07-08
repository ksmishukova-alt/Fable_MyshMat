/**
 * Аватар ребёнка — DiceBear (open source, MIT): красивые готовые стили,
 * генерация по seed. Рендер — официальный hosted API api.dicebear.com (v9),
 * в БД храним только {style, seed, bg} JSON-строкой в child_profiles.avatar_url.
 */
import { getSupabase } from "@/lib/supabase";

export const AVATAR_STYLES: Record<string, string> = {
  adventurer: "Приключенцы",
  "big-smile": "Улыбашки",
  "fun-emoji": "Смайлики",
};

/** Пастельные фоны DiceBear. */
export const AVATAR_BGS = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"] as const;

export interface AvatarConfig {
  style: string;
  seed: string;
  bg: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  style: "adventurer",
  seed: "myshmat",
  bg: "b6e3f4",
};

/** URL картинки аватара (SVG с CDN DiceBear). */
export function avatarUrl(config: AvatarConfig, size = 96): string {
  const style = AVATAR_STYLES[config.style] ? config.style : DEFAULT_AVATAR.style;
  const bg = /^[0-9a-f]{6}$/i.test(config.bg) ? config.bg : DEFAULT_AVATAR.bg;
  const params = new URLSearchParams({
    seed: config.seed || "myshmat",
    size: String(size),
    backgroundColor: bg,
    radius: "50",
  });
  return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
}

export function parseAvatar(raw: string | null | undefined): AvatarConfig {
  if (!raw) return DEFAULT_AVATAR;
  try {
    const v = JSON.parse(raw) as Partial<AvatarConfig> & Record<string, unknown>;
    if (typeof v.seed === "string" && v.seed) {
      return {
        style:
          typeof v.style === "string" && AVATAR_STYLES[v.style] ? v.style : DEFAULT_AVATAR.style,
        seed: v.seed.slice(0, 64),
        bg: typeof v.bg === "string" && /^[0-9a-f]{6}$/i.test(v.bg) ? v.bg : DEFAULT_AVATAR.bg,
      };
    }
    // старый формат конструктора (kind/skin/hair/…) → детерминированный seed
    return { ...DEFAULT_AVATAR, seed: `legacy-${raw.replace(/[^a-zа-яё0-9]/gi, "").slice(0, 40)}` };
  } catch {
    return DEFAULT_AVATAR;
  }
}

const mockAvatars = new Map<string, AvatarConfig>();

export async function getAvatar(childId: string): Promise<AvatarConfig> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("child_profiles")
      .select("avatar_url")
      .eq("id", childId)
      .maybeSingle();
    return parseAvatar(data?.avatar_url as string | null);
  }
  return mockAvatars.get(childId) ?? DEFAULT_AVATAR;
}

/** Сохранение. persistent=false → БД не подключена, изменения не переживут перезапуск. */
export async function saveAvatar(
  childId: string,
  config: AvatarConfig,
): Promise<{ ok: boolean; persistent: boolean }> {
  const clean = parseAvatar(JSON.stringify(config));
  const db = getSupabase();
  if (db) {
    const { error } = await db
      .from("child_profiles")
      .update({ avatar_url: JSON.stringify(clean) })
      .eq("id", childId);
    return { ok: !error, persistent: true };
  }
  mockAvatars.set(childId, clean);
  return { ok: true, persistent: false };
}
