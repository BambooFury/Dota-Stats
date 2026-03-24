type Millennium = {
    callServerMethod: (methodName: string, kwargs?: any) => Promise<any>;
    findElement: (privateDocument: Document, querySelector: string, timeOut?: number) => Promise<NodeListOf<Element>>;
};

declare const Millennium: Millennium;

interface HeroStat {
  heroId: number;
  shortName: string;
  displayName: string;
  matchCount: number;
  winCount: number;
  dotaPlusLevel: number | null;
}

interface TeammateStat {
  steamAccountId: number;
  name: string;
  avatar: string | null;
  matchCount: number;
  winCount: number;
  isPrivate: boolean;
}

interface DotaStats {
  matches: number;
  mmr: number | null;
  winrate: string;
  rank: number;
  stars: number;
  leaderboardRank: number | null;
  personaName: string | null;
  plusSubscriber: boolean;
  isPrivate: boolean;
  firstMatchDate: string | null;
  topHeroes: HeroStat[];
  heroMap: Record<number, { shortName: string; displayName: string }>;
  dotaPlusMap: Record<number, number>;
  activityCount: number;
  mainRole: number | null;
  topTeammates: TeammateStat[];
}

const _c = "Uk59X1VwVF54Xn1+Yk1+BnlefkR+WWUCVHR+AX5cR29hdH0OGVJOfWNTYH1GbWB5B35dWF5tc21dbWBhXW1zckNuY3JAek4HB25jYgQ=";
const STRATZ_API = "https://api.stratz.com/graphql";

const RANK_ICON_CDN = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static";
const DOTA_PLUS_ICON = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static/dota_plus.png";
const DOTABUFF_ICON = "https://cdn.jsdelivr.net/gh/BambooFury/Dota-Stats@main/static/dotabuff_icon.png";

const RANK_MMR_MAP: Record<number, Record<number, number>> = {
  1: { 1: 0, 2: 154, 3: 308, 4: 462, 5: 616 },
  2: { 1: 770, 2: 924, 3: 1078, 4: 1232, 5: 1386 },
  3: { 1: 1540, 2: 1694, 3: 1848, 4: 2002, 5: 2156 },
  4: { 1: 2310, 2: 2464, 3: 2618, 4: 2772, 5: 2926 },
  5: { 1: 3080, 2: 3234, 3: 3388, 4: 3542, 5: 3696 },
  6: { 1: 3850, 2: 4004, 3: 4158, 4: 4312, 5: 4466 },
  7: { 1: 4620, 2: 4820, 3: 5020, 4: 5220, 5: 5420 },
  8: { 1: 6200, 2: 6400, 3: 6600, 4: 6800, 5: 7000 },
};

const RANK_NAMES: Record<number, string> = {
  1: "Herald", 2: "Guardian", 3: "Crusader", 4: "Archon",
  5: "Legend", 6: "Ancient", 7: "Divine", 8: "Immortal",
};
const _a = "e2NfXW5gZkN6TVwEbXNhWnpddV1tcGFdfl5AXmIEZVtuYAZ9bXR+AX5dck95TWYHeHN2BXpNbl57dH11YnJbYVQFYU5+XVheU399Bm0=";

const RANK_COLORS: Record<number, string> = {
  0: "#8c8c8c",
  1: "#4caf50",
  2: "#a0522d",
  3: "#2abfbf",
  4: "#c8c84a",
  5: "#f0c040",
  6: "#7b9fd4",
  7: "#6ecfff",
  8: "#c0504a",
};
const _b = "fgF+Wl8HU391TXheD0Fub3VHe1l5B1RacQdSXgJdVQUHXlFmGXF7dlFGeHVoB1hzeF5DQgdjem9cdl8GGlNSAk9uX3x9U3pURFJGb3R9QVw=";
const _d = "ZH5EfloCXm1efgF6Y1QFeWNQT3lzek94dEBebW9fQH5dWE95TVwEek1iQHpNcgN7dH1Hbm9mXnhdcgR5XWIDemNmTXpjUER+WltNVE4=";

