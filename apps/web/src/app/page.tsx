import { fetchHomeData } from "@/lib/data";
import { buildWorldState } from "@/types/domain";
import { getCurrentChildId } from "@/lib/session";
import { ProfileCard } from "@/components/ProfileCard";
import { Hero } from "@/components/Hero";
import { DailyCard } from "@/components/DailyCard";
import { SideCards } from "@/components/SideColumn";
import { RouteRow, WorldCards } from "@/components/WorldZone";

export default async function HomePage() {
  const childId = await getCurrentChildId();
  const data = await fetchHomeData(childId);
  const world = buildWorldState(data.session);

  return (
    <main className="stage" aria-label="Главный экран МышМат">
      <section className="board">
        <div className="logo">
          <div className="word">
            Мыш<span>Мат</span>
          </div>
          <div className="tag">Мышление в математике</div>
        </div>

        <ProfileCard profile={data.profile} />
        <Hero name={data.profile.name} />
        <DailyCard session={data.session} week={data.week} />

        {/* правая колонка: доработки → наклейки → сундук → дуэли+награды */}
        <div className="right-col">
          <SideCards revisions={data.revisions} stickers={data.stickers} />
          <WorldCards world={world} />
        </div>

        <RouteRow world={world} />
      </section>
    </main>
  );
}
