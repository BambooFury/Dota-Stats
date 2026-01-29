// Dota 2 Stats Plugin - Webkit Module
// Displays Dota 2 player statistics on Steam profile pages

console.log('[DotaStats Webkit] Loading...');

interface DotaStats {
  matches: number;
  mmr: number | null;
  winrate: number;
  rank: number | null;
  stars: number;
  leaderboardRank: number | null;
  personaName: string | null;
}

interface OpenDotaPlayer {
  mmr_estimate?: { estimate: number };
  solo_competitive_rank?: number;
  rank_tier?: number;
  leaderboard_rank?: number;
  profile?: { personaname: string };
}

interface OpenDotaWL {
  win: number;
  lose: number;
}

// Rank tier to MMR mapping (approximate values)
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

// Rank names
const RANK_NAMES: Record<number, string> = {
  1: "Herald",
  2: "Guardian",
  3: "Crusader",
  4: "Archon",
  5: "Legend",
  6: "Ancient",
  7: "Divine",
  8: "Immortal",
};

// Rank colors for glow effect
const RANK_COLORS: Record<number, string> = {
  1: "rgba(80, 200, 120, 0.9)",
  2: "rgba(180, 120, 60, 0.9)",
  3: "rgba(90, 200, 255, 0.9)",
  4: "rgba(140, 160, 255, 0.9)",
  5: "rgba(255, 215, 120, 0.95)",
  6: "rgba(255, 160, 90, 0.95)",
  7: "rgba(190, 120, 255, 0.95)",
  8: "rgba(255, 255, 255, 0.95)",
};