function injectStyles() {
  if (document.getElementById("dotastats-style")) return;
  if (!document.getElementById("dotastats-font")) {
    const link = document.createElement("link");
    link.id = "dotastats-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    document.head.appendChild(link);
  }
  const style = document.createElement("style");
  style.id = "dotastats-style";
  style.textContent = `
    .dotastats-widget {
      font-family: "Motiva Sans", sans-serif;
      padding: 12px 14px 10px;
      color: #c6d4df;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      margin: 8px 6px;
      backdrop-filter: blur(4px);
    }
    .dotastats-heroes {
      margin-bottom: 10px;
    }
    .dotastats-heroes-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8f98a0;
      margin-bottom: 6px;
    }
    .dotastats-hero-row {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 5px;
    }
    .dotastats-hero-dot {
      color: #4caf50;
      font-size: 10px;
      flex-shrink: 0;
    }
    .dotastats-hero-img {
      width: 40px;
      height: 22px;
      object-fit: cover;
      border-radius: 3px;
      flex-shrink: 0;
    }
    .dotastats-hero-img-wrap {
      position: relative;
      flex-shrink: 0;
      width: 40px;
      height: 22px;
    }
    .dotastats-hero-name {
      flex: 1;
      color: #c6d4df;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dotastats-hero-stats {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      font-size: 10px;
      color: #8f98a0;
    }
    .dotastats-hero-wr {
      color: #4caf50;
    }
    .dotastats-skeleton {
      padding: 12px 14px 10px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      margin: 8px 6px;
    }
    .dotastats-skel-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .dotastats-skel-block {
      background: linear-gradient(90deg, #1e2530 25%, #2a3444 50%, #1e2530 75%);
      background-size: 200% 100%;
      animation: dotastats-shimmer 1.4s infinite;
      border-radius: 4px;
    }
    @keyframes dotastats-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .dotastats-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(100,130,160,0.5), transparent);
      margin: 8px 0;
      border: none;
    }
    .dotastats-main {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px;
      width: 100%;
    }
    .dotastats-rank-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      flex-shrink: 0 !important;
      display: block !important;
    }
    .dotastats-info {
      flex: 1 !important;
      min-width: 0;
    }
    .dotastats-name {
      font-size: 13px;
      font-weight: 600;
      color: #e8eaed;
      margin-bottom: 2px;
    }
    .dotastats-rank-label {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .dotastats-stats-row {
      display: flex;
      gap: 10px;
      font-size: 11px;
      color: #8f98a0;
    }
    .dotastats-stat-val {
      color: #c6d4df;
    }
    .dotastats-footer {
      margin-top: 7px;
      font-size: 10px;
      color: #6a7a8a;
      display: flex;
      justify-content: space-between;
    }
    .dotastats-expand-btn {
      position: relative;
      margin: 6px 0 0;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 4px 0;
    }
    .dotastats-expand-btn::before,
    .dotastats-expand-btn::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(100,130,160,0.45));
    }
    .dotastats-expand-btn::after {
      background: linear-gradient(to left, transparent, rgba(100,130,160,0.45));
    }
    .dotastats-expand-inner {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: #6a7a8a;
      transition: color 0.15s;
      white-space: nowrap;
    }
    .dotastats-expand-btn:hover .dotastats-expand-inner {
      color: #c6d4df;
    }
    .dotastats-expand-arrow {
      width: 10px;
      height: 10px;
      transition: transform 0.2s;
    }
    .dotastats-activity {
      margin-top: 10px;
      padding: 4px 0;
    }
    .dotastats-activity-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8f98a0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
    }
    .dotastats-plus {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      vertical-align: middle;
    }
    .dotastats-plus img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }
    .dotastats-recent-matches {
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .dotastats-recent-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .dotastats-wl-badge {
      position: relative;
      display: inline-flex;
      align-items: flex-end;
      justify-content: flex-end;
      width: 36px;
      height: 22px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .dotastats-wl-badge.win {
      box-shadow: 0 0 0 1px rgba(60, 180, 80, 0.5);
    }
    .dotastats-wl-badge.loss {
      box-shadow: 0 0 0 1px rgba(180, 60, 60, 0.5);
    }
    .dotastats-wl-letter {
      position: absolute;
      bottom: 1px;
      right: 2px;
      font-size: 9px;
      font-weight: 700;
      font-family: 'Orbitron', 'Motiva Sans', sans-serif;
      letter-spacing: 0;
      line-height: 1;
      text-shadow: 0 0 6px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1);
    }
    .dotastats-wl-badge.win .dotastats-wl-letter { color: #7dffaa; }
    .dotastats-wl-badge.loss .dotastats-wl-letter { color: #ff9090; }
  `;
  document.head.appendChild(style);
}

function getMmrFromRank(rank: number, stars: number): number | null {
  const tier = Math.floor(rank / 10);
  const star = rank % 10;
  if (tier === 8) return null;
  return RANK_MMR_MAP[tier]?.[star] ?? null;
}

function getRankImageUrl(rank: number): string {
  const tier = Math.floor(rank / 10);
  const star = rank % 10;
  if (tier === 0) return `${RANK_ICON_CDN}/rank_icon_unranked.png`;
  if (tier === 8) return `${RANK_ICON_CDN}/rank_icon_8_${star > 0 ? star : 1}.png`;
  return `${RANK_ICON_CDN}/rank_icon_${tier}_${star}.png`;
}

const _k = 0x37;
const _dec = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const _xor = (u: Uint8Array) => Array.from(u).map(v => v ^ _k);
const STRATZ_TOKEN = [_c, _a, _d, _b].flatMap(s => _xor(_dec(s))).map(c => String.fromCharCode(c)).join("");

interface OpenDotaStats {
  matches: number;
  winrate: string;
  rank: number;
  mmr: number | null;
  firstMatchDate: string | null;
  personaName: string | null;
}

async function fetchOpenDotaStats(steamId: string): Promise<OpenDotaStats | null> {
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

function buildFallbackWidgetHtml(stats: OpenDotaStats): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const rankColor = RANK_COLORS[tier] ?? "#c6d4df";
  const rankImgUrl = getRankImageUrl(stats.rank);
  const star = stats.rank % 10;

  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8 ? "Immortal"
    : `${rankName} ${star}`;

  const mmrText = stats.mmr !== null ? `~${stats.mmr} MMR` : "Immortal";

  return `
    <div class="dotastats-widget">
      <div class="dotastats-main" style="display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;margin-top:0!important;">
        <img class="dotastats-rank-img" style="width:52px!important;height:52px!important;object-fit:contain!important;flex-shrink:0!important;" src="${rankImgUrl}" alt="${rankName}" />
        <div class="dotastats-info" style="flex:1!important;min-width:0!important;">
          ${stats.personaName ? `<div class="dotastats-name">${stats.personaName}</div>` : ""}
          <div class="dotastats-rank-label" style="color:${rankColor}">${rankLabel}</div>
          <div class="dotastats-stats-row">
            <span><span class="dotastats-stat-val">${stats.matches}</span> matches</span>
            <span><span class="dotastats-stat-val">${stats.winrate}%</span> WR</span>
            <span class="dotastats-stat-val">${mmrText}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:7px;font-size:9px;color:#4a5568;text-align:center">⚠ Stats service is experiencing issues &nbsp;·&nbsp; via OpenDota</div>
    </div>
  `;
}

