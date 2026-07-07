"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChildProfile } from "@/types/domain";

export function ProfileCard({ profile }: { profile: ChildProfile }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function switchProfile() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  }

  return (
    <div className="profile card" style={{ position: "relative" }}>
      <div className="avatar" />
      <div>
        <b>{profile.name}</b>
        <small>{profile.grade} класс</small>
      </div>
      <button
        className="chev"
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню профиля"
        style={{ border: 0, background: "transparent", cursor: "pointer", font: "inherit" }}
      >
        ⌄
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 8,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 10px 28px rgba(37,75,131,.2)",
            padding: 6,
            zIndex: 20,
            minWidth: 170,
          }}
        >
          <button
            onClick={switchProfile}
            style={{
              width: "100%",
              textAlign: "left",
              border: 0,
              background: "transparent",
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              font: "inherit",
              fontWeight: 700,
              color: "#2E8BE6",
            }}
          >
            Сменить профиль
          </button>
        </div>
      )}
    </div>
  );
}
