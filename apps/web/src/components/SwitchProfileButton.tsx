"use client";

import { useRouter } from "next/navigation";

/** Выход из детского профиля → экран входа. */
export function SwitchProfileButton() {
  const router = useRouter();
  return (
    <button
      className="btn-cta btn-cta--purple"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" }).catch(() => {});
        router.push("/login");
        router.refresh();
      }}
    >
      Сменить профиль
    </button>
  );
}
