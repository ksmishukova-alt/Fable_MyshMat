"use client";

/**
 * Настоящая загрузка фото решения: открывает выбор файла/камеру,
 * грузит в хранилище (/api/olympiad/upload) и возвращает URL.
 * Fix бага: раньше кнопка была заглушкой и «отправляла» без файла.
 */
import { useRef, useState } from "react";

export function PhotoUploadButton({
  disabled,
  hint,
  onUploaded,
}: {
  disabled?: boolean;
  hint?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");

  async function handleFile(file: File) {
    setState("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/olympiad/upload", { method: "POST", body: fd });
      const d = (await res.json()) as { url?: string; error?: string };
      if (res.ok && d.url) {
        setState("idle");
        onUploaded(d.url);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="ts-upload"
        disabled={disabled || state === "uploading"}
        onClick={() => inputRef.current?.click()}
      >
        <span className="ts-upload-ic">{state === "uploading" ? "⏳" : "📷"}</span>
        <span>
          {state === "uploading"
            ? "Загружаем фото…"
            : state === "error"
              ? "Не получилось — попробуй ещё раз"
              : "Сфотографировать решение"}
        </span>
        <small>{hint ?? "Откроется камера или выбор файла"}</small>
      </button>
    </>
  );
}
