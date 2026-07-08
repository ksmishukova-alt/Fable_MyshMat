"use client";

/**
 * Конструктор аватара «как я»: мальчик/девочка, тон кожи, причёска,
 * цвет волос, одежда, аксессуар + готовые образы. Живой предпросмотр.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  OUTFIT_COLORS,
  ACCESSORIES,
  AVATAR_PRESETS,
  type AvatarConfig,
  type AvatarKind,
} from "@/lib/avatar";
import { AvatarView } from "@/components/AvatarView";

export function AvatarEditor({ initial }: { initial: AvatarConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(initial);
  const [saved, setSaved] = useState<"idle" | "saving" | "done">("idle");

  async function save() {
    setSaved("saving");
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaved(res.ok ? "done" : "idle");
    if (res.ok) {
      setTimeout(() => setSaved("idle"), 1500);
      router.refresh();
    }
  }

  function set(patch: Partial<AvatarConfig>) {
    setConfig((c) => {
      const next = { ...c, ...patch };
      // при смене мальчик/девочка причёска переключается на первую доступную
      if (patch.kind && !HAIR_STYLES[next.kind][next.style]) {
        next.style = Object.keys(HAIR_STYLES[next.kind])[0];
      }
      return next;
    });
    setSaved("idle");
  }

  return (
    <div className="av-editor">
      <div className="av-preview">
        <div className="av-preview-ring">
          <AvatarView config={config} size={150} />
        </div>
        <button
          className="btn-cta btn-cta--blue"
          disabled={saved !== "idle"}
          onClick={() => void save()}
        >
          {saved === "saving" ? "Сохраняем…" : saved === "done" ? "✓ Сохранено!" : "Сохранить"}
        </button>
      </div>

      <div className="av-controls">
        <div className="av-group">
          <b>Кто ты?</b>
          <div className="av-row">
            {(["boy", "girl"] as AvatarKind[]).map((k) => (
              <button
                key={k}
                className={`av-acc${config.kind === k ? " on" : ""}`}
                onClick={() => set({ kind: k })}
              >
                {k === "boy" ? "Мальчик" : "Девочка"}
              </button>
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Тон кожи</b>
          <div className="av-row">
            {Object.entries(SKIN_TONES).map(([id, c]) => (
              <button
                key={id}
                className={`av-swatch${config.skin === id ? " on" : ""}`}
                style={{ background: c.main }}
                title={c.label}
                aria-label={`Тон кожи: ${c.label}`}
                onClick={() => set({ skin: id })}
              />
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Причёска</b>
          <div className="av-row">
            {Object.entries(HAIR_STYLES[config.kind]).map(([id, label]) => (
              <button
                key={id}
                className={`av-acc${config.style === id ? " on" : ""}`}
                title={label}
                onClick={() => set({ style: id })}
              >
                <AvatarView config={{ ...config, style: id, acc: "none" }} size={34} />
              </button>
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Цвет волос</b>
          <div className="av-row">
            {Object.entries(HAIR_COLORS).map(([id, c]) => (
              <button
                key={id}
                className={`av-swatch${config.hair === id ? " on" : ""}`}
                style={{ background: c.main }}
                title={c.label}
                aria-label={`Волосы: ${c.label}`}
                onClick={() => set({ hair: id })}
              />
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Одежда</b>
          <div className="av-row">
            {Object.entries(OUTFIT_COLORS).map(([id, c]) => (
              <button
                key={id}
                className={`av-swatch${config.outfit === id ? " on" : ""}`}
                style={{ background: c.main }}
                title={c.label}
                aria-label={`Одежда: ${c.label}`}
                onClick={() => set({ outfit: id })}
              />
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Аксессуар</b>
          <div className="av-row">
            {Object.entries(ACCESSORIES).map(([id, label]) => (
              <button
                key={id}
                className={`av-acc${config.acc === id ? " on" : ""}`}
                title={label}
                onClick={() => set({ acc: id })}
              >
                {id === "none" ? label : <AvatarView config={{ ...config, acc: id }} size={34} />}
              </button>
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Готовые образы</b>
          <div className="av-row">
            {AVATAR_PRESETS.map((p) => (
              <button
                key={p.label}
                className="av-preset"
                title={p.label}
                onClick={() => {
                  setConfig(p.config);
                  setSaved("idle");
                }}
              >
                <AvatarView config={p.config} size={46} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
