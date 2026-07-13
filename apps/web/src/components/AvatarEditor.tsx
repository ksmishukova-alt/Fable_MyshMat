"use client";

/**
 * Выбор аватара (DiceBear): стиль → сетка вариантов → фон → сохранить.
 * «Перемешать» генерирует новую порцию вариантов.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_STYLES, AVATAR_BGS, type AvatarConfig } from "@/lib/avatar";
import { AvatarView } from "@/components/AvatarView";

const VARIANTS = 12;

function makeSeeds(nonce: number): string[] {
  return Array.from({ length: VARIANTS }, (_, i) => `mysh-${nonce}-${i}`);
}

export function AvatarEditor({ initial }: { initial: AvatarConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(initial);
  const [nonce, setNonce] = useState(1);
  const [saved, setSaved] = useState<"idle" | "saving" | "done">("idle");
  const [warn, setWarn] = useState<string | null>(null);

  const seeds = makeSeeds(nonce);
  const gridSeeds = seeds.includes(config.seed)
    ? seeds
    : [config.seed, ...seeds.slice(0, VARIANTS - 1)];

  async function save() {
    setSaved("saving");
    setWarn(null);
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const d = (await res.json()) as { ok: boolean; persistent?: boolean };
    if (res.ok && d.ok) {
      setSaved("done");
      if (d.persistent === false) {
        setWarn(
          "Внимание: база данных не подключена (env-переменные на Vercel) — выбор сбросится после перезапуска сервера.",
        );
      }
      setTimeout(() => setSaved("idle"), 1600);
      router.refresh();
    } else {
      setSaved("idle");
      setWarn("Не получилось сохранить, попробуй ещё раз.");
    }
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
        {warn && <p className="av-warn">{warn}</p>}
      </div>

      <div className="av-controls">
        <div className="av-group">
          <b>Стиль</b>
          <div className="av-row">
            {Object.entries(AVATAR_STYLES).map(([id, label]) => (
              <button
                key={id}
                className={`av-acc${config.style === id ? " on" : ""}`}
                onClick={() => setConfig((c) => ({ ...c, style: id }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="av-group">
          <b>Выбери себя</b>
          <div className="av-row">
            {gridSeeds.map((seed) => (
              <button
                key={seed}
                className={`av-preset${config.seed === seed ? " on" : ""}`}
                aria-label="Вариант аватара"
                onClick={() => setConfig((c) => ({ ...c, seed }))}
              >
                <AvatarView config={{ ...config, seed }} size={52} />
              </button>
            ))}
          </div>
          <button className="av-shuffle" onClick={() => setNonce((n) => n + 1)}>
            Перемешать варианты
          </button>
        </div>

        <div className="av-group">
          <b>Фон</b>
          <div className="av-row">
            {AVATAR_BGS.map((bg) => (
              <button
                key={bg}
                className={`av-swatch${config.bg === bg ? " on" : ""}`}
                style={{ background: `#${bg}` }}
                aria-label={`Фон #${bg}`}
                onClick={() => setConfig((c) => ({ ...c, bg }))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
