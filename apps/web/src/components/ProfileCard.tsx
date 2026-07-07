import Link from "next/link";
import type { ChildProfile } from "@/types/domain";

/** Карточка профиля на главной — ведёт в личный кабинет ребёнка. */
export function ProfileCard({ profile }: { profile: ChildProfile }) {
  return (
    <Link className="profile card" href="/profile" aria-label="Открыть личный кабинет">
      <div className="avatar" />
      <div>
        <b>{profile.name}</b>
        <small>{profile.grade} класс</small>
      </div>
      <span className="chev" aria-hidden="true">›</span>
    </Link>
  );
}
