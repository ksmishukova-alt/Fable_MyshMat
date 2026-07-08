import Link from "next/link";
import type { ChildProfile } from "@/types/domain";
import { parseAvatar } from "@/lib/avatar";
import { AvatarView } from "@/components/AvatarView";

/** Карточка профиля на главной — ведёт в личный кабинет ребёнка. */
export function ProfileCard({ profile }: { profile: ChildProfile }) {
  return (
    <Link className="profile card" href="/profile" aria-label="Открыть личный кабинет">
      <span className="avatar-svg">
        <AvatarView config={parseAvatar(profile.avatarUrl)} size={48} />
      </span>
      <div>
        <b>{profile.name}</b>
        <small>{profile.grade} класс</small>
      </div>
      <span className="chev" aria-hidden="true">›</span>
    </Link>
  );
}
