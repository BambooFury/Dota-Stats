import { STRATZ_API } from "./constants";
import { fetchDotaStats, fetchOpenDotaStats } from "./api";
import { buildActivityFromDates } from "./activity";
import { buildHeroesHtml } from "./heroes";
import { buildRecentMatchesHtml } from "./recent";
import { buildTeammatesHtml } from "./teammates";
import { buildFallbackWidgetHtml, buildWidgetHtml } from "./widget";
import { ICONS } from "./icons";
import { renderTemplate, TEMPLATES } from "./template";
import type { TeammateStat } from "./types";

export async function updateWidget(container: Element, steamId: string) {
  container.innerHTML = TEMPLATES.skeleton;

  const stats = await fetchDotaStats(steamId);
  if (!stats) {
    const fallback = await fetchOpenDotaStats(steamId);
    if (fallback) {
      container.innerHTML = buildFallbackWidgetHtml(fallback);
    } else {
      container.innerHTML = TEMPLATES.errorWidget;
    }
    return;
  }
  container.innerHTML = buildWidgetHtml(stats, steamId);
  wireWidgetInteractions(container, steamId);

  if (!stats.isPrivate) {
    const heroEl = container.querySelector(`#dotastats-heroes-${steamId}`);
    if (heroEl) heroEl.outerHTML = buildHeroesHtml(stats.topHeroes, steamId);

    const loadedMore = new Set<string>();
    (window as any).__dotastats_load_more = async (id: string) => {
      if (loadedMore.has(id)) return;
      loadedMore.add(id);

      try {
        const q2 = `{ player(steamAccountId: ${steamId}) {
        matchesGroupBy(request: { groupBy: LANE, playerList: SINGLE, take: 50000 }) {
          ... on MatchGroupByLaneType { lane matchCount }
        }
      } }`;
      const r2 = await fetch(STRATZ_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q2 }),
      });
      const j2 = await r2.json();
      const p2 = j2?.data?.player;
      const LANE_MAP: Record<string, number> = {
        "SAFE_LANE": 1, "MID_LANE": 2, "OFF_LANE": 3, "JUNGLE": 4, "ROAMING": 5,
        "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
      };
      const LANE_TO_ROLE: Record<number, number> = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      };
      const roleCountMap: Record<number, number> = {};
      for (const g of (p2?.matchesGroupBy ?? [])) {
        const rawLane = g.lane;
        let lane: number;
        if (typeof rawLane === "number") {
          lane = rawLane;
        } else {
          lane = LANE_MAP[String(rawLane ?? "").toUpperCase()] ?? 0;
        }
        const role = LANE_TO_ROLE[lane] ?? 0;
        if (role >= 1 && role <= 5) roleCountMap[role] = (roleCountMap[role] ?? 0) + (g.matchCount ?? 0);
      }
      const mainRoleEntry = Object.entries(roleCountMap).sort((a, b) => b[1] - a[1])[0];
      const mainRole = mainRoleEntry ? parseInt(mainRoleEntry[0]) : null;

      const ROLE_NAMES: Record<number, string> = { 1: "Carry", 2: "Mid", 3: "Offlane", 4: "Soft Support", 5: "Hard Support" };
      const ROLE_ICONS: Record<number, string> = {
        1: ICONS.roleCarry,
        2: ICONS.roleMid,
        3: ICONS.roleOfflane,
        4: ICONS.roleSoftSupport,
        5: ICONS.roleHardSupport,
      };

      if (mainRole) {
        const roleEl = container.querySelector(`#dotastats-role-${steamId}`);
        if (roleEl) roleEl.innerHTML = renderTemplate(TEMPLATES.role, {
          roleIcon: ROLE_ICONS[mainRole] ?? "",
          mainRole,
          roleName: ROLE_NAMES[mainRole] ?? "",
        });
      }
    } catch(e) { console.error('[dotastats] q2 error', e); }

    try {
      const fetchMatchPage = async (skip: number) => {
        const q = `{ player(steamAccountId: ${steamId}) {
          matches(request: { take: 100, skip: ${skip} }) {
            didRadiantWin
            players {
              steamAccountId
              isRadiant
              heroId
              steamAccount { name avatar isAnonymous }
            }
          }
        } }`;
        const r = await fetch(STRATZ_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const j = await r.json();
        return j?.data?.player?.matches ?? [];
      };

      const batch1 = await Promise.all(Array.from({ length: 5 }, (_, i) => fetchMatchPage(i * 100)));
      const batch2 = await Promise.all(Array.from({ length: 5 }, (_, i) => fetchMatchPage((i + 5) * 100)));
      const allMatches: any[] = [...batch1.flat(), ...batch2.flat()];

      const recentEl = container.querySelector(`#dotastats-recent-${steamId}`);
      if (recentEl) {
        const recent5 = allMatches.slice(0, 5).map((match: any) => {
          const players: any[] = match.players ?? [];
          const me = players.find((p: any) => String(p.steamAccountId) === String(steamId));
          if (!me) return null;
          const win = (me.isRadiant && match.didRadiantWin) || (!me.isRadiant && !match.didRadiantWin);
          const heroShortName = stats.heroMap[me.heroId]?.shortName ?? "";
          return { win, heroShortName };
        }).filter(Boolean) as { win: boolean; heroShortName: string }[];
        recentEl.outerHTML = buildRecentMatchesHtml(recent5, steamId);
      }

      const matches2b: any[] = allMatches;
      const tmMap: Record<string, { name: string; avatar: string | null; isPrivate: boolean; count: number; wins: number }> = {};
      for (const match of matches2b) {
        const players: any[] = match.players ?? [];
        const me = players.find((p: any) => String(p.steamAccountId) === String(steamId));
        if (!me) continue;
        const myWin = (me.isRadiant && match.didRadiantWin) || (!me.isRadiant && !match.didRadiantWin);
        for (const p of players) {
          if (String(p.steamAccountId) === String(steamId)) continue;
          if (p.isRadiant !== me.isRadiant) continue;
          const id = String(p.steamAccountId);
          if (!tmMap[id]) tmMap[id] = { name: p.steamAccount?.name ?? "Unknown", avatar: p.steamAccount?.avatar ?? null, isPrivate: p.steamAccount?.isAnonymous ?? false, count: 0, wins: 0 };
          tmMap[id].count++;
          if (myWin) tmMap[id].wins++;
        }
      }
      const topTeammates: TeammateStat[] = Object.entries(tmMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([id, t]) => ({
          steamAccountId: parseInt(id),
          name: t.name,
          avatar: t.avatar,
          matchCount: t.count,
          winCount: t.wins,
          isPrivate: t.isPrivate,
        }));
      const tmEl = container.querySelector(`#dotastats-teammates-${steamId}`);
      if (tmEl) {
        const tmHtml = buildTeammatesHtml(topTeammates);
        tmEl.innerHTML = tmHtml || TEMPLATES.noData;
      }
    } catch(e) { console.error('[dotastats] q2b error', e); }

    try {
      const yearStart = Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000);
      const q3 = `{ player(steamAccountId: ${steamId}) {
        matchesGroupBy(request: { groupBy: HERO, playerList: SINGLE, startDateTime: ${yearStart}, take: 50000 }) {
          ... on MatchGroupByHeroType { matchCount }
        }
      } }`;
      const r3 = await fetch(STRATZ_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q3 }),
      });
      const j3 = await r3.json();
      const activityCount: number = (j3?.data?.player?.matchesGroupBy ?? [])
        .reduce((sum: number, g: any) => sum + (g.matchCount ?? 0), 0);
      const actEl = container.querySelector(`#dotastats-activity-${steamId}`);
      if (actEl) actEl.outerHTML = buildActivityFromDates(activityCount, steamId);
    } catch(e) { console.error('[dotastats] q3 error', e); }
    };
  }
}

function wireWidgetInteractions(container: Element, steamId: string) {
  const expandBtn = container.querySelector<HTMLElement>(`#dotastats-expand-btn-${steamId}`);
  const expandPanel = container.querySelector<HTMLElement>(`#dotastats-expand-${steamId}`);
  const arrow = container.querySelector<HTMLElement>(`#dotastats-arrow-${steamId}`);
  if (!expandBtn || !expandPanel || !arrow) return;

  expandBtn.addEventListener("click", () => {
    if (expandPanel.style.display === "none" || !expandPanel.style.display) {
      expandPanel.style.display = "block";
      arrow.style.transform = "rotate(180deg)";
      if ((window as any).__dotastats_load_more) (window as any).__dotastats_load_more(steamId);
    } else {
      expandPanel.style.display = "none";
      arrow.style.transform = "rotate(0deg)";
    }
  });
}
