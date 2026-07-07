/**
 * МышМат — дуэли: сохранение результатов + таблица лидеров.
 * Соревнуемся в скорости мышления, НЕ в учебном прогрессе.
 */
import { getSupabase } from "@/lib/supabase";
import type { DuelGameId, DuelResult, LeaderboardRow } from "@/types/duels";

const mockResults: DuelResult[] = [];
const MOCK_NAMES: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": "Артём",
  "22222222-2222-2222-2222-222222222222": "Маша",
};

export async function saveDuelResult(args: {
  childId: string;
  gameId: DuelGameId;
  score: number;
  correct: number;
  wrong: number;
}): Promise<void> {
  const db = getSupabase();
  if (db) {
    await db.from("duel_results").insert({
      child_id: args.childId,
      game_id: args.gameId,
      score: args.score,
      correct: args.correct,
      wrong: args.wrong,
    });
    return;
  }
  mockResults.push({
    id: crypto.randomUUID(),
    childId: args.childId,
    gameId: args.gameId,
    score: args.score,
    correct: args.correct,
    wrong: args.wrong,
    playedAt: new Date().toISOString(),
  });
}

export async function leaderboard(gameId: DuelGameId): Promise<LeaderboardRow[]> {
  const db = getSupabase();
  if (db) {
    const { data } = await db
      .from("duel_results")
      .select("child_id, score, child_profiles(name)")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .limit(200);
    const best = new Map<string, { name: string; score: number; games: number }>();
    for (const r of data ?? []) {
      const row = r as unknown as {
        child_id: string;
        score: number;
        child_profiles: { name: string } | { name: string }[] | null;
      };
      const child = Array.isArray(row.child_profiles) ? row.child_profiles[0] : row.child_profiles;
      const cur = best.get(row.child_id);
      if (cur) {
        cur.games++;
        cur.score = Math.max(cur.score, row.score);
      } else {
        best.set(row.child_id, { name: child?.name ?? "Игрок", score: row.score, games: 1 });
      }
    }
    return [...best.entries()]
      .map(([childId, v]) => ({ childId, childName: v.name, bestScore: v.score, gamesPlayed: v.games, rank: 0 }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 20)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }

  const best = new Map<string, { score: number; games: number }>();
  for (const r of mockResults.filter((x) => x.gameId === gameId)) {
    const cur = best.get(r.childId);
    if (cur) {
      cur.games++;
      cur.score = Math.max(cur.score, r.score);
    } else {
      best.set(r.childId, { score: r.score, games: 1 });
    }
  }
  return [...best.entries()]
    .map(([childId, v]) => ({
      childId,
      childName: MOCK_NAMES[childId] ?? "Игрок",
      bestScore: v.score,
      gamesPlayed: v.games,
      rank: 0,
    }))
    .sort((a, b) => b.bestScore - a.bestScore)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