async function fetchDotaStats(steamId: string): Promise<DotaStats | null> {
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
        "Authorization": `Bearer ${STRATZ_TOKEN}`,
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

function buildHeroesHtml(heroes: HeroStat[], steamId: string): string {
  if (!heroes.length) return "";

  const rows = heroes.map(h => {
    const wr = h.matchCount > 0 ? (h.winCount / h.matchCount * 100).toFixed(1) : "0.0";
    const imgUrl = `https://cdn.stratz.com/images/dota2/heroes/${h.shortName}_horz.png`;
    const badgeLevel = h.dotaPlusLevel ? (
      h.dotaPlusLevel >= 30 ? 6 :
      h.dotaPlusLevel >= 25 ? 5 :
      h.dotaPlusLevel >= 18 ? 4 :
      h.dotaPlusLevel >= 12 ? 3 :
      h.dotaPlusLevel >= 6  ? 2 : 1
    ) : null;
    const badgeHtml = badgeLevel
      ? `<img src="https://cdn.stratz.com/images/dota2/plus/hero_badge_${badgeLevel}.png" style="position:absolute;bottom:-6px;right:-6px;width:18px;height:18px;object-fit:contain;" />`
      : "";
    return `
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <div style="position:relative;flex-shrink:0;width:40px;height:22px;">
          <img class="dotastats-hero-img" src="${imgUrl}" alt="${h.displayName}" style="width:40px;height:22px;" />
          ${badgeHtml}
        </div>
        <span class="dotastats-hero-name">${h.displayName}</span>
        <div class="dotastats-hero-stats">
          <span style="font-size:10px">${h.matchCount} game</span>
          <span class="dotastats-hero-wr" style="color:${parseFloat(wr) >= 50 ? '#4caf50' : '#e74c3c'}">${wr}%</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="dotastats-heroes" id="dotastats-heroes-${steamId}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span class="dotastats-heroes-title" style="margin-bottom:0">Top Heroes</span>
        <a href="https://www.dotabuff.com/players/${steamId}" target="_blank" style="display:flex;align-items:center;opacity:0.8;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
          <img src="${DOTABUFF_ICON}" style="width:16px;height:16px;object-fit:contain;" alt="Dotabuff" />
        </a>
      </div>
      ${rows}
    </div>
  `;
}

function buildTeammatesHtml(teammates: TeammateStat[]): string {
  if (!teammates.length) return "";

  const rows = teammates.map(t => {
    const wr = t.matchCount > 0 ? (t.winCount / t.matchCount * 100).toFixed(1) : "0.0";
    const wrColor = parseFloat(wr) >= 50 ? "#4caf50" : "#e74c3c";
    const avatarUrl = t.avatar
      ? t.avatar.replace("_full.jpg", "_medium.jpg")
      : `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg`;
    const steamId64 = (BigInt(t.steamAccountId) + BigInt("76561197960265728")).toString();
    const profileUrl = `https://steamcommunity.com/profiles/${steamId64}`;
    const privateBadgeInline = t.isPrivate
      ? `<svg fill="#6a7a8a" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;vertical-align:middle;margin-left:3px;"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm.017-16.5c-11.065 0-8.94 9-3.962 9 .998 0 1.937-.485 2.536-1.31l.643-.885a.96.96 0 0 1 1.566 0l.643.886a3.136 3.136 0 0 0 2.535 1.309c4.747 0 7.266-9-3.961-9zM8.6 13.227c-1.026 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962zm6.8 0c-1.027 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962z"/></svg>`
      : "";
    return `
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <a href="${profileUrl}" style="display:flex;align-items:center;flex-shrink:0;cursor:pointer"><img src="${avatarUrl}" style="width:22px;height:22px;border-radius:3px;object-fit:cover;" alt="${t.name}" /></a>
        <a href="${profileUrl}" class="dotastats-hero-name" style="color:#c6d4df;text-decoration:none;cursor:pointer;display:flex;align-items:center;gap:3px;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#c6d4df'">${t.name}${privateBadgeInline}</a>
        <div class="dotastats-hero-stats">
          <span style="color:${wrColor}">${wr}%</span>
          <span style="font-size:10px">${t.matchCount} game</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="margin-top:6px">
      <div class="dotastats-heroes-title" style="margin-bottom:5px">Teammates</div>
      ${rows}
    </div>
  `;
}

function buildActivityFromDates(count6m: number, steamId?: string): string {
  let level: string;
  let color: string;
  if (count6m === 0) {
    level = "Inactive"; color = "#4a5568";
  } else if (count6m < 50) {
    level = "Low"; color = "#718096";
  } else if (count6m < 200) {
    level = "Normal"; color = "#4caf50";
  } else if (count6m < 500) {
    level = "Hard"; color = "#e67e22";
  } else {
    level = "Very High"; color = "#e74c3c";
  }

  const countText = `${count6m} game / ${new Date().getFullYear()}`;
  return `
    <div class="dotastats-activity" id="${steamId ? `dotastats-activity-${steamId}` : ''}">
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <span class="dotastats-hero-name">Activity</span>
        <div class="dotastats-hero-stats">
          <span style="color:${color};font-weight:600">${level}</span>
          <span>${countText}</span>
        </div>
      </div>
    </div>
  `;
}

function buildRecentMatchesHtml(matches: { win: boolean; heroShortName: string }[], steamId?: string): string {
  if (!matches.length) return "";
  const badges = matches.map(m => {
    const letter = m.win ? "W" : "L";
    const cls = m.win ? "win" : "loss";
    const overlay = m.win ? `rgba(20,80,35,0.55)` : `rgba(80,20,20,0.55)`;
    const heroImg = m.heroShortName
      ? `<img src="https://cdn.stratz.com/images/dota2/heroes/${m.heroShortName}_horz.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />`
      : "";
    return `<div class="dotastats-wl-badge ${cls}">
      ${heroImg}
      <div style="position:absolute;inset:0;background:${overlay};"></div>
      <span class="dotastats-wl-letter">${letter}</span>
    </div>`;
  }).join("");

  return `
    <div class="dotastats-recent-matches" id="${steamId ? `dotastats-recent-${steamId}` : ''}">
      <div class="dotastats-heroes-title" style="margin-bottom:5px">Recent Matches</div>
      <div class="dotastats-recent-row">${badges}</div>
    </div>
  `;
}

function buildWidgetHtml(stats: DotaStats, steamId: string): string {
  const tier = Math.floor(stats.rank / 10);
  const rankName = RANK_NAMES[tier] ?? "Unranked";
  const rankColor = RANK_COLORS[tier] ?? "#c6d4df";
  const rankImgUrl = getRankImageUrl(stats.rank);

  const rankLabel = tier === 0
    ? "Unranked"
    : tier === 8
      ? stats.leaderboardRank ? `Immortal \u2014 #${stats.leaderboardRank}` : "Immortal"
      : `${rankName} ${stats.stars}`;

  const mmrText = tier === 8
    ? stats.leaderboardRank ? `#${stats.leaderboardRank} Leaderboard` : "Immortal"
    : stats.mmr !== null ? `~${stats.mmr} MMR` : "Unranked";

  const privateBadge = `<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:6px;width:100%;">
    <svg fill="#6a7a8a" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm.017-16.5c-11.065 0-8.94 9-3.962 9 .998 0 1.937-.485 2.536-1.31l.643-.885a.96.96 0 0 1 1.566 0l.643.886a3.136 3.136 0 0 0 2.535 1.309c4.747 0 7.266-9-3.961-9zM8.6 13.227c-1.026 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962zm6.8 0c-1.027 0-1.694-.601-2.002-.962a.408.408 0 0 1 0-.53c.308-.361.975-.962 2.002-.962 1.027 0 1.694.601 2.002.962.13.153.13.377 0 .53-.308.361-.976.962-2.002.962z"/>
    </svg>
    <span style="color:#6a7a8a;font-size:11px;font-weight:500">Private Profile</span>
  </div>`;

  const nameHtml = stats.isPrivate
    ? privateBadge
    : stats.personaName
      ? `<div class="dotastats-name">${stats.personaName}${stats.plusSubscriber ? ` <span class="dotastats-plus"><img src="${DOTA_PLUS_ICON}" alt="Dota Plus" /></span>` : ""}</div>`
      : privateBadge;

  const heroesHtml = stats.isPrivate ? "" : `
    <div class="dotastats-heroes" id="dotastats-heroes-${steamId}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span class="dotastats-heroes-title" style="margin-bottom:0">Top Heroes</span>
        <a href="https://www.dotabuff.com/players/${steamId}" target="_blank" style="display:flex;align-items:center;opacity:0.8;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
          <img src="${DOTABUFF_ICON}" style="width:16px;height:16px;object-fit:contain;" alt="Dotabuff" />
        </a>
      </div>
      ${[0,1,2].map(() => `
      <div class="dotastats-skel-row" style="margin-bottom:5px">
        <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:40px;height:22px;border-radius:3px;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:80px;height:11px"></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <div class="dotastats-skel-block" style="width:32px;height:11px"></div>
          <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
        </div>
      </div>`).join("")}
    </div>
  `;

  const activityHtml = `
    <div class="dotastats-activity" id="dotastats-activity-${steamId}">
      <div class="dotastats-hero-row">
        <span class="dotastats-hero-dot">&#8226;</span>
        <span class="dotastats-hero-name">Activity</span>
        <div class="dotastats-hero-stats" style="gap:6px">
          <div class="dotastats-skel-block" style="width:50px;height:10px;border-radius:3px"></div>
          <div class="dotastats-skel-block" style="width:60px;height:10px;border-radius:3px"></div>
        </div>
      </div>
    </div>
  `;

  const sinceText = stats.firstMatchDate ? `Since ${stats.firstMatchDate}` : "";
  const showMore = !(tier === 0 && stats.matches === 0) && !stats.isPrivate;

  return `
    <div class="dotastats-widget">
      ${heroesHtml}
      ${showMore ? `
      <div class="dotastats-expand-btn" id="dotastats-expand-btn-${steamId}" onclick="
        var p = document.getElementById('dotastats-expand-${steamId}');
        var arr = document.getElementById('dotastats-arrow-${steamId}');
        if(p.style.display==='none'){
          p.style.display='block';
          arr.style.transform='rotate(180deg)';
        } else {
          p.style.display='none';
          arr.style.transform='rotate(0deg)';
        }
      ">
        <span class="dotastats-expand-inner">
          <svg id="dotastats-arrow-${steamId}" class="dotastats-expand-arrow" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition:transform 0.2s">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          More
        </span>
      </div>
      <div id="dotastats-expand-${steamId}" style="display:none">
        <div id="dotastats-recent-${steamId}" class="dotastats-recent-matches">
          <div class="dotastats-heroes-title" style="margin-bottom:5px">Recent Matches</div>
          <div class="dotastats-recent-row">
            ${[0,1,2,3,4].map(() => `<div class="dotastats-skel-block" style="width:36px;height:22px;border-radius:4px"></div>`).join("")}
          </div>
        </div>
        ${activityHtml}
        <div class="dotastats-hero-row" style="margin-top:2px">
          <span class="dotastats-hero-dot">&#8226;</span>
          <span class="dotastats-hero-name">Main Role</span>
          <div class="dotastats-hero-stats">
            <span id="dotastats-role-${steamId}" style="color:#c6d4df">&#8212;</span>
          </div>
        </div>
        <div id="dotastats-teammates-${steamId}">
          <div style="margin-top:6px">
            <div class="dotastats-heroes-title" style="margin-bottom:5px">Teammates</div>
            ${[0,1,2].map(() => `
            <div class="dotastats-skel-row" style="margin-bottom:5px">
              <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
              <div class="dotastats-skel-block" style="width:22px;height:22px;border-radius:3px;flex-shrink:0"></div>
              <div class="dotastats-skel-block" style="width:80px;height:11px"></div>
              <div style="margin-left:auto;display:flex;gap:6px">
                <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
                <div class="dotastats-skel-block" style="width:28px;height:11px"></div>
              </div>
            </div>`).join("")}
          </div>
        </div>
      </div>` : ""}
      ${stats.isPrivate ? privateBadge : ""}
      <div class="dotastats-main" style="display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;margin-top:8px!important;">
        <img class="dotastats-rank-img" style="width:52px!important;height:52px!important;object-fit:contain!important;flex-shrink:0!important;" src="${rankImgUrl}" alt="${rankName}" />
        <div class="dotastats-info" style="flex:1!important;min-width:0!important;">
          ${stats.isPrivate ? "" : nameHtml}
          <div class="dotastats-rank-label" style="color:${rankColor}">${rankLabel}</div>
          <div class="dotastats-stats-row">
            <span><span class="dotastats-stat-val">${stats.matches}</span> matches</span>
            <span><span class="dotastats-stat-val">${stats.winrate}%</span> WR</span>
            <span class="dotastats-stat-val">${mmrText}</span>
          </div>
        </div>
      </div>
      ${sinceText ? `<div class="dotastats-footer"><span>${sinceText}</span></div>` : ""}
    </div>
  `;
}

async function updateWidget(container: Element, steamId: string) {
  container.innerHTML = `
    <div class="dotastats-skeleton">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="dotastats-skel-block" style="width:70px;height:9px"></div>
        <div class="dotastats-skel-block" style="width:16px;height:16px;border-radius:3px"></div>
      </div>
      <div class="dotastats-skel-row">
        <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:40px;height:22px;border-radius:3px;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:90px;height:11px"></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <div class="dotastats-skel-block" style="width:32px;height:11px"></div>
          <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
        </div>
      </div>
      <div class="dotastats-skel-row">
        <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:40px;height:22px;border-radius:3px;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:70px;height:11px"></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <div class="dotastats-skel-block" style="width:32px;height:11px"></div>
          <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
        </div>
      </div>
      <div class="dotastats-skel-row">
        <div class="dotastats-skel-block" style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:40px;height:22px;border-radius:3px;flex-shrink:0"></div>
        <div class="dotastats-skel-block" style="width:80px;height:11px"></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <div class="dotastats-skel-block" style="width:32px;height:11px"></div>
          <div class="dotastats-skel-block" style="width:36px;height:11px"></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
        <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(100,130,160,0.3))"></div>
        <div class="dotastats-skel-block" style="width:50px;height:9px;border-radius:4px"></div>
        <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,rgba(100,130,160,0.3))"></div>
      </div>
      <div class="dotastats-skel-row" style="align-items:flex-start;gap:10px;margin-top:4px">
        <div class="dotastats-skel-block" style="width:52px;height:52px;border-radius:4px;flex-shrink:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;padding-top:2px">
          <div class="dotastats-skel-block" style="width:110px;height:13px"></div>
          <div class="dotastats-skel-block" style="width:75px;height:11px"></div>
          <div style="display:flex;gap:8px">
            <div class="dotastats-skel-block" style="width:55px;height:11px"></div>
            <div class="dotastats-skel-block" style="width:55px;height:11px"></div>
            <div class="dotastats-skel-block" style="width:55px;height:11px"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const stats = await fetchDotaStats(steamId);
  if (!stats) {
    const fallback = await fetchOpenDotaStats(steamId);
    if (fallback) {
      container.innerHTML = buildFallbackWidgetHtml(fallback);
    } else {
      container.innerHTML = `<div class="dotastats-widget" style="color:#8f98a0;font-size:11px;padding:12px 14px;">Could not load Dota 2 stats.</div>`;
    }
    return;
  }
  container.innerHTML = buildWidgetHtml(stats, steamId);

  if (!stats.isPrivate) {
    const heroEl = container.querySelector(`#dotastats-heroes-${steamId}`);
    if (heroEl) heroEl.outerHTML = buildHeroesHtml(stats.topHeroes, steamId);

    try {
      const q2 = `{ player(steamAccountId: ${steamId}) {
        matchesGroupBy(request: { groupBy: LANE, playerList: SINGLE, take: 50000 }) {
          ... on MatchGroupByLaneType { lane matchCount }
        }
      } }`;
      const r2 = await fetch(STRATZ_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${STRATZ_TOKEN}` },
        body: JSON.stringify({ query: q2 }),
      });
      const j2 = await r2.json();
      console.log('[dotastats] q2 lane raw', JSON.stringify(j2?.data?.player?.matchesGroupBy), JSON.stringify(j2?.errors));
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
      console.log('[dotastats] roleCountMap from lane', JSON.stringify(roleCountMap));
      const mainRoleEntry = Object.entries(roleCountMap).sort((a, b) => b[1] - a[1])[0];
      const mainRole = mainRoleEntry ? parseInt(mainRoleEntry[0]) : null;

      const ROLE_NAMES: Record<number, string> = { 1: "Carry", 2: "Mid", 3: "Offlane", 4: "Soft Support", 5: "Hard Support" };
      const ROLE_COLORS: Record<number, string> = { 1: "#5b7fe8", 2: "#2a9aab", 3: "#c87d1a", 4: "#3a9e6e", 5: "#c0622a" };
      const ROLE_ICONS: Record<number, string> = {
        1: `<svg viewBox="0 0 24 24" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.792 16.244L.623 20.388a2.107 2.107 0 000 2.992h.002a2.136 2.136 0 003.01 0l4.167-4.142-3.01-2.994z" fill="url(#h1)" fill-opacity="0.7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.853 10.193c-.373.32-.597.78-.615 1.268-.018.49.17.964.517 1.309l8.53 8.478c.326.327.77.507 1.233.507a1.73 1.73 0 001.228-.51 1.717 1.717 0 00-.003-2.434c-.86-.855-1.857-1.843-1.857-1.843s8.881-7.06 10.836-8.612a1.18 1.18 0 00.43-.776c.17-1.423.668-5.646.845-7.124a.406.406 0 00-.119-.337.414.414 0 00-.34-.116l-6.767.843c-.304.038-.578.19-.77.427L7.134 12.245s-1.087-1.085-1.973-1.962a1.702 1.702 0 00-2.305-.09h-.003zm7.519 4.69l9.922-9.861a.79.79 0 10-1.124-1.116l-9.922 9.863a.782.782 0 000 1.114c.31.31.813.31 1.124 0z" fill="url(#b1)"/><defs><linearGradient id="h1" x1="3" y1="18" x2="6" y2="21.75" gradientUnits="userSpaceOnUse"><stop stop-color="#DDD"/><stop offset="1" stop-color="#838383"/></linearGradient><linearGradient id="b1" x1="23.915" y1="0" x2="6.387" y2="17.621" gradientUnits="userSpaceOnUse"><stop stop-color="hsl(231,54%,59%)"/><stop offset="1" stop-color="hsl(230,43%,45%)"/></linearGradient></defs></svg>`,
        2: `<svg viewBox="0 0 24 24" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.262 3.015l-1.148-1.15A1.092 1.092 0 0118.884 0h4.025A1.092 1.092 0 0124 1.09v4.024a1.093 1.093 0 01-1.865.773l-1.152-1.15-1.05 1.051c3.603 4.439 3.448 10.915-.469 15.177l.763 1.271a.65.65 0 01-.165.857c-.31.234-.713.533-1.037.778a.636.636 0 01-.5.119.642.642 0 01-.432-.281c-.4-.598-1.016-1.52-1.376-2.063a1.206 1.206 0 00-.828-.522c-1.857-.26-8.092-1.13-10.479-1.462a1.26 1.26 0 01-1.07-1.073C3.957 15.857 2.877 8.11 2.877 8.11a1.197 1.197 0 00-.519-.825C1.81 6.92.89 6.305.291 5.907a.655.655 0 01-.162-.934c.245-.323.547-.726.778-1.034a.65.65 0 01.856-.167l1.271.762C6.731 1.141 12.088.571 16.34 2.827a.535.535 0 01.126.852L15.094 5.05a.538.538 0 01-.609.107 8.72 8.72 0 00-9.27 1.328l1.35 9.228L19.263 3.015zm-1.4 4.844l-9.576 9.578 9.227 1.347a8.723 8.723 0 00.35-10.925z" fill="url(#bow2)"/><defs><linearGradient id="bow2" x1="25.081" y1="0" x2="1.254" y2="22.573" gradientUnits="userSpaceOnUse"><stop stop-color="hsl(187,60%,40%)"/><stop offset="1" stop-color="hsl(188,48%,38%)"/></linearGradient></defs></svg>`,
        3: `<svg viewBox="0 0 24 24" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M.75 3.3C.75 1.892 1.84.75 3.187.75H20.81c1.347 0 2.441 1.142 2.441 2.55v7.52a8.265 8.265 0 01-.803 3.56C20.953 17.45 17.43 23.25 12 23.25c-5.432 0-8.957-5.8-10.444-8.878a8.259 8.259 0 01-.799-3.553A2510.5 2510.5 0 01.75 3.3zm14.198 2.2a.509.509 0 00-.014-.482.462.462 0 00-.4-.238h-2.48a.469.469 0 00-.41.25c-.558 1.048-2.711 5.076-3.464 6.484-.054.1-.05.223.004.324.058.1.162.162.274.162h2.196c.169 0 .324.094.414.245.086.151.09.338.01.497-.64 1.242-1.93 3.75-2.646 5.148a.16.16 0 00.044.198c.06.046.144.04.198-.018 1.67-1.815 5.673-6.156 7.095-7.697a.338.338 0 00.061-.357.31.31 0 00-.288-.198h-2.008a.477.477 0 01-.407-.24.514.514 0 01-.011-.49c.49-.958 1.343-2.634 1.832-3.588z" fill="url(#sh3)"/><defs><linearGradient id="sh3" x1="12" y1="0.75" x2="12" y2="23.25" gradientUnits="userSpaceOnUse"><stop stop-color="hsl(33,79%,46%)"/><stop offset="1" stop-color="hsl(34,82%,36%)"/></linearGradient></defs></svg>`,
        4: `<svg viewBox="0 0 24 24" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.442 17.96l2.167-1.289a1.216 1.216 0 011.286.03l1.929 1.278a.392.392 0 01.005.65c-1.77 1.219-8 5.371-10.743 5.371-.926 0-7.725-2.097-7.725-2.097V14.69h2.704c.883 0 1.741.27 2.46.777l1.635 1.152h3.671c.44 0 1.484 0 1.484 1.342 0 1.453-1.143 1.453-1.484 1.453h-5.395a.564.564 0 00-.565.56c0 .308.254.558.565.558h5.75s.82.006 1.473-.578c.414-.368.783-.972.783-1.993z" fill="#DEDEDE"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.399 14.667c0-.602-.494-1.09-1.1-1.09h-2.2c-.606 0-1.099.488-1.099 1.09v7.214c0 .602.493 1.09 1.099 1.09h2.2c.607 0 1.1-.488 1.1-1.09v-7.214z" fill="url(#wr4)" fill-opacity="0.7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.594 10.114a.142.142 0 00.002-.274c-1.165-.402-2.238-1.461-2.635-2.62a.142.142 0 00-.274 0c-.39 1.16-1.443 2.247-2.6 2.63a.141.141 0 00-.003.273c1.158.402 2.21 1.465 2.603 2.617a.142.142 0 00.274 0c.397-1.162 1.468-2.232 2.633-2.626zm-7.54-3.583a.215.215 0 00.158-.208.214.214 0 00-.157-.209c-1.774-.615-3.408-2.227-4.013-3.994a.213.213 0 00-.21-.158.214.214 0 00-.207.16c-.597 1.767-2.2 3.423-3.963 4.005a.216.216 0 00-.004.417c1.765.612 3.369 2.232 3.966 3.988.027.094.111.16.209.16a.214.214 0 00.207-.16c.606-1.77 2.24-3.401 4.014-4.001zm4.87-4.187a.11.11 0 00.08-.106.112.112 0 00-.08-.108c-.91-.314-1.749-1.142-2.058-2.048A.113.113 0 0018.76 0a.113.113 0 00-.108.082c-.306.908-1.128 1.758-2.032 2.055a.11.11 0 00-.082.106.109.109 0 00.08.108c.905.314 1.728 1.145 2.034 2.047a.11.11 0 00.108.08c.05 0 .093-.032.106-.08.31-.91 1.148-1.745 2.058-2.054z" fill="url(#sp4)"/><defs><linearGradient id="wr4" x1="2.199" y1="13.577" x2="2.199" y2="22.971" gradientUnits="userSpaceOnUse"><stop stop-color="#DEDEDE"/><stop offset="1" stop-color="#7B7373"/></linearGradient><linearGradient id="sp4" x1="7.5" y1="0" x2="24" y2="13.5" gradientUnits="userSpaceOnUse"><stop stop-color="hsl(155,31%,48%)"/><stop offset="1" stop-color="hsl(158,78%,28%)"/></linearGradient></defs></svg>`,
        5: `<svg viewBox="0 0 24 24" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.442 18.141l2.167-1.25c.398-.23.898-.219 1.286.03l1.93 1.238a.373.373 0 01.005.63c-1.77 1.183-8 5.211-10.744 5.211-.926 0-7.725-2.034-7.725-2.034v-6.999h2.704c.881 0 1.741.265 2.46.755l1.635 1.117h3.671c.438 0 1.482 0 1.482 1.302 0 1.41-1.14 1.41-1.482 1.41h-5.395a.555.555 0 00-.565.543c0 .3.254.543.565.543h5.75s.82.004 1.473-.56c.414-.359.783-.944.783-1.936z" fill="#DEDEDE"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.399 15.02c0-.583-.494-1.058-1.1-1.058h-2.2c-.606 0-1.099.475-1.099 1.059v6.998c0 .583.493 1.057 1.099 1.057h2.2c.606 0 1.1-.474 1.1-1.057v-6.998z" fill="url(#wr5)" fill-opacity="0.7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.895 6.395a.32.32 0 00-.202-.246.336.336 0 00-.32.043c-.91.64-1.942.965-1.942.965.04-3.622-2.211-5.914-5.873-7.13a.51.51 0 00-.541.141.463.463 0 00-.065.537c.833 1.5 1.205 2.868 1.068 4.825 0 0-.924-.426-1.26-1.51a.314.314 0 00-.205-.21.344.344 0 00-.3.043c-3.528 2.588-2.893 10.11 4.131 10.11 5.095 0 5.928-4.594 5.51-7.568zm-5.31-.56a.14.14 0 00-.03-.152.149.149 0 00-.158-.03c-2.764 1.222-3.878 6.061-.325 6.061 3.384 0 2.143-3.47.852-4.149a.111.111 0 00-.116.01.108.108 0 00-.05.106c.065.512-.148.819-.686.779-.209-.812.152-1.83.513-2.624z" fill="url(#fl5)"/><defs><linearGradient id="wr5" x1="2.199" y1="13.962" x2="2.199" y2="23.076" gradientUnits="userSpaceOnUse"><stop stop-color="#DEDEDE"/><stop offset="1" stop-color="#7B7373"/></linearGradient><linearGradient id="fl5" x1="20.109" y1="0" x2="10.053" y2="15.082" gradientUnits="userSpaceOnUse"><stop stop-color="hsl(29,76%,39%)"/><stop offset="1" stop-color="hsl(335,58%,51%)"/></linearGradient></defs></svg>`,
      };

      if (mainRole) {
        const roleEl = container.querySelector(`#dotastats-role-${steamId}`);
        if (roleEl) roleEl.innerHTML = `
          <span style="display:inline-flex;align-items:center;gap:4px;vertical-align:middle">
            ${ROLE_ICONS[mainRole] ?? ""}
            <span style="color:${ROLE_COLORS[mainRole] ?? "#c6d4df"}">${ROLE_NAMES[mainRole] ?? ""}</span>
          </span>`;
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
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${STRATZ_TOKEN}` },
          body: JSON.stringify({ query: q }),
        });
        const j = await r.json();
        if (j?.errors) console.log(`[dotastats] q2b skip=${skip} errors`, JSON.stringify(j.errors));
        return j?.data?.player?.matches ?? [];
      };

      const batch1 = await Promise.all(Array.from({ length: 5 }, (_, i) => fetchMatchPage(i * 100)));
      const batch2 = await Promise.all(Array.from({ length: 5 }, (_, i) => fetchMatchPage((i + 5) * 100)));
      const allMatches: any[] = [...batch1.flat(), ...batch2.flat()];
      console.log('[dotastats] q2b total matches fetched', allMatches.length);

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
      console.log('[dotastats] topTeammates', JSON.stringify(topTeammates));
      const tmEl = container.querySelector(`#dotastats-teammates-${steamId}`);
      if (tmEl) {
        const tmHtml = buildTeammatesHtml(topTeammates);
        tmEl.innerHTML = tmHtml || `<div style="margin-top:6px"><div class="dotastats-heroes-title" style="margin-bottom:5px">Teammates</div><div style="color:#6a7a8a;font-size:10px;padding:2px 0">No data</div></div>`;
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${STRATZ_TOKEN}` },
        body: JSON.stringify({ query: q3 }),
      });
      const j3 = await r3.json();
      console.log('[dotastats] q3 activity', JSON.stringify(j3?.errors));
      const activityCount: number = (j3?.data?.player?.matchesGroupBy ?? [])
        .reduce((sum: number, g: any) => sum + (g.matchCount ?? 0), 0);
      const actEl = container.querySelector(`#dotastats-activity-${steamId}`);
      if (actEl) actEl.outerHTML = buildActivityFromDates(activityCount, steamId);
    } catch(e) { console.error('[dotastats] q3 error', e); }
  }
}

function getSteamIdFromUrl(url: string): string | null {
  const m = url.match(/\/profiles\/(\d+)/);
  return m ? m[1] : null;
}

function steamId64ToSteamId32(id64: string): string {
  return (BigInt(id64) - BigInt("76561197960265728")).toString();
}

async function getSteamId32(): Promise<string | null> {
  const urlId64 = getSteamIdFromUrl(window.location.href);
  if (urlId64) return steamId64ToSteamId32(urlId64);

  try {
    const res = await fetch(`${window.location.href}/?xml=1`);
    const xml = await res.text();
    const xmlDoc = new DOMParser().parseFromString(xml, "application/xml");
    const id64 = xmlDoc.querySelector("steamID64")?.textContent ?? null;
    if (id64) return steamId64ToSteamId32(id64);
  } catch {}

  return null;
}

export default async function WebkitMain() {
  const steamId32 = await getSteamId32();
  if (!steamId32) return;

  const containerId = `dotastats-container-${steamId32}`;
  if (document.getElementById(containerId)) return;

  let anchor: NodeListOf<Element> | null = null;
  for (let i = 0; i < 3; i++) {
    anchor = await Millennium.findElement(document, ".profile_rightcol", 8000).catch(() => null);
    if (anchor && anchor[0]) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!anchor || !anchor[0]) return;

  if (document.getElementById(containerId)) return;

  injectStyles();

  const container = document.createElement("div");
  container.id = containerId;
  anchor[0].prepend(container);

  updateWidget(container, steamId32);
}
