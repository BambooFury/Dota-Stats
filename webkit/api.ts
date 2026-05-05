import { STRATZ_API } from "./constants";
import { getMmrFromRank } from "./utils";
import type { DotaStats, HeroStat, OpenDotaStats, TeammateStat } from "./types";

export async function fetchOpenDotaStats(steamId: string): Promise<OpenDotaStats | null> {
  try {
    const [playerRes, wlRes] = await Promise.all([
      fetch(`https://api.opendota.com/api/players/${steamId}`),
      fetch(`https://api.opendota.com/api/players/${steamId}/wl`),
    ]);
    const player = await playerRes.json();
    const wl = await wlRes.json();
    if (!player || player.profile === undefined) return null;

    const rankTier: number = player.rank_tier ?? 0;
    const tier = Math.floor(rankTier / 10);
    const star = rankTier % 10;
    const mmr = tier === 8 ? null : getMmrFromRank(rankTier, star);

    const wins: number = wl?.win ?? 0;
    const losses: number = wl?.lose ?? 0;
    const matches = wins + losses;
    const winrate = matches > 0 ? (wins / matches * 100).toFixed(2) : "0.00";

    return {
      matches,
      winrate,
      rank: rankTier,
      mmr,
      firstMatchDate: null,
      personaName: player.profile?.personaname ?? null,
    };
  } catch {
    return null;
  }
}

export async function fetchDotaStats(steamId: string): Promise<DotaStats | null> {
  const query = `
    query {
      player(steamAccountId: ${steamId}) {
        steamAccount {
          name
          seasonRank
          seasonLeaderboardRank
          isDotaPlusSubscriber
          isAnonymous
        }
        matchCount
        winCount
        firstMatchDate
        matchesGroupBy(request: { groupBy: HERO, playerList: SINGLE, take: 50000 }) {
          ... on MatchGroupByHeroType {
            heroId
            matchCount
            winCount
          }
        }
        dotaPlus {
          heroId
          level
        }
      }
      constants {
        heroes {
          id
          shortName
          displayName
        }
      }
    }
  `;

  try {
    const res = await fetch(STRATZ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const player = json?.data?.player;
    if (!player) return null;

    const account = player.steamAccount;
    const seasonRank: number = account?.seasonRank ?? 0;
    const tier = Math.floor(seasonRank / 10);
    const star = seasonRank % 10;

    const mmr = tier === 8 ? null : getMmrFromRank(seasonRank, star);

    const matches: number = player.matchCount ?? 0;
    const wins: number = player.winCount ?? 0;
    const winrate = matches > 0 ? (wins / matches * 100).toFixed(2) : "0.00";

    let firstMatchDate: string | null = null;
    if (player.firstMatchDate) {
      const d = new Date(player.firstMatchDate * 1000);
      firstMatchDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    const heroMap: Record<number, { shortName: string; displayName: string }> = {};
    for (const h of (json?.data?.constants?.heroes ?? [])) {
      heroMap[h.id] = { shortName: h.shortName, displayName: h.displayName };
    }

    const dotaPlusMap: Record<number, number> = {};
    for (const dp of (player.dotaPlus ?? [])) {
      const cur = dotaPlusMap[dp.heroId] ?? 0;
      if (dp.level > cur) dotaPlusMap[dp.heroId] = dp.level;
    }

    const topHeroes: HeroStat[] = (player.matchesGroupBy ?? [])
      .map((h: any) => ({
        heroId: h.heroId ?? 0,
        shortName: heroMap[h.heroId ?? 0]?.shortName ?? "",
        displayName: heroMap[h.heroId ?? 0]?.displayName ?? "Unknown",
        matchCount: h.matchCount ?? 0,
        winCount: h.winCount ?? 0,
        dotaPlusLevel: dotaPlusMap[h.heroId ?? 0] ?? null,
      }))
      .sort((a: HeroStat, b: HeroStat) => b.matchCount - a.matchCount)
      .slice(0, 3);

    const activityCount: number = 0;
    const mainRole: number | null = null;
    const topTeammates: TeammateStat[] = [];

    return {      matches,
      mmr,
      winrate,
      rank: seasonRank,
      stars: star,
      leaderboardRank: account?.seasonLeaderboardRank ?? null,
      personaName: account?.name ?? null,
      plusSubscriber: account?.isDotaPlusSubscriber ?? false,
      isPrivate: account?.isAnonymous ?? false,
      firstMatchDate,
      topHeroes,
      heroMap,
      dotaPlusMap,
      activityCount,
      mainRole,
      topTeammates,
    };
  } catch (e) {
    return null;
  }
}