function injectStyles() {
  if (document.getElementById("dotastats-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "dotastats-style";
  style.textContent = `
    .dotastats-card {
      position: relative;
      overflow: visible;
      background: transparent;
      border-radius: 10px;
      padding: 14px 14px 10px;
      color: #f5f5f5;
      font-size: 13px;
      margin-bottom: 10px;
      box-shadow: none;
    }
    .dotastats-dotabuff-btn {
      position: absolute;
      top: 4px;
      right: 6px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
    }
    .dotastats-dotabuff-btn img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .dotastats-dotabuff-btn:hover img {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.95));
    }
    .dotastats-name-row {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .dotastats-name-row span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dotastats-rank {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 4px 0 0;
    }
    .dotastats-rank-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: transparent;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.65), 0 0 10px rgba(255, 190, 90, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .dotastats-rank-icon {
      width: 56px;
      height: 56px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .dotastats-rank-icon-unranked {
      transform: translateX(-2px);
    }
    .dotastats-top-rank {
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.9);
      pointer-events: none;
    }
    .dotastats-rank-label {
      margin-top: 2px;
      font-size: 11px;
      text-align: center;
      opacity: 0.95;
    }
    .dotastats-stats {
      position: relative;
      margin-top: 4px;
    }
    .dotastats-stats-line {
      font-size: 11px;
      text-align: center;
      white-space: nowrap;
    }
    .dotastats-stats-line b {
      font-weight: 600;
      font-size: 12px;
    }
    .dotastats-footer {
      position: relative;
      margin-top: 6px;
      border-top: 1px dashed rgba(255,255,255,0.18);
      padding-top: 4px;
      text-align: center;
      font-size: 11px;
    }
    .dotastats-footer a {
      color: #ffcc55;
      text-decoration: none;
      transition: color 0.15s ease, text-shadow 0.15s ease;
    }
    .dotastats-footer a:hover {
      color: #ffe08a;
      text-shadow: 0 0 6px rgba(255, 218, 120, 0.8);
    }
    .dotastats-source-note {
      margin-top: 3px;
      font-size: 9px;
      text-align: center;
      color: rgba(255, 255, 255, 0.45);
    }
  `;
  document.head.appendChild(style);
}

function createStatsWidget(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "account-row";
  wrapper.innerHTML = `
    <div class="dotastats-card">
      <a id="dotastats-dotabuff" class="dotastats-dotabuff-btn" href="#" target="_blank" title="Open Dotabuff">
        <img src="https://steamloopback.host/DotaRanks/dotabuff_icon.png" alt="Dotabuff" />
      </a>
      <div class="dotastats-name-row"><span id="dotastats-name"></span></div>
      <div class="dotastats-rank">
        <div id="dotastats-rank-circle" class="dotastats-rank-circle">
          <img id="dotastats-rank-icon" class="dotastats-rank-icon" src="https://steamloopback.host/DotaRanks/rank_icon_unranked.png" alt="Unranked" />
          <div id="dotastats-top-rank" class="dotastats-top-rank" style="display:none;"></div>
        </div>
      </div>
      <div id="dotastats-rank-label" class="dotastats-rank-label">Unranked</div>
      <div class="dotastats-stats">
        <div class="dotastats-stats-line">
          Matches: <b id="dotastats-matches">...</b>
          &nbsp; MMR: <b id="dotastats-mmr">...</b>
          &nbsp; WR: <b id="dotastats-winrate">...</b>
        </div>
      </div>
      <div class="dotastats-footer">
        <a id="dotastats-link" href="#" target="_blank">Show detailed Dota stats</a>
        <div class="dotastats-source-note">Data: OpenDota, may differ from Dota 2 client</div>
      </div>
    </div>
  `;
  return wrapper;
}

async function getSteamAccountId(): Promise<string | null> {
  try {
    const parser = new DOMParser();
    const xmlUrl = `${window.location.href}?xml=1`;
    const response = await fetch(xmlUrl);
    const xmlText = await response.text();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const steamID64 = xmlDoc.querySelector("steamID64")?.textContent || null;

    if (!steamID64) {
      console.error("[DotaStats] steamID64 not found in XML profile");
      return null;
    }

    // Convert SteamID64 to account ID
    const accountIdBase = BigInt("76561197960265728");
    const accountId = (BigInt(steamID64) - accountIdBase).toString();
    return accountId;
  } catch (error) {
    console.error("[DotaStats] Error getting Steam account ID:", error);
    return null;
  }
}

function openURL(url: string) {
  console.log("[DotaStats] Opening URL:", url);
  try {
    if ((window as any).SteamClient?.Browser?.OpenURL) {
      (window as any).SteamClient.Browser.OpenURL(url);
    } else if ((window as any).g_PopupManager?.ShowPopupBrowser) {
      (window as any).g_PopupManager.ShowPopupBrowser(url);
    } else {
      window.open(url, "_blank");
    }
  } catch (error) {
    console.error("[DotaStats] Error opening URL:", error);
  }
}

async function fetchDotaStats(accountId: string): Promise<DotaStats | null> {
  try {
    const [playerResponse, wlResponse] = await Promise.all([
      fetch(`https://api.opendota.com/api/players/${accountId}`),
      fetch(`https://api.opendota.com/api/players/${accountId}/wl`),
    ]);

    const playerData: OpenDotaPlayer = await playerResponse.json();
    const wlData: OpenDotaWL = await wlResponse.json();

    const wins = wlData.win || 0;
    const totalMatches = wins + (wlData.lose || 0);
    const winrate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    let mmr = playerData.mmr_estimate?.estimate || playerData.solo_competitive_rank || null;
    const rankTier = playerData.rank_tier || null;
    const leaderboardRank = playerData.leaderboard_rank || null;

    const personaName =
      (
        document.querySelector(".actual_persona_name")?.textContent ||
        document.querySelector(".profile_header .persona_name")?.textContent ||
        playerData.profile?.personaname ||
        ""
      ).trim() || null;

    let tier = 0;
    let stars = 0;

    if (rankTier) {
      const tierStr = String(rankTier).padStart(2, "0");
      tier = parseInt(tierStr.charAt(0), 10);
      stars = parseInt(tierStr.charAt(1), 10);

      if (!Number.isFinite(stars) || stars < 1) stars = 1;
      if (stars > 5) stars = 5;

      // Estimate MMR if not available
      if (mmr == null) {
        const tierMap = RANK_MMR_MAP[tier];
        if (tierMap) {
          mmr = tierMap[stars] || tierMap[5] || null;
        }
      }
    }

    return {
      matches: totalMatches,
      mmr,
      winrate,
      rank: tier,
      stars,
      leaderboardRank,
      personaName,
    };
  } catch (error) {
    console.error("[DotaStats] Error fetching stats:", error);
    return null;
  }
}

function updateWidget(stats: DotaStats) {
  const matchesEl = document.getElementById("dotastats-matches");
  const winrateEl = document.getElementById("dotastats-winrate");
  const mmrEl = document.getElementById("dotastats-mmr");
  const nameEl = document.getElementById("dotastats-name");
  const rankIconEl = document.getElementById("dotastats-rank-icon") as HTMLImageElement;
  const rankCircleEl = document.getElementById("dotastats-rank-circle") as HTMLElement;
  const rankLabelEl = document.getElementById("dotastats-rank-label");
  const topRankEl = document.getElementById("dotastats-top-rank") as HTMLElement;

  if (matchesEl) matchesEl.textContent = stats.matches > 0 ? String(stats.matches) : "hidden";
  if (winrateEl) winrateEl.textContent = stats.matches > 0 ? `${stats.winrate.toFixed(2)}%` : "hidden";
  if (nameEl) nameEl.textContent = stats.personaName || "";
  if (mmrEl) mmrEl.textContent = stats.mmr != null ? String(stats.mmr) : "";

  if (stats.rank && stats.rank > 0) {
    if (rankIconEl) {
      rankIconEl.src = `https://steamloopback.host/DotaRanks/rank_icon_${stats.rank}_${stats.stars}.png`;
      rankIconEl.classList.remove("dotastats-rank-icon-unranked");
    }

    if (rankCircleEl) {
      const glowColor = RANK_COLORS[stats.rank] || "rgba(255, 190, 90, 0.8)";
      rankCircleEl.style.boxShadow = `0 0 0 2px rgba(0, 0, 0, 0.65), 0 0 14px ${glowColor}`;
    }

    if (rankLabelEl) {
      const rankName = RANK_NAMES[stats.rank] || "Unranked";
      const label = stats.rank >= 8 ? rankName : `${rankName} ${stats.stars}`;
      rankLabelEl.textContent = label;
    }

    if (topRankEl && stats.rank === 8 && stats.leaderboardRank) {
      topRankEl.textContent = Number(stats.leaderboardRank).toLocaleString("en-US");
      topRankEl.style.display = "block";
    } else if (topRankEl) {
      topRankEl.style.display = "none";
    }
  } else {
    if (rankIconEl) {
      rankIconEl.src = "https://steamloopback.host/DotaRanks/rank_icon_unranked.png";
      rankIconEl.classList.add("dotastats-rank-icon-unranked");
    }
    if (rankLabelEl) rankLabelEl.textContent = "Unranked";
    if (topRankEl) topRankEl.style.display = "none";
    if (rankCircleEl) {
      rankCircleEl.style.boxShadow = "0 0 0 2px rgba(0, 0, 0, 0.65), 0 0 14px rgba(255, 255, 255, 0.95)";
    }
  }
}

async function injectWidget(container: Element, accountId: string) {
  const widget = createStatsWidget();
  container.insertBefore(widget, container.children[1] || null);

  // Setup click handlers
  const openDotaLink = document.getElementById("dotastats-link");
  const dotabuffLink = document.getElementById("dotastats-dotabuff");

  if (openDotaLink) {
    openDotaLink.onclick = (e) => {
      e.preventDefault();
      openURL(`https://www.opendota.com/players/${accountId}`);
    };
  }

  if (dotabuffLink) {
    dotabuffLink.onclick = (e) => {
      e.preventDefault();
      openURL(`https://www.dotabuff.com/players/${accountId}`);
    };
  }

  // Load stats
  const stats = await fetchDotaStats(accountId);
  if (stats) {
    updateWidget(stats);
  } else {
    const matchesEl = document.getElementById("dotastats-matches");
    const winrateEl = document.getElementById("dotastats-winrate");
    const mmrEl = document.getElementById("dotastats-mmr");
    if (matchesEl) matchesEl.textContent = "N/A";
    if (winrateEl) winrateEl.textContent = "N/A";
    if (mmrEl) mmrEl.textContent = "N/A";
  }
}

// Main initialization
async function init() {
  console.log("[DotaStats] Initializing...");

  // Wait for profile column
  const checkProfile = setInterval(async () => {
    const profileCol = document.querySelector(".profile_rightcol");
    if (!profileCol) return;

    clearInterval(checkProfile);

    // Check if already injected
    if (profileCol.querySelector(".dotastats-card")) {
      console.log("[DotaStats] Widget already exists");
      return;
    }

    injectStyles();

    const accountId = await getSteamAccountId();
    if (!accountId) {
      console.error("[DotaStats] Could not get account ID");
      return;
    }

    await injectWidget(profileCol, accountId);
    console.log("[DotaStats] Widget injected successfully");
  }, 500);

  // Timeout after 10 seconds
  setTimeout(() => clearInterval(checkProfile), 10000);
}

// Export for use from frontend
(window as any).DotaStatsWebkit = {
  fetchDotaStats,
  injectWidget,
  init,
};

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

console.log('[DotaStats Webkit] Loaded successfully');
