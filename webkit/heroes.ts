import { DOTABUFF_ICON } from "./constants";
import type { HeroStat } from "./types";

export function buildHeroesHtml(heroes: HeroStat[], steamId: string): string {
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
