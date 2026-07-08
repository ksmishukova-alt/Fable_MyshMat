/**
 * Аватар ребёнка — DiceBear (open source). Обычный <img> с SVG-адресом CDN:
 * быстро, красиво, ничего не собираем сами.
 */
import { avatarUrl, type AvatarConfig } from "@/lib/avatar";

export function AvatarView({ config, size = 48 }: { config: AvatarConfig; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl(config, Math.max(size * 2, 96))}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      style={{ display: "block", borderRadius: "50%", inlineSize: size, blockSize: size }}
    />
  );
}
