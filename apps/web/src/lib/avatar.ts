/**
 * Аватар ребёнка — конструктор «как я»: мальчик/девочка, тон кожи, причёска,
 * цвет волос, одежда, аксессуар. Хранится JSON-строкой в child_profiles.avatar_url.
 */
import { getSupabase } from "@/lib/supabase";

export type AvatarKind = "boy" | "girl";

export interface AvatarConfig {
  kind: AvatarKind;
  skin: string;
  hair: string; // цвет волос
  style: string; // причёска (зависит от kind)
  outfit: string; // цвет одежды
  acc: string; // аксессуар
}

export const SKIN_TONES: Record<string, { main: string; dark: string; label: string }> = {
  light: { main: "#ffe3cf", dark: "#e8b898", label: "Светлый" },
  peach: { main: "#f7cfae", dark: "#d9a87f", label: "Персиковый" },
  tan: { main: "#e0aa7e", dark: "#bc8557", label: "Смуглый" },
  deep: { main: "#a86f4d", dark: "#82502f", label: "Тёмный" },
};

export const HAIR_COLORS: Record<string, { main: string; dark: string; label: string }> = {
  brown: { main: "#7a4f2b", dark: "#5a3517", label: "Каштановые" },
  black: { main: "#2f3542", dark: "#191e28", label: "Тёмные" },
  blond: { main: "#ecc464", dark: "#c99a34", label: "Светлые" },
  red: { main: "#cf6633", dark: "#a3481c", label: "Рыжие" },
  ashy: { main: "#b3a493", dark: "#8c7c68", label: "Русые" },
};

/** Причёски: для девочки и мальчика свои. */
export const HAIR_STYLES: Record<AvatarKind, Record<string, string>> = {
  girl: { buns: "Пучки", braids: "Косички", long: "Распущенные" },
  boy: { short: "Короткая", spiky: "Ёжик", curly: "Кудри" },
};

export const OUTFIT_COLORS: Record<string, { main: string; dark: string; label: string }> = {
  blue: { main: "#2e77e6", dark: "#1c5cc4", label: "Синяя" },
  purple: { main: "#8b5cf6", dark: "#6d3fd4", label: "Фиолетовая" },
  green: { main: "#42c263", dark: "#2fad50", label: "Зелёная" },
  pink: { main: "#f45d9e", dark: "#d63d80", label: "Розовая" },
  orange: { main: "#ff9b2e", dark: "#e07c0a", label: "Оранжевая" },
};

export const ACCESSORIES: Record<string, string> = {
  none: "Без всего",
  glasses: "Очки",
  bow: "Бантик",
  cap: "Кепка",
  star: "Звёздочка",
};

export const DEFAULT_AVATAR: AvatarConfig = {
  kind: "boy",
  skin: "light",
  hair: "brown",
  style: "short",
  outfit: "blue",
  acc: "none",
};

export const AVATAR_PRESETS: { label: string; config: AvatarConfig }[] = [
  { label: "Мальчик классика", config: { kind: "boy", skin: "light", hair: "brown", style: "short", outfit: "blue", acc: "none" } },
  { label: "Девочка классика", config: { kind: "girl", skin: "light", hair: "blond", style: "buns", outfit: "pink", acc: "bow" } },
  { label: "Умник", config: { kind: "boy", skin: "peach", hair: "black", style: "curly", outfit: "green", acc: "glasses" } },
  { label: "Звёздочка", config: { kind: "girl", skin: "tan", hair: "black", style: "braids", outfit: "purple", acc: "star" } },
  { label: "Чемпион", config: { kind: "boy", skin: "deep", hair: "black", style: "spiky", outfit: "orange", acc: "cap" } },
  { label: "Мечтательница", config: { kind: "girl", skin: "peach", hair: "red", style: "long", outfit: "blue", acc: "none" } },
];

export function parseAvatar(raw: string | null | undefined): AvatarConfig {
  if (!raw) return DEFAULT_AVATAR;
  try {
    const v = JSON.parse(raw) as Partial<AvatarConfig>;
    const kind: AvatarKind = v.kind === "girl" ? "girl" : "boy";
    const styles = HAIR_STYLES[kind];
    return {
      kind,
      skin: v.skin && SKIN_TONES[v.skin] ? v.skin : DEFAULT_AVATAR.skin,
      hair: v.hair && HAIR_COLORS[v.hair] ? v.hair : DEFAULT_AVATAR.hair,
      style: v.style && styles[v.style] ? v.style : Object.keys(styles)[0],
      outfit: v.outfit && OUTFIT_COLORS[v.outfit] ? v.outfit : DEFAULT_AVATAR.outfit,
      acc: v.acc && ACCESSORIES[v.acc] !== undefined ? v.acc : DEFAULT_AVATAR.acc,
    };
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

export async function saveAvatar(childId: string, config: AvatarConfig): Promise<boolean> {
  const clean = parseAvatar(JSON.stringify(config));
  const db = getSupabase();
  if (db) {
    const { error } = await db
      .from("child_profiles")
      .update({ avatar_url: JSON.stringify(clean) })
      .eq("id", childId);
    return !error;
  }
  mockAvatars.set(childId, clean);
  return true;
}
